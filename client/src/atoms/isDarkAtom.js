import { atom } from "recoil";

export const isDarkAtom = atom({
    key: "isDarkState",
    default: Boolean(localStorage.getItem("isDark") === "true"),
});
