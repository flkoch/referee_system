import { useEffect, useState, ChangeEvent, useMemo } from "react"
import { Form } from "react-bootstrap";
import api from "../lib/auth";
import EventList from "../components/Events";
import { type EventType } from "../lib/types";
import { formattedDate } from "../lib/helper";
import LoadingIndicator from "../components/LoadingIndicator";

function EventOverview() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setIsLoading(true);
        getEvents();
        setIsLoading(false);
    }, [])

    async function getEvents() {
        api.get("/api/events/future/")
            .then((res) => res.data)
            .then((data) => setEvents(data))
            .catch((error) => alert(error));
    };
    function includes(text: string, fields: string[]) {
        const lowerCaseText = text.toLowerCase()
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].toLowerCase().includes(lowerCaseText)) return true;
        }
        return false;
    }
    function filterWrapperText(text: string) {
        if (text.length == 0) return (_event: EventType) => true;
        return (event: EventType) => {
            return includes(text, [ // search in the following fields
                event.name,
                event.info,
                formattedDate(event.start, event.end),
                event.location.name,
                event.location.address.city,
            ])
        };
    }
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