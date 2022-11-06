import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import multerS3 from "multer-s3-transform";
import aws from "aws-sdk";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { createError } from "./auth/createError.js";

let s3 = new aws.S3({
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SECRET,
    region: process.env.AWS_S3_REGION,
});

const userAvatarUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "resized",
                key: function (req, file, cb) {
                    cb(null, `user_avatar/${Date.now()}_${file.originalname}`);
                },
                transform: function (req, file, cb) {
                    cb(null, sharp().resize(100, 100));
                },
            },
        ],
        acl: "public-read",
    }),
});

const proPhotosUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: true,
        transforms: [
            {
                id: "resized",
                key: function (req, file, cb) {
                    if (file.fieldname === "avatar") {
                        cb(null, `pro/avatar/${Date.now()}_${file.originalname}`);
                    }
                    if (file.fieldname === "photos") {
                        cb(null, `pro/photos/${Date.now()}_${file.originalname}`);
                    }
                },
                transform: function (req, file, cb) {
                    if (file.fieldname === "avatar") {
                        cb(null, sharp().resize(100, 100));
                    }
                    if (file.fieldname === "photos") {
                        cb(null, sharp().resize(400, 500));
                    }
                },
            },
        ],
        acl: "public-read",
    }),
});

export const userAvatarMulter = userAvatarUpload.single("avatar");
export const proPhotosMulter = proPhotosUpload.fields([
    { name: "avatar" },
    { name: "photos" },
]);

export const onlyUser = async (req, res, next) => {
    if (!req.session.user) {
        return next(createError(401, "유저만 이용가능합니다"));
    }
    req.user = req.session.user;
    next();
};

export const onlyPro = async (req, res, next) => {
    if (!req.user.isPro) {
        return next(createError(401, "프로만 이용가능합니다"));
    }
    next();
};
// export const onlyUser = async (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (token) {
//         try {
//             const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//             req.userId = user.id;
//             next();
//         } catch (error) {
//             return next(createError(401, "토큰 인증이 안됩니다"));
//         }
//     } else {
//         return next(createError(401, "토큰이 없습니다. 로그인해주세요"));
//     }
// };

// export const onlyPro = async (req, res, next) => {
//     const { userId } = req;
//     try {
//         const user = await User.findById(userId);
//         const proId = user.isPro;
//         if (proId) {
//             req.proId = user.isPro;
//             next();
//         } else {
//             return next(createError(403, "프로 프로필이 있어야 이용가능합니다"));
//         }
//     } catch (error) {
//         return next(createError(403, "프로 인증과정에서 문제 발생"));
//     }
// };
