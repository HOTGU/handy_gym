import { emailTransport } from "../auth/emailTransport.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import { createError } from "../auth/createError.js";
dotenv.config();

export const send = async (req, res, next) => {
    const {
        body: { email },
    } = req;
    try {
        if (!email) return next(createError(500, "이메일을 입력해주세요"));

        const userExists = await User.exists({ email });

        if (userExists) return next(createError(500, "이미 가입된 이메일이 있습니다"));

        let number = Math.floor(Math.random() * 1000000) + 100000;
        if (number > 1000000) {
            number = number - 100000;
        }

        console.log(number);

        await emailTransport.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: req.body.email,
            subject: "핸디짐에서 보낸 인증번호입니다.", //메일 제목
            text: `인증번호는 ${number}입니다.`,
        });

        return res.status(200).json(number);
    } catch (error) {
        return next(error);
    }
};
