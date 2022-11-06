import { atom } from "recoil";
import { getCookie } from "../utils/cookie";

export const isAuthAtom = atom({
    key: "auth",
    default: {
        loading: false,
        user: getCookie("user") || null,
    },
});
