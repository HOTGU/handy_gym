import Address from "../models/Address.js";

export const search = async (req, res) => {
    const { term } = req.query;
    console.log(term);
    try {
        if (term === "" || term === undefined || term === null) {
            return res
                .status(400)
                .json({ searchedAddress: [], message: "검색단어를 입력해주세요" });
        }
        const searchedAddress = await Address.find({ dong: { $regex: term } });

        return res.status(200).json(searchedAddress);
    } catch (error) {
        console.log(error);
    }
};
