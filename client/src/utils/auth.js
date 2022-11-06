import axios from "axios";
import { removeCookie, setCookie } from "./cookie";

export const loginHandler = (data) => {
    setCookie("access_token", data.accessToken, { path: "/" });
    setCookie("user", JSON.stringify(data.user), { path: "/" });

    axios.defaults.headers.authorization = `Bearer ${data.accessToken}`;

    const expires = new Date();
    expires.setDate(Date.now() + 1000 * 60 * 60 * 24); //하루

    setCookie("refresh_token", data.refreshToken, {
        path: "/",
        expires,
        secure: true,
        httpOnly: false, // dev/prod 에 따라 true / false 로 받게 했다.
    });
};

export const logoutHandler = () => {
    removeCookie("refresh_token");
    removeCookie("access_token");
    removeCookie("user");
    axios.defaults.headers.authorization = "";
};
