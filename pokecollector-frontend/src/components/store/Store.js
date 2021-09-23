import React, { useEffect, useState } from "react";

import CardsApi from "../../api/cards-api";

import MiniCard from "../Cards/MiniCard";
import CardSearch from "../Cards/CardSearch";
import CardDetails from "../Cards/CardDetails";

import "../../css/store/store.css";

const Store = () => {
    const getStoreCards = CardsApi.getCards;
    const [cardId, setCardId] = useState(false);
    const [cards, setCards] = useState([]);

    const moreInfo = (evt) => {
        const id = evt.target.getAttribute("data");
        setCardId(id);
    }

    useEffect(() => {
        async function getAllCards() {
            const cardsRes = await getStoreCards();
            setCards(cardsRes.cards);
        }
        getAllCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <div className="Store">
        <div className="Store-page">
            <div className="Store-page-search">
                <CardSearch setCards={setCards} getCards={getStoreCards} />
            </div>
            <div className="Store-cards">
                {cards.map(card => {
                    return (
                        <div key={card.id} className="Store-card">
                            <MiniCard card={card} moreInfo={moreInfo} />
                        </div>)
                })}
            </div>
            {cardId && <div className="MyCards-details">
                <CardDetails cardId={cardId} setCardId={setCardId} />
            </div>}
        </div>
    </div>
};

export default Store;