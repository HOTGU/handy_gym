import mongoose from "mongoose";

const TokenSchema = mongoose.Schema({
    userId: String,
    token: String,
});

const RefreshToken = mongoose.model("RefreshToken", TokenSchema);

export default RefreshToken;
