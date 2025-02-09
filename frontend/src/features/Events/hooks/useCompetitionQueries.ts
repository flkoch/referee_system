import { useQuery } from "@tanstack/react-query";
import { getCompetition } from "../utils/Competition";

export function useCompetitionQuery(competition: number) {
    return useQuery({
        queryKey: ['competiiton', competition],
        queryFn: (obj) => getCompetition(competition, obj.signal),
        gcTime: 1000 * 60 * 30,
        staleTime: 1000 * 60 * 10,
    })
}