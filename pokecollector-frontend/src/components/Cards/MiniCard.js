import React from "react";

import "../../css/store/storecard.css"

const MiniCard = ({ card }) => {
    const {
        id,
        name,
        setName,
        setLogo,
        images,
        prices,
        rarity } = card;

    return (
        <div className="MiniCard" data={id} >
            <div className="MiniCard-container">
                <div className="MiniCard-image">
                    <img src={images} alt={`${name} card`} />
                </div>
                <div className="MiniCard-info" >
                    <div className="MiniCard-info-col">
                        <div className="MiniCard-info-price">
                            <span className="MiniCard-info-price">${prices}</span>
                        </div>
                        <div className="MiniCard-info-header">
                            <span>{name}</span>
                        </div>
                        <div className="MiniCard-info-setname">
                            <span>{setName}</span>
                        </div>

                        <div className="MiniCard-info-rarity">
                            <span>{rarity}</span>
                        </div>
                    </div>
                    <div className="MiniCard-info-col">
                        <div className="MiniCard-addtocart">
                            <i className="bi bi-cart-plus"></i>
                        </div>
                        <div className="MiniCard-info-setlogo">
                            <img src={setLogo} alt={`${setName} logo`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>)
};

export default MiniCard;