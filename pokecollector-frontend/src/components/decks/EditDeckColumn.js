import React, { useEffect, useState } from "react";

import ColumnCards from "./ColumnCards";

import "../../css/decks/editdeckcolumn.css";

const EditDeckColumn = ({ deckName, setDeckName, deckCards, removeFromDeck, saveDeck, cancelEdit }) => {
    const [form, setForm] = useState({ deckName: "" }); //useState for updating deck name

    //when either deckName or deckCards are updated, reload 
    useEffect(() => {
        setForm({ deckName: deckName });
    }, [deckName, deckCards]);

    //handleChange for deck name handling
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setForm({ [name]: value });
        setDeckName(value);
    };

    return (
        <div className="EditDeckColumn" >
            <div className="EditDeckColumn-deck">
                <div className="EditDeckColumn-deckName">
                    <form>
                        <label htmlFor="deckName">Deck Name:</label>
                        <input type="text" placeholder="Enter Deck Name.." onChange={handleChange} name="deckName" id="deckName" value={form.deckName} />
                    </form>
                </div>
                <div className="EditDeckColumn-cards">
                    {deckCards.map(card => {
                        return (<div className="" key={card.ownedId}>
                            <ColumnCards card={card} removeFromDeck={removeFromDeck} />
                        </div>)
                    })}
                </div>
            </div>
            <div className="EditDeckColumn-buttons">
                <button className="EditDeckColumn-save" onClick={saveDeck}>Save Deck</button>
                <button className="EditDeckColumn-cancel" onClick={cancelEdit}>Cancel</button>
            </div>
        </div>
    )
};

export default EditDeckColumn;