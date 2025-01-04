import axios from "axios"
import { ACCESS_TOKEN } from "./lib/constants"
import { refreshToken } from "./lib/auth";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.log("1111")
        console.log(error)
        if (error.response.status == 401) {
            return refreshToken();
        }
        return Promise.reject(error)
    }
)
export default api