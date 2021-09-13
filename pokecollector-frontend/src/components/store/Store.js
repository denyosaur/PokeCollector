import React, { useEffect, useState } from "react";

import CardsApi from "../../api/cards-api";

import MiniCard from "../Cards/MiniCard";
import StoreSearch from "./StoreSearch";

import "../../css/store/store.css";

const Store = () => {
    const getStoreCards = CardsApi.getCards;

    const [cards, setCards] = useState([]);

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
                <StoreSearch setCards={setCards} getStoreCards={getStoreCards} />
            </div>
            <div className="Store-cards">
                {cards.map(card => {
                    return (<MiniCard card={card} key={card.id} />)
                })}
            </div>
        </div>
    </div>
};

export default Store;