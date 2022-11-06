import mongoose from "mongoose";

const ConversationSchema = mongoose.Schema(
    {
        users: { type: Array, required: true },
        pro: {
            userId: { type: String, required: true },
            proId: { type: String, required: true },
        },
    },
    {
        timestamps: true,
    }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
