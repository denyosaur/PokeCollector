import React, { useEffect, useState } from "react";

import CardsApi from "../../api/cards-api";

import OwnedCard from "./OwnedCard";

import "../../css/decks/deckcardlibrary.css";

const DeckCardLibrary = ({ addToDeck, token, username, toUpdate }) => {
    const [cards, setCards] = useState([]); //useState to hold array of card info

    useEffect(() => {
        async function getDeckInfo() {
            if (token) {
                const res = await CardsApi.getOwnedCards(username, token); //get all owner's cards

                setCards(res.cards); //set state for owner's cards
            }
        };

        getDeckInfo();
    }, [token, username])


    return (
        <div className="DeckCardLibrary">
            {cards.map(card => {
                return (<div key={card.ownedId} className="DeckCardLibrary-minicard" data={card.ownedId}>
                    <OwnedCard card={card} addToDeck={addToDeck} toUpdate={toUpdate} />
                </div>);
            })}
        </div>
    )
};

export default DeckCardLibrary;