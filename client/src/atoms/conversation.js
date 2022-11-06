import { atom, selector } from "recoil";
import { getMessageApi } from "../api";

export const conversationId = atom({
    key: "conversationId",
    default: "",
});

export const getMessageByConversation = selector({
    key: "getMessageQuery",
    get: async ({ get }) => {
        try {
            const id = get(conversationId);
            console.log("셀레ㅐㄱ터실행");
            const res = await getMessageApi(id);
            console.log(res);
        } catch (error) {
            console.log(error.response);
        }
    },
});
