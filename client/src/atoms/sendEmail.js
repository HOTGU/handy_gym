import { atom } from "recoil";

export const verifyEmailAtom = atom({
    key: "verifyEmailAtom",
    default: {
        success: false,
        loading: false,
        email: null,
        number: null,
    },
});
