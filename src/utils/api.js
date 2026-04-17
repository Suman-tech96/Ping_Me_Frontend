import axios from "axios";

const API = axios.create({
    baseURL: "https://ping-me-backend-09ed.onrender.com/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("chatToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
