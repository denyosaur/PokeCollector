import React, { useEffect, useState } from "react";

import DecksApi from "../../api/deck-api";

import DeckBox from "./DeckBox";
import NewDeckBox from "./NewDeckBox";

import "../../css/decks/mydecks.css";

const MyDecks = () => {
    const [decks, setDecks] = useState([])

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
            <div className="MyDecks-decklist">
                <div className="MyDecks-newdeck">
                    <NewDeckBox />
                </div>
                {decks.map(deck => {
                    return (
                        <div className="MyDecks-deck" key={deck.deckId}>
                            <DeckBox deck={deck} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default MyDecks;