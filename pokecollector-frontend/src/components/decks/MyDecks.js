import React, { useEffect, useState } from "react";

import DecksApi from "../../api/deck-api";

import DeckBox from "./DeckBox";
import EditDeck from "./EditDeck";

import "../../css/decks/mydecks.css";

const MyDecks = () => {
    const [decks, setDecks] = useState([]);
    const [editDeck, setEditDeck] = useState(false);
    const newDeck = {
        deckId: "newDeck",
        deckName: "Create New Deck",
        deckImage: "https://i.imgur.com/zyEsx2t.png"
    }

    const editDeckHandler = (deckId) => {
        setEditDeck(deckId);
    };

    useEffect(() => {
        let username = localStorage.getItem("username") || false;
        let token = localStorage.getItem("token") || false;

        async function getDecks() {
            const deckRes = await DecksApi.getDecks(username, token);

            setDecks(deckRes.decks);
        }

        getDecks();
    }, []);

    return (
        <div className="MyDecks">
            {!editDeck ? (<div className="MyDecks-decklist">
                <div className="MyDecks-newdeck">
                    <DeckBox deck={newDeck} editDeckHandler={editDeckHandler} />
                </div>
                {decks.map(deck => {
                    return (
                        <div className="MyDecks-deck" key={deck.deckId}>
                            <DeckBox deck={deck} editDeckHandler={editDeckHandler} />
                        </div>
                    )
                })}
            </div>)
                : (<div className="MyDecks-editdeck">
                    <EditDeck deckId={editDeck} setEditDeck={setEditDeck} />
                </div>)}
        </div>
    )
};

export default MyDecks;