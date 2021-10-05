import React, { useEffect, useState } from "react";

import "../../css/decks/editdeckinfo.css";

const EditDeckInfo = ({ deckInfo, setUpdatedDeckInfo }) => {
    const { deck, cards } = deckInfo;
    const [form, setForm] = useState({ deckName: "", deckImage: "https://i.imgur.com/QykX2aC.jpg" }); //useState for updating deck name
    const [deckImageOptions, setDeckImageOptions] = useState([]); //useState for deck cover image

    //when either deckName or deckCards are updated, reload 
    useEffect(() => {
        const defaultImage = { cardName: "Default Image", cardImage: "https://i.imgur.com/QykX2aC.jpg" }
        if (cards.length > 0) {
            let cardImages = new Set();
            let imageDuplicate = new Set();
            cards.forEach(card => {
                const { name, images } = card;
                if (!imageDuplicate.has(name)) {
                    cardImages.add({ cardName: name, cardImage: images });
                    imageDuplicate.add(name);
                }
            });
            const cardImagesArr = Array.from(cardImages);
            setDeckImageOptions([defaultImage, ...cardImagesArr]);
            setForm({ deckName: deck.deckName, deckImage: deck.deckImage });
        } else {
            setDeckImageOptions([defaultImage]);
            setForm({ deckName: deck.deckName, deckImage: defaultImage.cardImage });
        }

    }, [deckInfo]);

    //handleChange for deck name handling
    const handleChange = (evt) => {
        const { name, value } = evt.target;
        const toChange = { ...form, [name]: value };
        setForm(toChange);
        setUpdatedDeckInfo(toChange);
    };

    return (
        <div className="EditDeckInfo" >
            <form className="EditDeckInfo-info">
                <div className="EditDeckInfo-name">
                    <label htmlFor="deckName">Deck Name: </label>
                    <input type="text" placeholder="Enter Deck Name.." onChange={handleChange} name="deckName" id="deckName" value={form.deckName} />
                </div>
                <div className="EditDeckInfo-image">
                    <label htmlFor="deckImage">Deck Image: </label>
                    <select id="deckImage" name="deckImage" onChange={handleChange} value={form.deckImage}>
                        {deckImageOptions.map((card, idx) => {
                            return <option value={card.cardImage} key={`${card.cardName}_${idx}`}>{card.cardName}</option>
                        })}
                    </select>
                </div>
            </form>
        </div>
    )
};

export default EditDeckInfo;