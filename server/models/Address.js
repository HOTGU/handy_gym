import mongoose from "mongoose";

const AddressSchema = mongoose.Schema({
    sido: String,
    sigungu: String,
    dong: String,
    fulladd: String,
    seconadd: String,
});

const Address = mongoose.model("Address", AddressSchema);

export default Address;
