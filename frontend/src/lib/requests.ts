import { getRequest } from "./api";


export async function getAddress(pk: number, signal: AbortSignal) {
    return getRequest(`/api/address/${pk}/`, signal);
}

export async function getLicenses(signal: AbortSignal) {
    return getRequest("api/licenses/", signal);
}

