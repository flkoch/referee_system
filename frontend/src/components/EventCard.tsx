import { Card } from "react-bootstrap"
import { type EventType, type Notification } from "../lib/types"

function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", { dateStyle: "medium" })
}

function formattedDate(d1: string, d2: string | null) {
    const D1 = new Date(d1);
    if (d2 === null) return formatDate(D1);
    const D2 = new Date(d2);
    if (D1.getDate() != D2.getDate()) {
        return formatDate(D1) + " - " + formatDate(D2)
    }
    return formatDate(D1)
}

function EventCard({ event }: { event: EventType }) {
    return (
        <Card className="full-width my-3">
            <Card.Body>
                <Card.Header className="d-md-flex justify-content-md-between bg-primary text-white">
                    <p className="">
                        {formattedDate(event.start, event.end)}
                    </p>
                    <p className="">
                        {event.location.name} ({event.location.address.city})
                    </p>
                </Card.Header>
                <Card.Title>{event.name}</Card.Title>
                <Card.Body>{event.info}</Card.Body>
            </Card.Body>
        </Card>
    )
}

export default EventCard