import { useEffect, useState, ChangeEvent, useMemo } from "react"
import { Form } from "react-bootstrap";
import EventList from "../features/Events/components/EventList";
import { type EventType } from "../lib/types";
import LoadingIndicator from "../components/LoadingIndicator";
import { filterWrapperText, getEvents } from "../features/Events/utils/Events";

function EventOverview() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setIsLoading(true);
        getEvents(setEvents);
        setIsLoading(false);
    }, [])

    function updateSearch(e: ChangeEvent<HTMLInputElement>) {
        if (e == undefined) return;
        e.preventDefault()
        setSearchTerm(e.target.value.trimStart());
    }
    const filteredEvents = useMemo(() => events.filter(filterWrapperText(searchTerm)), [events, searchTerm])
    return (
        <>
            <h1 className="mb-4">Upcoming Events</h1>
            <Form>
                <Form.Control tabIndex={1} aria-label="Search Events" type="text" placeholder="Search" onChange={updateSearch} value={searchTerm}></Form.Control>
            </Form>
            {isLoading ? <LoadingIndicator /> : <EventList events={filteredEvents} />}
        </>
    );
}

export default EventOverview