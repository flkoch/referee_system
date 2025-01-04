import { MouseEvent } from "react";
import { toast } from "react-toastify";
import api from "../../../lib/api";
import { getUser } from "../../../lib/auth";

export function handleApply(id: number) {
    return async function handlerFunction(_event: MouseEvent) {
        api.post("/api/applications/", { "competition": id, "user": getUser() })
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Your application was received and registered.");
                }
            })
            .catch((error) => {
                if (error.status === 400) {
                    for (const [_key, value] of Object.entries(error.response?.data)) {
                        toast.error(String(value));
                    }
                } else if (error.status === 403) {
                    toast.error("You are not allowed to apply.");
                } else {
                    console.error(error);
                }
            })
    }
}