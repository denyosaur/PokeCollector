import React, { useState, useEffect } from "react";

import MiniCard from "../Cards/MiniCard";

import CardsApi from "../../api/cards-api";

import "../../css/homepage/homepagecardcarousel.css";

const HomepageCardCarousel = () => {
    const getStoreCards = CardsApi.getCards;
    const [cards, setCards] = useState([]);
    const [cardId, setCardId] = useState(false);

    const moreInfo = (evt) => {
        const id = evt.target.getAttribute("data");
        setCardId(id);
    }

    useEffect(() => {
        async function getCarouselCards() {
            const searchRes = await getStoreCards({ rarity: 'Rare Holo' }, false, false);
            console.log(searchRes)
            setCards(searchRes.cards)
        }
        getCarouselCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="HomepageCardCarousel">
        <div className="HomepageCardCarousel-cards">
            {cards.map(card => {
                return (
                    <div key={card.id} className="HomepageCardCarousel-card">
                        <MiniCard card={card} moreInfo={moreInfo} fromShopPage={true} />
                    </div>)
            })}
        </div>
    </div>
};

export default HomepageCardCarousel;