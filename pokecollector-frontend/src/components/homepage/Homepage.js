import React, { useEffect } from "react";

//import HomepageCardCarousel from "./HomepageCardCarousel";
import HomepageCarousel from "./HomepageCarousel";

import "../../css/homepage/homepage.css";

const Homepage = () => {
    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="Homepage">
        <div className="Homepage-container">
            <div className="Homepage-maincarousel">
                <HomepageCarousel />
            </div>

        </div>
    </div>
};

export default Homepage;