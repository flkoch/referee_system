import { getRequest } from "../../../lib/api";

export async function getProfile(pk: number, signal: AbortSignal) {
    return getRequest(`/api/user/${pk}`, signal);
}
export async function getApplications(signal: AbortSignal) {
    return getRequest("/api/applications/", signal);
}
export async function getExaminations(signal: AbortSignal) {
    return getRequest("/api/examinations/user/", signal)
}