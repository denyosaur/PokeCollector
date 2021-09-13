import React, { useEffect, useState } from "react";

import CardsApi from "../../api/cards-api";
import MiniCard from "../Cards/MiniCard";

import "../../css/mycards.css"


const MyCards = () => {

    const [cards, setCards] = useState([]);

    const handleClick = (evt) => {
        console.log("clicked")
    }

    useEffect(() => {
        async function getOwnersCards() {
            let token = localStorage.getItem("token") || false;
            let username = localStorage.getItem("username") || false;
            const cardsRes = await CardsApi.getOwnedCards(username, token);
            setCards(cardsRes.cards);
        }
        getOwnersCards();
    }, [])

    return (
        <div className="MyCards" >
            <div className="MyCards-cards">
                {cards.map(card => {
                    return (
                        <div key={card.cardInfo.id} className="MyCards-minicard" onClick={handleClick}>
                            <MiniCard card={card.cardInfo} />
                        </div>)
                })}
            </div>
        </div>)
};

export default MyCards;