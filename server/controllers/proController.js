import { createError } from "../auth/createError.js";
import Pro from "../models/Pro.js";
import User from "../models/User.js";

export const get = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const proData = await Pro.findById(id);
        return res.status(200).json(proData);
    } catch (error) {
        return res.status(400).json({ message: "프로 정보 가져오기 실패" });
    }
};
export const getMe = async (req, res) => {
    try {
        const proData = await Pro.findById(req.user.isPro);
        return res.status(200).json(proData);
    } catch (error) {
        return res.status(400).json({ message: "프로 정보 가져오기 실패" });
    }
};

export const update = async (req, res, next) => {
    const {
        body: {
            name,
            category,
            career,
            title,
            selfIntroduction,
            material,
            programIntroduction,
            price,
            time,
            isFreePT,
            isLocation,
            location,
            photos,
        },
        files,
        proId,
    } = req;

    let updatedPhotos = [];

    if (photos) {
        if (typeof photos === "string") {
            updatedPhotos.push(photos);
        }
        if (typeof photos === "object") {
            for (let i = 0; i < photos?.length; i++) {
                updatedPhotos.push(photos[i]);
            }
        }
    }

    for (let v = 0; v < files?.photos?.length; v++) {
        updatedPhotos.push(files.photos[v].transforms[0].location);
    }

    try {
        const proData = await Pro.findByIdAndUpdate(
            proId,
            {
                avatar: files.avatar && files?.avatar[0]?.transforms[0]?.location,
                name,
                category,
                title,
                career,
                selfIntroduction,
                photos: updatedPhotos,
                programIntroduction,
                material: material ? material : [],
                price,
                time,
                isFreePT: isFreePT === "yes" ? true : false,
                isLocation: isLocation === "yes" ? true : false,
                location,
            },
            { new: true }
        );
        res.status(200).json();
    } catch (error) {
        console.log(error);
        next(createError(400, "프로 업데이트 실패"));
    }
};

export const register = async (req, res, next) => {
    const {
        body: {
            name,
            category,
            career,
            title,
            selfIntroduction,
            material,
            programIntroduction,
            price,
            time,
            isFreePT,
            isLocation,
            location,
        },
        files,
        user,
    } = req;

    let photosArr = [];

    for (let v = 0; v < files.photos.length; v++) {
        photosArr.push(files.photos[v].transforms[0].location);
    }

    try {
        const findUser = await User.findById(user._id);
        if (findUser.isPro)
            return res.status(400).json({ message: "이미 프로 프로필이 있습니다" });
        const proData = await Pro.create({
            avatar: files.avatar[0].transforms[0].location,
            name,
            category,
            title,
            career,
            selfIntroduction,
            photos: photosArr,
            programIntroduction,
            material: material ? material : [],
            price,
            time,
            isFreePT: isFreePT === "yes" ? true : false,
            isLocation: isLocation === "yes" ? true : false,
            location,
        });
        findUser.isPro = findUser._id;
        await findUser.save();
        res.status(200).json(proData._id);
    } catch (error) {
        res.status(400).json({ message: "뭔가 오류가 생겼습니다 다시 시도해주세요" });
    }
};
