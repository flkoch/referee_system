import axios from "axios";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export async function refreshToken() {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    const url = import.meta.env.VITE_API_URL;
    const nagigate = useNavigate()
    console.log("Refresh triggered")
    try {
        const res = await axios.post(url + "/api/token/refresh/", {
            refresh: refreshToken,
        });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
        } else {
            nagigate("/login");
        }
    } catch (error) {
        console.log(error)
    }
}

export function getUser() {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;
    const decoded = jwtDecode(token);
    // @ts-ignore: library issue
    return decoded.user_id
}