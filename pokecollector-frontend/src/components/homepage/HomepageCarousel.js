import React, { useState } from "react";

import Carousel from 'react-bootstrap/Carousel';

import "../../css/homepage/homepagecarousel.css";

const HomepageCarousel = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <Carousel className="HomepageCarousel" activeIndex={index} onSelect={handleSelect} interval={7000} pause={'hover'} wrap={false}>
            <Carousel.Item>
                <div className="HomepageCarousel-item">
                    <img src="https://i.imgur.com/IC5BXSv.jpg" alt="PurplePokemonCard" />
                </div>
                <Carousel.Caption>
                    <div className="HomepageCarousel-caption HomepageCarousel-caption1">
                        <p><span className="HomepageCarousel-header">PokeCollector</span></p> <p>Welcome to PokeCollector!</p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className="HomepageCarousel-item">
                    <img src="https://i.imgur.com/QBVSTg0.jpg" alt="YellowPikachuCards" />
                </div>
                <Carousel.Caption>
                    <div className="HomepageCarousel-caption HomepageCarousel-caption2">
                        <p>Purchase select Pokemon cards at the PokeShop.</p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className="HomepageCarousel-item">
                    <img src="https://i.imgur.com/hRKp0RB.jpg" alt="PokeballCards" />
                </div>
                <Carousel.Caption>
                    <div className="HomepageCarousel-caption HomepageCarousel-caption3">
                        <p>Build your own Pokemon Deck from scratch!</p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className="HomepageCarousel-item-big">
                    <img src="https://i.imgur.com/DNWE7Zf.jpg" alt="PokeballCards" />
                </div>
                <Carousel.Caption>
                    <div className="HomepageCarousel-caption HomepageCarousel-caption4">
                        <p>Sign up to start collecting!</p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div className="HomepageCarousel-item">
                    <iframe src="https://www.youtube.com/embed/FDqDvvJyY2w?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </Carousel.Item>
        </Carousel>
    );
};

export default HomepageCarousel;