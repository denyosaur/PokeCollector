import React, { useEffect, useState } from "react";

import DecksApi from "../../api/deck-api";

import DeckBox from "./DeckBox";
import EditDeck from "./EditDeck";
import NotificationCard from "../navigation/NotificationCard";

import "../../css/decks/mydecks.css";

const MyDecks = () => {
    const [notification, setNotification] = useState(false);
    const [decks, setDecks] = useState([]);
    const [deckStatus, setDeckStatus] = useState(false);
    const [editDeck, setEditDeck] = useState(false);
    const [token, setToken] = useState(""); //useState for token - used a lot in this page
    const [username, setUsername] = useState(""); //useState for username - used a lot in this page
    const newDeck = {
        deckId: "newDeck",
        deckName: "Create New Deck",
        deckImage: [" ", "https://i.imgur.com/zyEsx2t.png"]
    }

    const editDeckHandler = (deckId) => {
        setEditDeck(deckId);
    };


    useEffect(() => {
        let lsUsername = localStorage.getItem("username") || false;
        let lsToken = localStorage.getItem("token") || false;

        setToken(lsToken);
        setUsername(lsUsername);

        async function getDecks() {
            const deckRes = await DecksApi.getDecks(lsUsername, lsToken);

            setDecks(deckRes.decks);
        }

        getDecks();
    }, [editDeck]);

    return (
        <div className="MyDecks">
            <div className="MyDecks-notification">
                {notification && <NotificationCard notification={notification} setNotification={setNotification} />}
            </div>
            {!editDeck ? (<div className="MyDecks-decklist">
                <div className="MyDecks-newdeck">
                    <DeckBox deck={newDeck} editDeckHandler={editDeckHandler} token={token} username={username} setNotification={setNotification} setEditDeck={setEditDeck} setDeckStatus={setDeckStatus} />
                </div>
                {decks.map(deck => {
                    return (
                        <div className="MyDecks-deck" key={deck.deckId}>
                            <DeckBox deck={deck} editDeckHandler={editDeckHandler} token={token} username={username} setNotification={setNotification} setEditDeck={setEditDeck} setDeckStatus={setDeckStatus} />
                        </div>
                    )
                })}
            </div>)
                : (<div className="MyDecks-editdeck">
                    <EditDeck deckId={editDeck} setEditDeck={setEditDeck} setNotification={setNotification} token={token} username={username} />
                </div>)}
        </div>
    )
};

export default MyDecks;