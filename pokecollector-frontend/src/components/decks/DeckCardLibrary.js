import React, { useEffect, useState } from "react";


import OwnedCard from "./OwnedCard";

import "../../css/decks/deckcardlibrary.css";

const DeckCardLibrary = ({ addToDeck, ownedCards, toUpdate }) => {
    const [cards, setCards] = useState([]); //useState to hold array of card info

    useEffect(() => {
        console.log(ownedCards)
    }, [])


    return (
        <div className="DeckCardLibrary">
            {ownedCards.map(card => {
                return (<div key={card.ownedId} className="DeckCardLibrary-minicard" data={card.ownedId}>
                    <OwnedCard card={card} addToDeck={addToDeck} toUpdate={toUpdate} />
                </div>);
            })}
        </div>
    )
};

export default DeckCardLibrary;