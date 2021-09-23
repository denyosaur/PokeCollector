import React, { useEffect, useState } from "react";

import CardsApi from "../../api/cards-api";

import CardSearch from "../Cards/CardSearch";
import MiniCard from "../Cards/MiniCard";
import CardDetails from "../Cards/CardDetails";

import "../../css/mycards.css";


const MyCards = () => {
    const searchOwnedCards = CardsApi.searchOwnedCards;
    const [cards, setCards] = useState([]);
    const [cardId, setCardId] = useState(false);

    const moreInfo = (evt) => {
        const id = evt.target.getAttribute("data");
        setCardId(id);
    }

    useEffect(() => {
        let token = localStorage.getItem("token") || false;
        let username = localStorage.getItem("username") || false;

        async function getOwnersCards() {
            let cardDuplicates = new Set();
            let ownedCards = []
            const cardsRes = await CardsApi.getOwnedCards(username, token);

            cardsRes.cards.forEach(card => {
                if (!cardDuplicates.has(card.cardInfo.id)) {
                    cardDuplicates.add(card.cardInfo.id)
                    ownedCards.push(
                        <div key={card.cardInfo.id} className="MyCards-minicard" data={card.cardInfo.id}>
                            <MiniCard card={card.cardInfo} moreInfo={moreInfo} />
                        </div>)
                }
            })

            setCards(ownedCards);
        }
        getOwnersCards();
    }, [])

    return (
        <div className="MyCards" >
            <div className="MyCards-search">
                <CardSearch setCards={setCards} getCards={searchOwnedCards} />
            </div>
            <div className="MyCards-cards">
                {cards}
            </div>
            {cardId && <div className="MyCards-details">
                <CardDetails cardId={cardId} setCardId={setCardId} />
            </div>}
        </div>)
};

export default MyCards;