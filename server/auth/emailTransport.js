import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const emailTransport = nodemailer.createTransport({
    service: "gmail", //사용하고자 하는 서비스
    prot: 587,
    host: "smtp.gmail.com",
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL_EMAIL, //gmail주소입력
        pass: process.env.GMAIL_PASSWORD, //gmail패스워드 입력
    },
});
