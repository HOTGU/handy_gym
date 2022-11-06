import mongoose from "mongoose";

const ProSchema = mongoose.Schema({
    avatar: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    career: { type: Number, required: true },
    title: { type: String, required: true },
    selfIntroduction: { type: String, required: true },
    photos: { type: Array, required: true },
    programIntroduction: { type: String, required: true },
    price: { type: String, required: true },
    time: { type: Number, required: true },
    isFreePT: { type: Boolean, required: true },
    isLocation: { type: Boolean, required: true },
    location: String,
    material: Array,
});

const Pro = mongoose.model("Pro", ProSchema);

export default Pro;
