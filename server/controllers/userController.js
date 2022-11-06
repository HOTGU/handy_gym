import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../auth/token.js";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { createError } from "../auth/createError.js";

export const signup = async (req, res, next) => {
    const {
        body: { email, nickname, password, password1 },
    } = req;
    try {
        const userExists = await User.exists({ email });

        if (userExists)
            return next(createError(404, "이미 이메일로 가입된 유저가 있습니다"));

        if (password !== password1)
            return next(createError(404, "비밀번호가 틀렸습니다"));

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            nickname,
            password: hashedPassword,
            avatar: "",
        });
        res.status(200).json({ message: "회원가입 성공" });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return next(createError(400, "이메일로 가입된 유저가 없습니다"));

        const ok = await bcrypt.compare(req.body.password, user.password);

        if (!ok) return next(createError(404, "비밀번호가 틀렸습니다"));

        const { password, ...otherInfo } = user._doc;

        res.cookie(
            "user",
            { ...otherInfo },
            {
                secure: true,
            }
        );

        req.session.user = otherInfo;

        return res.status(200).json({ user: otherInfo });

        // const accessToken = createAccessToken(user._id);

        // const refreshToken = createRefreshToken();

        // await RefreshToken.create({ token: refreshToken, userId: user._id });
        // res.status(200).json({ user: { ...otherInfo }, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    const {
        params: { id },
    } = req;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const mePosts = async (req, res) => {
    const { user } = req;
    try {
        const posts = await Post.find({ creator: user }).populate("creator");
        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "뭔가 오류가 생겼습니다" });
    }
};

export const update = async (req, res, next) => {
    const {
        body: { nickname },
        file,
        user,
    } = req;
    try {
        const findUser = await User.findByIdAndUpdate(
            user._id,
            {
                nickname,
                avatar: file?.transforms[0]?.location,
            },
            { new: true }
        );

        const { password, ...otherInfo } = findUser._doc;

        req.session.user = otherInfo;

        res.cookie(
            "user",
            { ...otherInfo },
            {
                secure: true,
            }
        );

        res.status(200).json({ ...otherInfo });
    } catch (error) {
        console.log(error);
        return next(createError(500, "프로필 수정에 실패했습니다"));
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("user");
        req.session.destroy();
        // await RefreshToken.findOneAndRemove({ userId: req.userId });
        return res.status(200).json({ ok: true });
    } catch (error) {
        return next(error);
    }
};

export const refresh = async (req, res, next) => {
    const {
        body: { refreshToken },
    } = req;
    try {
        if (!refreshToken)
            return next(createError(401, "리프레쉬 토큰이 존재하지 않습니다"));
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, success) => {
                if (err) return next(createError(401, "리프레쉬 토큰 인증이 안됩니다"));

                const DBRefreshToken = await RefreshToken.findOne({
                    token: refreshToken,
                });

                if (!DBRefreshToken)
                    return next(createError(401, "리프레쉬 토큰 인증이 안됩니다"));

                const newAccessToken = createAccessToken(DBRefreshToken.userId);
                const newRefreshToken = createRefreshToken();

                DBRefreshToken.token = newRefreshToken;

                await DBRefreshToken.save();

                res.status(200).json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
        );
    } catch (error) {
        next(error);
    }
};
