import { useEffect, useState, ChangeEvent, MouseEvent } from "react"
import { Form } from "react-bootstrap";
import api from "../api";
import EventList from "../components/Events";
import { type EventType, type Notification } from "../lib/types";
import { formattedDate } from "../lib/functions";
import LoadingIndicator from "../components/LoadinIndicator";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

function Home() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setIsLoading(true);
        getEvents();
        setIsLoading(false);
    }, [])

    const getEvents = () => {
        api
            .get("/api/events/future/")
            .then((res) => res.data)
            .then((data) => setEvents(data))
            .catch((error) => alert(error));
    };
    function toggleTheme(_event: MouseEvent): void {
        document.documentElement.setAttribute("data-bs-theme", theme ? "dark" : "light");
        setTheme(!theme);
    }
    function notify(notification: Notification) {
        setNotifications([notification, ...notifications]);
    }
    function dismissNotification(_event: MouseEvent, notification: Notification) {
        setNotifications(notifications.filter((item) => item != notification));
    }
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
    const filteredEvents = events.filter(filterWrapperText(searchTerm))
    return (
        <>
            <header>
                <Header toggleFunction={toggleTheme} />
            </header>
            <main className="container">
                <h1 className="mb-4">Upcoming Events</h1>
                <Form>
                    <Form.Control tabIndex={1} aria-label="Search Events" type="text" placeholder="Search" onChange={updateSearch} value={searchTerm}></Form.Control>
                </Form>
                {isLoading ? <LoadingIndicator /> : <EventList events={filteredEvents} />}
            </main>
            <Notifications notifications={notifications} action={dismissNotification} />
            <Footer />
        </>
    );
}

export default Home