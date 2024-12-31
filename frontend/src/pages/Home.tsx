import { useEffect, useState, MouseEvent } from "react"
import api from "../api";
import EventCard from "../components/EventCard";
import { type EventType, type Notification } from "../lib/types";
import LoadingIndicator from "../components/LoadinIndicator";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

function Home() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    const [theme, setTheme] = useState(true)
    const today = new Date
    const [notifications, setNotifications] = useState<Notification[]>([])

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
        document.documentElement.setAttribute("data-bs-theme", theme ? "dark" : "light")
        setTheme(!theme)
    }
    function notify(notification: Notification) {
        setNotifications([notification, ...notifications])
    }
    function dismissNotification(_event: MouseEvent, notification: Notification) {
        setNotifications(notifications.filter((item) => item != notification))
    }
    return (
        <>
            <header>
                <Header toggleFunction={toggleTheme} />
            </header>
            <main className="container">
                <h1 className="mb-4">Upcoming Events</h1>
                {isLoading ? <LoadingIndicator /> : events.map((elem) => <EventCard event={elem} key={elem.id} />)}
            </main>
            <Notifications notifications={notifications} action={dismissNotification} />
            <Footer />
        </>
    );
}

export default Home