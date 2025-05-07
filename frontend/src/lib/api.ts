import axios from "axios";
import { validToken } from "./auth";

export const api = axios.create({
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

export async function getRequest(url: string, signal: AbortSignal) {
    return api.get(url, { signal })
        .then((res) => res.data)
}

export default api