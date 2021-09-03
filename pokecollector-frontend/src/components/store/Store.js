import React, { useEffect } from "react";

const Store = () => {
    let username = localStorage.getItem("username") || false
    useEffect(() => {
        username = localStorage.getItem("username")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="Store">
        <div className="Store-page">
            <h1>Stores Page</h1>
            <div>
                <p>Hello {username}</p>
            </div>
        </div>
    </div>
};

export default Store;