import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256", // 암호화 알고리즘
        expiresIn: "1h", // 유효기간
    });
};

export const createRefreshToken = () => {
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256", // 암호화 알고리즘
        expiresIn: "14d", // 유효기간
    });
};
