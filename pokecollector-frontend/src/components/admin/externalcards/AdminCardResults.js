import React, { useState, useEffect } from "react";

import CardsApi from "../../../api/cards-api";

import AdminCardRow from "./AdminCardRow";
import AdminApiCardColumn from "./AdminApiCardColumn";

import "../../../css/admin/admincardresults.css";

const AdminCardResults = ({ selectedSet, token }) => {
    const [cards, setCards] = useState(new Set());

    useEffect(() => {
        async function getSetCards() {
            const data = { "id": selectedSet }
            const res = await CardsApi.getCardsFromSet(data, token);
            setCards(new Set(res.cards));
        }

        getSetCards();
    }, [selectedSet, token]);

    async function addCard(cardToAdd) {
        await CardsApi.createCard(cardToAdd, token); //create card in DB

        const updatedArr = [...cards].filter(card => card !== cardToAdd); //create new Array with card removed
        setCards(updatedArr);//update cards useState with new array
    }

    return <div className="AdminCardResults">
        <AdminApiCardColumn />
        {Array.from(cards).map(card => {
            return <AdminCardRow card={card} addCard={addCard} key={card.id} />
        })}
    </div>
};

export default AdminCardResults;
