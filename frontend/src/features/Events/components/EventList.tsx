import { Container, Row } from "react-bootstrap"
import { type EventType } from "../../../lib/types"
import EventCard from "./EventCard"
import { filterWrapperText } from "../utils/Events"


function EventList({ events, searchTerm }: { events: EventType[] | undefined | void, searchTerm: string }) {
    if (!events) {
        return <p className="mt-4">No events match your search criteria.</p>
    }
    function filter(event: EventType) {
        return filterWrapperText(searchTerm)(event)
    }
    return (
        <Container className="px-0 mt-3">
            <Row xs={1} lg={2} className="g-3">
                {events?.map((elem) => {
                    if (filter(elem)) {
                        return <EventCard event={elem} key={elem.id} />
                    }
                })}
            </Row>
        </Container>
    )
}

export default EventList