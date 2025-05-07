import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants";

export async function refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken == null) return null;
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

export function getUser(tk: string | null = null): number | undefined {
    if (tk) {
        // @ts-ignore: library issue
        return jwtDecode(tk).user_id
    }
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return;
    }
    // @ts-ignore: library issue
    return jwtDecode(token).user_id;
}

export async function validToken(): Promise<string | null> {
    var token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return refreshToken();
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