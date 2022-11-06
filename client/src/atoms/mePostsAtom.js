import { atom, selector } from "recoil";
// import { getMePosts } from "../api";

export const mePostsState = atom({
    key: "mePostsState",
    default: [],
});

export const mePostsLoading = atom({
    key: "mePostsLoading",
    default: false,
});

// export const mePostsSelector = selector({
//     key: "mePostsSelector",
//     get: async ({}) => {
//         const { data } = await getMePosts();
//         return data;
//     },
// });

export const resetMePostsSelector = selector({
    key: "resetMePosts",
    get: ({ get }) => {},
    set: ({ set }) => {
        set(mePostsState, []);
    },
});
