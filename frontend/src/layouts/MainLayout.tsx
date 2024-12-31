import { useState } from "react";
import { Outlet } from "react-router-dom";
import { type Notification } from "../lib/types";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

function MainLayout() {
    const [theme, setTheme] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    function toggleTheme(_event: MouseEvent): void {
        document.documentElement.setAttribute("data-bs-theme", theme ? "dark" : "light");
        setTheme(!theme);
    }
    function notify(notification: Notification) {
        setNotifications([notification, ...notifications]);
    }
    function dismissNotification(_event: MouseEvent, notification: Notification) {
        setNotifications(notifications.filter((item: Notification) => item != notification));
    }
    return (
        <>
            <header>
                <Header toggleFunction={toggleTheme} />
            </header>
            <main className="container">
                <Outlet />
            </main>
            <Notifications notifications={notifications} action={dismissNotification}></Notifications>
            <Footer />
        </>
    )
}

export default MainLayout