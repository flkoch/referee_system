import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import LoadingIndicator from "../components/LoadingIndicator";
import EventDetailRender from "../features/Events/components/EventDetail";
import { getEvent, getLicenses } from "../features/Events/utils/Events";
import { useQuery } from "@tanstack/react-query";

function EventPage() {
    const { pk } = useParams()
    if (pk === undefined || Number.isNaN(parseInt(pk))) {
        return <NotFound />
    }

    const eventQuery = useQuery({
        queryKey: ["event", pk],
        queryFn: (obj) => getEvent(parseInt(pk), obj.signal),
        staleTime: 1000 * 60 * 10,
    })

    const licenseQuery = useQuery({
        queryKey: ["license"],
        queryFn: (obj) => getLicenses(obj.signal),
        staleTime: 1000 * 60 * 10,
    })

    return (
        <>
            {(eventQuery.isLoading) ? <LoadingIndicator size="15rem" /> : <EventDetailRender event={eventQuery.data} licenses={licenseQuery.data} />}
        </>
    )
}

export default EventPage