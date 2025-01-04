import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import { type EventType, type LicenseType } from "../lib/types"
import LoadingIndicator from "../components/LoadingIndicator";
import EventDetailRender from "../features/Events/components/EventDetail";
import { getEvent, getLicenses } from "../features/Events/utils/Events";

function EventPage() {
    const [event, setEvent] = useState<EventType | null>(null);
    const { pk } = useParams()
    const [licenses, setLicenses] = useState<LicenseType[]>([])
    if (pk === undefined || Number.isNaN(parseInt(pk))) {
        return <NotFound />
    }
    useEffect(() => {
        getEvent(parseInt(pk), setEvent);
        getLicenses(setLicenses);
    }, []);

    return (
        <>
            {(event == null) ? <LoadingIndicator size="15rem" /> : <EventDetailRender event={event} licenses={licenses} />}
        </>
    )
}

export default EventPage