import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    created: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
