import { Card, Col, Container, Row } from "react-bootstrap"
import { type EventType } from "../lib/types"
import { formattedDate } from "../lib/functions"


function EventCard({ event }: { event: EventType }) {
    return (
        <Col>
            <Card className="">
                <Card.Header className="d-flex justify-content-between bg-primary text-white">
                    <p className="">
                        {formattedDate(event.start, event.end)}
                    </p>
                    <p className="">
                        {event.location.name} ({event.location.address.city})
                    </p>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Body>{event.info}</Card.Body>
                </Card.Body>
            </Card>
        </Col>
    )
}
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