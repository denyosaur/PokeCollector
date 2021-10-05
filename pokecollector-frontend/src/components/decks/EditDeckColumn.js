import React from "react";

import ColumnCards from "./ColumnCards";

import "../../css/decks/editdeckcolumn.css";

const EditDeckColumn = ({ colCards, removeFromDeck }) => {

    return (
        <div className="EditDeckColumn" >
            <div className="EditDeckColumn-deck">
                <div className="EditDeckColumn-cards">
                    {colCards.map(card => {
                        return (<div className="" key={card.ownedId}>
                            <ColumnCards card={card} removeFromDeck={removeFromDeck} />
                        </div>)
                    })}
                </div>
            </div>
        </div>
    )
};

export default EditDeckColumn;