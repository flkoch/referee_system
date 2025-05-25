import { useQuery } from "@tanstack/react-query"
import { getEvent, getEvents } from "../utils/Events"

export function useEventsQuery() {
    return useQuery({
        queryKey: ["events"],
        queryFn: (obj) => {
            return getEvents(obj.signal)
        },
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    })
}

export function useEventQuery(pk: number, enabled: boolean = true) {
    return useQuery({
        queryKey: ["events", pk],
        queryFn: (obj) => getEvent(pk, obj.signal),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        enabled: enabled
    })
}