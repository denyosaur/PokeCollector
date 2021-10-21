import React from "react";

import MiniCard from "./MiniCard";

import "../../css/cards/cardslist.css";

const CardsList = ({ cards, moreInfo, fromShopPage }) => {

    return <div className="CardsList">
        {cards.map(card => {
            return (
                <div key={card.id} className="StoreCards-card">
                    <MiniCard card={card} moreInfo={moreInfo} fromShopPage={fromShopPage} />
                </div>)
        })}
    </div>
};

export default CardsList;