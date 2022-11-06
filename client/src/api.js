import axios from "axios";
import jwt_decode from "jwt-decode";
import { getCookie, removeCookie, setCookie } from "./utils/cookie";

axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true;

const axiosJWT = axios.create();

axiosJWT.defaults.withCredentials = true;

axiosJWT.interceptors.request.use(
    async (config) => {
        let currentDate = new Date();
        const decodedToken = jwt_decode(getCookie("access_token"));

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            const res = await refreshApi({ refreshToken: getCookie("refresh_token") });
            const refreshExpires = new Date();
            refreshExpires.setDate(Date.now() + 1000 * 60 * 60 * 24); //하루
            setCookie("access_token", res.data.accessToken, {
                path: "/",
            });
            setCookie("refresh_token", res.data.refreshToken, {
                path: "/",
                refreshExpires,
                secure: true,
                httpOnly: false,
            });
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosJWT.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response.status === 401) {
            removeCookie("access_token");
            removeCookie("refresh_token");
            removeCookie("user");
            window.location.href = "/auth";
            window.alert("인증시간 만료되었습니다 로그인을 다시 해주세요");
        }
        return Promise.reject(error);
    }
);

// User

export const signupApi = (data) => axios.post("/user/signup", data);

export const signinApi = (data) => axios.post("/user/signin", data);

export const refreshApi = (refreshToken) => axios.post("/user/refresh", refreshToken);

export const getMe = () => axios.get(`/user/me`);

export const getUserApi = (id) => axios.get(`/user/${id}`);

export const getMePosts = () => axios.get(`/user/me/posts`);

export const updateMe = (data) =>
    axios.post(`/user/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const logoutApi = () => axios.post("/user/logout");

// Pro

export const getProApi = (id) => axios.get(`/pro/get/${id}`);

export const getMeProApi = () => axios.get("/pro/me");

export const updateProApi = (data) =>
    axios.post(`/pro/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const registerProApi = (data) =>
    axios.post("/pro/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

// Address

export const getAddressByTerm = (term) => axios.get(`/address/search?term=${term}`);

// Post

export const createPostApi = (data) => axios.post(`/post/create`, data);

export const updatePostApi = (id, data) => axios.post(`/post/${id}/update`, data);
export const deletePostApi = (id) => axios.get(`/post/${id}/delete`);

export const fetchPostsApi = (loadNumber, loadLimit) =>
    axios.get(`/post/fetch?loadNumber=${loadNumber}&loadLimit=${loadLimit}`);

export const searchApi = (category, location, loadNumber, loadLimit) =>
    axios.get(
        `/post/search?category=${category}&location=${location}&loadNumber=${loadNumber}&loadLimit=${loadLimit}`
    );

export const getPostById = (id) => axios.get(`/post/${id}`);

// Email

export const sendEmailApi = (email) => axios.post(`/email/send`, email);

// Conversation

export const createConversationApi = (data) => axios.post("/conversation/create", data);

export const getConversationApi = () => axios.get("/conversation/get");
export const getProConversationApi = () => axios.get("/conversation/get/is-pro");

// Message

export const addMessageApi = (data) => axios.post("/message/add", data);

export const getMessageApi = (conversationId) => axios.get(`/message/${conversationId}`);
