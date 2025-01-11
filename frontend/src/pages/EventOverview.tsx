import { useState, ChangeEvent } from "react"
import { Form } from "react-bootstrap";
import EventList from "../features/Events/components/EventList";
import LoadingIndicator from "../components/LoadingIndicator";
import { getEvents } from "../features/Events/utils/Events";
import { useQuery } from "@tanstack/react-query";

function EventOverview() {
    const [searchTerm, setSearchTerm] = useState("");

    const eventsQuery = useQuery({
        queryKey: ["events"],
        queryFn: (obj) => {
            return getEvents(obj.signal)
        },
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
    })

    function updateSearch(e: ChangeEvent<HTMLInputElement>) {
        if (e == undefined) return;
        e.preventDefault()
        setSearchTerm(e.target.value.trimStart());
    }
    return (
        <>
            <h1 className="mb-4">Upcoming Events</h1>
            <Form>
                <Form.Control tabIndex={1} aria-label="Search Events" type="text" placeholder="Search" onChange={updateSearch} value={searchTerm}></Form.Control>
            </Form>
            {eventsQuery.isLoading ? <LoadingIndicator /> : <EventList events={eventsQuery.data} searchTerm={searchTerm} />}
        </>
    );
}

export default EventOverview