import { useState, ChangeEvent, Suspense } from "react"
import { Form } from "react-bootstrap";
import EventList from "../features/Events/components/EventList";
import { useDebounce } from "../hooks/useDebounce";

function EventOverview() {
    const [searchTerm, setSearchTerm] = useState("");

    const debouncedSearchTerm = useDebounce<string>(searchTerm, "")
    function updateSearch(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        if (e == undefined) return;
        setSearchTerm(e.target.value.trimStart());
    }

    return (
        <>
            <h1 className="mb-4">Upcoming Events</h1>
            <Form onSubmit={(e) => { e.preventDefault() }}>
                <Form.Control tabIndex={1} aria-label="Search Events" type="text" placeholder="Search" onChange={updateSearch} value={searchTerm}></Form.Control>
            </Form>
            <Suspense>
                <EventList searchTerm={debouncedSearchTerm} />
            </Suspense>
        </>
    );
}

export default EventOverview