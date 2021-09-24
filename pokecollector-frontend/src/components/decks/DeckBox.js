import React, { useEffect } from "react";

import "../../css/decks/deckbox.css";

const DeckBox = ({ deck }) => {
    const { deckId, deckName, deckImage } = deck;

    const openDeck = (evt) => {
        console.log("open deck")
    };

    return (
        <div className="DeckBox" data={deckId} onClick={openDeck}>
            <div className="DeckBox-image">
                <img src={deckImage} alt={`${deckName} card`} data={deckId} />
            </div>
            <div className="DeckBox-name">
                <div>{deckName}</div>
            </div>
        </div>
    )
};

export default DeckBox;