import { Container, Row } from "react-bootstrap"
import { type EventType } from "../../../lib/types"
import LoadingIndicator from "../../../components/LoadingIndicator"
import { filterWrapperText } from "../utils/Events"
import { useEventsQuery } from "../hooks/useEventsQueries"
import EventCard from "./EventCard"


function EventList({ searchTerm }: { searchTerm: string }) {
    const eventsQuery = useEventsQuery()
    // if (!events) {
    // return <p className="mt-4">No events match your search criteria.</p>
    // }
    if (eventsQuery.isPending) return <LoadingIndicator size="15rem" />
    function filter(event: EventType) {
        return filterWrapperText(searchTerm)(event)
    }
    return (
        <Container className="px-0 mt-3">
            <Row xs={1} lg={2} className="g-3">
                {eventsQuery.data?.map((elem: EventType) => {
                    // const addressQuery = useAddressQuery(elem.location.address)
                    if (filter(elem)) {
                        return <EventCard event={elem} key={elem.id} />
                    }
                })}
            </Row>
        </Container>
    )
}

export default EventList