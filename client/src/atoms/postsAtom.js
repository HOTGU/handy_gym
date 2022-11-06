import { atom, selector, selectorFamily } from "recoil";
import { getPostById, fetchPostsApi } from "../api";

export const postsState = atom({
    key: "postsState",
    default: [],
});

export const fetchPostsLoadLimit = atom({
    key: "fetchPostsLoadLimit",
    default: 12,
});

export const fetchPostsLoadNumber = atom({
    key: "fetchPostsLoadNumber",
    default: 0,
});

export const fetchPostsIsLoading = atom({
    key: "fetchPostsIsLoading",
    default: false,
});

export const fetchPostsIsFetch = atom({
    key: "fetchPostsIsFetch",
    default: true,
});

export const postDetailAtom = atom({
    key: "detailPost",
    default: null,
});

export const postIdAtom = atom({
    key: "postId",
    default: "",
});

export const getPostQuery = selectorFamily({
    key: "getPostQuery",
    get: (postId) => async () => {
        const response = await getPostById(postId);
        return response.data;
    },
});

export const resetPostsSelector = selector({
    key: "resetPosts",
    get: ({ get }) => {},
    set: ({ set }) => {
        set(fetchPostsLoadNumber, 0);
        set(fetchPostsIsFetch, true);
    },
});

export const getFourPosts = selector({
    key: "getFourPostsQuery",
    get: async () => {
        const response = await fetchPostsApi(1, 4);
        return response.data;
    },
});
