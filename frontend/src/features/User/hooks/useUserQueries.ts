import { useQuery } from "@tanstack/react-query";
import { getApplications, getExaminations, getProfile } from "../utils/User";

export function useProfileQuery(pk: number) {
    return useQuery({
        queryKey: ["profile", pk],
        queryFn: (obj) => getProfile(pk, obj.signal),
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 60 * 10,
    })
}
export function useApplicationQuery(user: number) {
    return useQuery({
        queryKey: ['registrations', 'user', user],
        queryFn: (obj) => getApplications(obj.signal),
        gcTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 2,
    })
}
export function useExaminationQuery(user: number) {
    return useQuery({
        queryKey: ['examination', 'user', user],
        queryFn: (obj) => getExaminations(obj.signal),
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 60 * 10,
    })
}