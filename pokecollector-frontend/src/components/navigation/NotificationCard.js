import React from "react";

import "../../css/notificationcard.css";

const NotificationCard = ({ notification, setNotification }) => {
    const { message, status } = notification;
    const color = {
        "error": "#d9534f",
        "success": "#5cb85c",
        "primary": "#0275d8"
    };

    const closeNotification = (evt) => {
        evt.preventDefault();
        setNotification({});
    }

    return <div className="Notification" style={{ backgroundColor: color[status] }}>
        <div className="Notification-closebutton">
            <i className="bi bi-x-lg Error-formClose" onClick={closeNotification}></i>
        </div>
        <div className="Notification-message">
            <p>{message[0]}</p>
        </div>
    </div>
};

export default NotificationCard;