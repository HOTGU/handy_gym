import Message from "../models/Messages.js";

export const add = async (req, res, next) => {
    const {
        body: { conversationId, sender, text },
    } = req;
    try {
        const newMessage = new Message({
            conversationId,
            sender,
            text,
        });
        await newMessage.save();
        return res.status(200).json(newMessage);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const get = async (req, res, next) => {
    const {
        params: { conversationId },
    } = req;
    try {
        const messages = await Message.find({
            conversationId,
        });
        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        next(error);
    }
};
