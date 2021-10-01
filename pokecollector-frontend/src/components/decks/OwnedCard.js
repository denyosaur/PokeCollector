import React from "react";

import "../../css/decks/deckcard.css";

const OwnedCard = ({ card, addToDeck }) => {
    const columnCardInfo = {
        id: card.cardInfo.id,
        images: card.cardInfo.images,
        name: card.cardInfo.name,
        setLogo: card.cardInfo.setLogo,
        setName: card.cardInfo.setName,
        ownedId: card.ownedId
    };

    return (
        <div className="DeckCard" onClick={() => addToDeck(card.ownedId, columnCardInfo)}>
            <div className="DeckCard-image">
                <img src={card.cardInfo.images} alt={`${card.cardInfo.name} card`} />
            </div>
        </div>
    )
};

export default OwnedCard;