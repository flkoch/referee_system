import { ContextType, useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { type Notification } from "../lib/types";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Notifications from "../components/Notification";

function MainLayout() {
    const [theme, setTheme] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>(JSON.parse(localStorage.getItem("Notifications") || "[]"));
    function toggleTheme(_event: MouseEvent): void {
        document.documentElement.setAttribute("data-bs-theme", theme ? "dark" : "light");
        setTheme(!theme);
    }
    function notify(notification: Notification) {
        setNotifications((currentNotifications) => {
            notification.id = currentNotifications.length
            return [notification, ...currentNotifications]
        });

    }
    function dismissNotification(_event: MouseEvent, notification: Notification) {
        setNotifications(notifications.filter((item: Notification) => item != notification));
        if (notification.id !== notifications.length - 1) {
            var n = notifications.find((elem) => elem.id === notifications.length - 1)
            if (n !== undefined) {
                n.id = notification.id
            }
        }
    }
    useEffect(() => {
        localStorage.setItem("Notifications", JSON.stringify(notifications))
        console.log(notifications)
    }, [notifications])
    return (
        <>
            <header>
                <Header toggleFunction={toggleTheme} />
            </header>
            <main className="container">
                <Outlet context={{ notify }} />
            </main>
            <Notifications notifications={notifications} action={dismissNotification}></Notifications>
            <Footer />
        </>
    )
}

export function useNotify() {
    // @ts-ignore: ToDo: Context type must be defined more closely
    return useOutletContext<ContextType>();
}

export default MainLayout