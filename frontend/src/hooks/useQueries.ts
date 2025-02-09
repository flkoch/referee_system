import { useQuery } from "@tanstack/react-query";
import { getAddress, getLicenses } from "../lib/requests";

export function useLicenseQuery() {
    return useQuery({
        queryKey: ["licenses"],
        queryFn: (obj) => getLicenses(obj.signal),
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 60 * 10,
    })
}

export function useAddressQuery(pk: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ["address", pk],
        queryFn: (obj) => getAddress(pk, obj.signal),
        enabled: enabled,
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 60 * 10,
    })
}