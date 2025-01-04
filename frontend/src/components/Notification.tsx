import { Toast, ToastContainer } from "react-bootstrap"
import { type Notification } from "../lib/types"
import { useEffect, useState } from "react"

const darkBackground = ["success", "danger", "dark", "primary", "secondary"]
function timeSince(date: Date) {
    var seconds = Math.floor((Date.now() - date.valueOf()) / 1000)
    if (seconds < 10) {
        return "now"
    }
    if (seconds < 60) {
        return Math.floor(seconds / 10) * 10 + " seconds ago";
    }
    if (seconds < 120) {
        return "1 minute ago";
    }
    if (seconds < 600) {
        return Math.floor(seconds / 60) + " minutes ago";
    }
    if (seconds < 3600) {
        return Math.floor(seconds / 600) * 10 + "minutes ago";
    }
    return "more than an hour ago"
}
function Notification({ notification, action }: { notification: Notification, action: CallableFunction }) {
    const [timeStamp, setTimeStamp] = useState(timeSince(notification.created));
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeStamp(timeSince(notification.created));
        }, 10000);
        return () => clearInterval(interval);
    }, [notification])
    return (
        <Toast onClose={(e) => { action(e, notification); }} bg={notification.type}>
            <Toast.Header>
                <strong className="me-auto">{notification.title}</strong>
                <small className="text-muted">{timeStamp}</small>
            </Toast.Header>
            <Toast.Body className={(darkBackground.includes(notification.type)) ? "text-white" : "text-dark"}>
                {notification.text}
            </Toast.Body>
        </Toast >
    )
}

function Notifications({ notifications, action }: { notifications: Notification[], action: CallableFunction }) {
    return (
        <ToastContainer className="p-3 position-fixed" position="bottom-end">
            {notifications.map((elem) => {
                return <Notification notification={elem} action={action} key={elem.id} />
            })
            }
        </ToastContainer>
    )
}

export default Notifications