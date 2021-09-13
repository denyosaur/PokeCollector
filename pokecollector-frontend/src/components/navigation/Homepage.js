import React, { useEffect } from "react";

const Homepage = () => {
    let username = localStorage.getItem("username") || false
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="Homepage">
        <div className="Homepage-story">
            <h1>Homepage</h1>
            <div>
                <p>Hello {username}</p>
            </div>
        </div>
    </div>
};

export default Homepage;