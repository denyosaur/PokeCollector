import React from "react";

import "../../css/decks/deckbox.css";

const DeckBox = ({ deck, editDeckHandler }) => {
    const { deckId, deckName, deckImage } = deck;

    return (
        <div className="DeckBox" data={deckId} onClick={() => editDeckHandler(deckId)}>
            <div className="DeckBox-image">
                {(deckId === "newDeck")
                    ? <img src={deckImage} alt={`${deckName} card`} data={deckId} className="DeckBox-newbackgroundimage" />
                    : <img src={deckImage} alt={`${deckName} card`} data={deckId} className="DeckBox-backgroundimage" />}
            </div>
            <div className="DeckBox-name">
                <div>{deckName}</div>
            </div>
        </div>
    )
};

export default DeckBox;