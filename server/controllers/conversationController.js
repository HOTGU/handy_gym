import { createError } from "../auth/createError.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Messages.js";

export const get = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            users: { $in: [req.userId] },
        });

        return res.status(200).json(conversations);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getPro = async (req, res, next) => {
    try {
        const conversations = await Conversation.find({
            users: { $in: [req.userId] },
            proUser: req.userId,
        });

        return res.status(200).json(conversations);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const create = async (req, res, next) => {
    const {
        body: { senderId, receiverId, text },
    } = req;
    try {
        if (!senderId && !receiverId)
            return next(createError(400, "쪽지 보내는 데 실패했습니다"));

        if (senderId === receiverId)
            return next(createError(400, "자신의 글에는 쪽지를 보낼 수 없습니다"));
        const conversationExists = await Conversation.exists({
            users: [senderId, receiverId],
        });

        if (conversationExists)
            return next(createError(400, "이미 유저한테 쪽지를 보냈습니다"));

        const newConversation = new Conversation({
            users: [senderId, receiverId],
            pro: {
                userId: senderId,
                proId: req.proId,
            },
        });

        await newConversation.save();

        const newMessage = new Message({
            conversationId: newConversation._id,
            sender: senderId,
            text,
        });

        await newMessage.save();

        return res.status(200).json(newConversation);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
