import { atom, selector } from "recoil";
import { getMeProApi, getProApi } from "../api";

export const isProAtom = atom({
    key: "isProAtom",
    default: Boolean(localStorage.getItem("isPro") === "true"),
});

export const proDataSelector = selector({
    key: "proDataSelector",
    get: async ({ get }) => {
        const response = await getProApi();
        return response.data;
    },
});

export const myProDataTrigger = atom({
    key: "proDataAtom",
    default: Date.now(),
});

export const myProDataSelector = selector({
    key: "myProDataSelector",
    get: async ({ get }) => {
        get(myProDataTrigger);
        const response = await getMeProApi();
        return response.data;
    },
});
