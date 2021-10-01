import React, { useEffect, useState } from "react";

import DecksApi from "../../api/deck-api";

import DeckCardLibrary from "./DeckCardLibrary";
import EditDeckColumn from "./EditDeckColumn";

import "../../css/decks/editdeck.css";

const EditDeck = ({ deckId, setEditDeck }) => {
    const [token, setToken] = useState(""); //useState for token - used a lot in this page
    const [username, setUsername] = useState(""); //useState for username - used a lot in this page
    const [deckCards, setDeckCards] = useState([]);//set state for cards in deck
    const [deckName, setDeckName] = useState("");//set state for name of deck, used to updated deck name
    const [toUpdate, setToUpdate] = useState(new Set());//set state for holding card ownedIds for updating DB when saving

    //function to add card to toUpdate state and to deckCards states. To be used in <OwnedCard />.
    const addToDeck = (ownedId, card) => {
        const inDeckAlready = toUpdate.has(ownedId); //check if toUpdate contains the ownedId
        if (!inDeckAlready) {
            setToUpdate(previous => new Set(previous.add(ownedId))); //update toUpdate state by adding ownedId to new Set
            setDeckCards([...deckCards, card]); //update deckCards state to contain the card info for column populating
        };
    };

    //function to remove card from toUpdate state and from deckCards states. To be used in <ColumnCard />.
    const removeFromDeck = (ownedId, toRemove) => {
        const inDeck = toUpdate.has(ownedId); //check if toUpdate contains the ownedId

        if (inDeck) {
            const updateArr = [...toUpdate].filter(id => id !== ownedId); //create new array filtering out owned ID
            setToUpdate(new Set(updateArr)); //update toUpdate state by removing ownedId and create new Set

            const updateCol = [...deckCards].filter(card => card !== toRemove); //create new array filtering out card info
            setDeckCards(updateCol); //update deckCards state to remove the card info from the column
        };
    };

    //function to save deck to DB. To be used in <ColumnCard />.
    const saveDeck = async () => {
        const updatedDeck = { updatedDeck: [...toUpdate] } //array of ownedIds
        const updatedName = { newName: deckName };
        if (deckId !== "newDeck") {

            await DecksApi.updateCardsInDeck(username, token, deckId, updatedDeck); //update cards in DB
            await DecksApi.updateDeckName(username, token, deckId, updatedName); //update name of deck
        } else {
            await DecksApi.createDeck(username, token, updatedName); //create a new deck
            if (updatedDeck.updatedDeck.length > 0) {
                await DecksApi.updateCardsInDeck(username, token, deckId, updatedDeck); //update cards in DB
            }
        }

        setEditDeck(false);
    };

    //function to save deck to DB. To be used in <ColumnCard />.
    const cancelEdit = async () => {
        setEditDeck(false);
    };

    //when a deck is selected, deckId state is updated, which runs this useEffect
    useEffect(() => {
        let lsUsername = localStorage.getItem("username") || false;
        let lsToken = localStorage.getItem("token") || false;

        setUsername(lsUsername);
        setToken(lsToken);

        async function getDeckInfo() {
            const deckRes = await DecksApi.getDeckInfo(lsUsername, lsToken, deckId); //get cards in deck from DB

            //forEach card in deck, update the toUpdate state with ownedId
            deckRes.cards.forEach(card => {
                setToUpdate(previous => new Set(previous.add(card.ownedId)))
            })

            setDeckCards(deckRes.cards); //set state for cards in deck
            setDeckName(deckRes.deck.deckName); //set state for name of deck, used to updated deck name
        };

        getDeckInfo();
    }, [deckId]);

    return (
        <div className="EditDeck" >
            <div className="EditDeck-MyCards">
                <DeckCardLibrary addToDeck={addToDeck} deckCards={deckCards} token={token} username={username} />
            </div>
            <div className="EditDeck-deck">
                <EditDeckColumn deckName={deckName} setDeckName={setDeckName} deckCards={deckCards} removeFromDeck={removeFromDeck} saveDeck={saveDeck} cancelEdit={cancelEdit} />
            </div>
        </div>
    )
};

export default EditDeck;