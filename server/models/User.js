import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    email: { type: String, required: true },
    avatar: { type: String, default: "" },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    isPro: { type: mongoose.Types.ObjectId, ref: "Pro" },
});

const User = mongoose.model("User", UserSchema);

export default User;
