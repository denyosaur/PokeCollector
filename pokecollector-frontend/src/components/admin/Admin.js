import React, { useState, useEffect } from "react";

import AdminBar from "./AdminBar";
import AdminHome from "./AdminHome";
import AdminUsers from "./users/AdminUsers";
import AdminDatabaseCards from "./cards/AdminDatabaseCards";
import AdminApiCards from "./externalcards/AdminApiCards";

import "../../css/admin/admin.css";

const Admin = () => {
    const [token, setToken] = useState("");
    const [adminPage, setAdminPage] = useState("AdminHome");
    const adminPages = {
        "AdminHome": (<div className="Admin-home">
            <AdminHome />
        </div>),
        "Users": (<div className="Admin-Users">
            <AdminUsers token={token} />
        </div>),
        "Database Cards": <div className="Admin-cards">
            <AdminDatabaseCards token={token} setAdminPage={setAdminPage} />
        </div>,
        "External API Cards": (<div className="Admin-externalcards">
            <AdminApiCards token={token} setAdminPage={setAdminPage} />
        </div>)
    };

    useEffect(() => {
        setToken(localStorage.getItem("token") || false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="Admin">
        <div className="Admin-container">
            <div className="Admin-AdminBar">
                <AdminBar adminPage={adminPage} setAdminPage={setAdminPage} />
            </div>
            <div className="Admin-main">
                {adminPages[adminPage]}
            </div>
        </div>
    </div>
};

export default Admin;