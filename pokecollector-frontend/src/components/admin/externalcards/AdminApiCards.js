import React, { useEffect, useState } from "react";

import CardsApi from "../../../api/cards-api";

import AdminSetsColumn from "./AdminSetsColumn";
import AdminCardResults from "./AdminCardResults";

import "../../../css/admin/adminapicards.css";

const AdminApiCards = ({ token }) => {
    const [cardSets, setCardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(false);

    useEffect(() => {
        async function getCards() {
            const res = await CardsApi.getSets(token);
            setCardSets(res.sets);
        };
        getCards();
    }, [token]);

    return <div className="AdminApiCards">
        <AdminSetsColumn cardSets={cardSets} setSelectedSet={setSelectedSet} />
        {selectedSet && <AdminCardResults selectedSet={selectedSet} token={token} />}
    </div>
};

export default AdminApiCards;