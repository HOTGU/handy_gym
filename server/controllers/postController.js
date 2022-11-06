import Post from "../models/Post.js";

export const fetch = async (req, res) => {
    const {
        query: { loadNumber, loadLimit },
    } = req;
    try {
        const posts = await Post.find()
            .skip((parseInt(loadNumber) - 1) * parseInt(loadLimit))
            .limit(parseInt(loadLimit))
            .sort({ created: -1 })
            .populate("creator");
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "뭔가 오류가 생겼습니다" });
    }
};
export const search = async (req, res) => {
    const {
        query: { category, location, loadNumber, loadLimit },
    } = req;
    try {
        let posts;
        if (!category && !location) {
            return res.status(400).json({ message: "동네와 운동을 선택해주세요" });
        }
        if (category && location) {
            posts = await Post.find({ $and: [{ category }, { location }] })
                .skip((parseInt(loadNumber) - 1) * parseInt(loadLimit))
                .limit(parseInt(loadLimit))
                .sort({ created: -1 })
                .populate("creator");
        }
        if (!category || !location) {
            posts = await Post.find({ $or: [{ category }, { location }] })
                .skip((parseInt(loadNumber) - 1) * parseInt(loadLimit))
                .limit(parseInt(loadLimit))
                .sort({ created: -1 })
                .populate("creator");
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: "조금 있다가 다시 시도해보세요" });
    }
};
export const getById = async (req, res) => {
    const {
        params: { id },
    } = req;
    try {
        const post = await Post.findById(id).populate("creator");
        res.status(200).json(post);
    } catch (error) {
        res.status(400);
    }
};

export const create = async (req, res) => {
    const {
        body: { title, location, category, description },
        user,
    } = req;
    try {
        const newPost = await Post.create({
            title,
            location,
            category,
            description,
            creator: user,
        });
        await newPost.populate("creator");
        res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json();
    }
};

export const update = async (req, res) => {
    const {
        body: { title, location, category, description },
        params: { id },
        user,
    } = req;
    try {
        const post = await Post.findById(id).populate("creator");

        if (post.creator.id !== user._id) res.status(400).json();
        post.title = title;
        post.location = location;
        post.category = category;
        post.description = description;

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        return res.status(500).json();
    }
};

export const remove = async (req, res) => {
    const {
        params: { id },
        user,
    } = req;
    try {
        const post = await Post.findById(id).populate("creator");
        if (post.creator.id !== user._id) res.status(400).json();
        await post.remove();

        res.status(200).json();
    } catch (error) {
        return res.status(500).json();
    }
};
