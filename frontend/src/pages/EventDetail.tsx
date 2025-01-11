import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import EventDetailRender from "../features/Events/components/EventDetail";

function EventPage() {
    const { pk } = useParams()
    if (pk === undefined || Number.isNaN(parseInt(pk))) {
        return <NotFound />
    }

    return (
        <>
            <EventDetailRender pk={parseInt(pk)} />
        </>
    )
}

export default EventPage