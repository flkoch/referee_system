import { useNavigate } from "react-router-dom"
import { Button, Card, Col } from "react-bootstrap"
import { type EventType } from "../../../lib/types"
import { formattedDateRange } from "../../../lib/helper"
import { useAddressQuery } from "../../../hooks/useQueries"

function openDetail(id: number) {
    const navigate = useNavigate()
    return () => navigate(`/events/${id}`);
}
function EventCard({ event }: { event: EventType }) {
    const addressQuery = useAddressQuery(event.location.address);
    return (
        <Col>
            <Card className="">
                <Card.Header className="d-flex justify-content-between bg-primary text-white">
                    <p className="">
                        {formattedDateRange(event.start, event.end)}
                    </p>
                    <p className="">
                        {event.location.name} ({!addressQuery.isPending && addressQuery.data.city})
                    </p>
                </Card.Header>
                <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Text>{event.info}</Card.Text>
                    <Button variant="primary" onClick={openDetail(event.id)}>Details</Button>
                </Card.Body>
            </Card>
        </Col>
    )
}

export default EventCard