import { Container, Row } from "react-bootstrap"
import { type EventType } from "../../../lib/types"
import EventCard from "./EventCard"


function EventList({ events }: { events: EventType[] }) {
    return (
        <Container className="px-0 mt-3">
            <Row xs={1} lg={2} className="g-3">
                {events.map((elem) => <EventCard event={elem} key={elem.id} />)}
            </Row>
        </Container>
    )
}

export default EventList