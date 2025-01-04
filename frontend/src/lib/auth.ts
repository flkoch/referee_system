import axios from "axios";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";

export async function refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const url = import.meta.env.VITE_API_URL;
    try {
        const res = await axios.post(url + "/api/token/refresh/", {
            refresh: refreshToken,
        });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return res.data.access;
        } else {
            window.location.href = "/login";
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function getUser() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;
    const decoded = jwtDecode(token);
    // @ts-ignore: library issue
    return decoded.user_id
}

export async function validToken(): Promise<string | null> {
    var token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return null;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration === undefined || tokenExpiration < now - 30) {
        return refreshToken();
    } else {
        return token;
    }
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const requestPending = new Map();

api.interceptors.request.use(
    async (config) => {
        const requestID = `${config.url}_${config.method}`;
        if (requestPending.has(requestID)) {
            const controller = requestPending.get(requestID);
            controller.abort();
        }
        const controller = new AbortController();
        config.signal = controller.signal;
        requestPending.set(requestID, controller);
        const token = await validToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => {
        const requestID = `${error.config.url}_${error.config.method}`;
        requestPending.delete(requestID)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        const requestID = `${response.config.url}_${response.config.method}`;
        requestPending.delete(requestID);
        return response
    }, (error) => {
        if (error.config) {
            requestPending.delete(`${error.config.url}_${error.config.method}`);
        }
        return Promise.reject(error);
    }
)

export default api