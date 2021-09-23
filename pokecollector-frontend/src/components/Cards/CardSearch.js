import React from "react";

import useFields from "../../hooks/useFields";

import "../../css/store/cardsearch.css"

const CardSearch = ({ setCards, getCards }) => {
    const token = localStorage.getItem("token") || false;
    const username = localStorage.getItem("username") || false;

    const INITIAL_STATE = {
        name: "",
        minPrice: "",
        maxPrice: "",
        rarity: "",
        types: "",
        setName: ""
    };

    const [formData, handleChange, setFormData] = useFields(INITIAL_STATE); //hook for field changes

    const clearForm = (evt) => {
        evt.preventDefault();
        setFormData(INITIAL_STATE);
        async function getUnfilteredCards() {
            const searchRes = await getCards({}, token, username);

            setCards(searchRes.cards);
        }
        getUnfilteredCards();
    }

    const handleSearch = (evt) => {
        evt.preventDefault();
        async function searchCardFiltered() {
            let data = {};

            for (let key in formData) {
                if (formData[key] !== "") {
                    data[key] = formData[key]
                }
            }

            const searchRes = await getCards(data, token, username);

            setCards(searchRes.cards);

        }
        searchCardFiltered();
    }

    return (
        <div className="CardSearch">
            <div className="CardSearch-container">
                <div className="CardSearch-header">
                    <span>Filters</span>
                </div>
                <form className="CardSearch-form" >
                    <div className="CardSearch-input">
                        <label htmlFor="name">Card Name</label>
                        <input type="text" placeholder="Search a for a card.." name="name" id="name" onChange={handleChange} value={formData.name}></input>
                    </div>

                    <div className="CardSearch-input">
                        <label htmlFor="minPrice">Min. Price</label>
                        <input type="number" placeholder="Minimun Price" name="minPrice" id="minPrice" step="0.01" min="0" onChange={handleChange} value={formData.minPrice}></input>
                    </div>

                    <div className="CardSearch-input">
                        <label htmlFor="maxPrice">Max Price</label>
                        <input type="number" placeholder="Maximum Price" name="maxPrice" id="maxPrice" step="0.01" min="0" onChange={handleChange} value={formData.maxPrice}></input>
                    </div>

                    <div className="CardSearch-input">
                        <label htmlFor="rarity">Rarity</label>
                        <select name="rarity" id="rarity" onChange={handleChange} value={formData.rarity}>
                            <option value=""></option>
                            <option value="Common">Common</option>
                            <option value="Uncommon">Uncommon</option>
                            <option value="Rare">Rare</option>
                            <option value="Rare Holo">Rare Holo</option>
                        </select>
                    </div>

                    <div className="CardSearch-input">
                        <label htmlFor="types">Types</label>
                        <select name="types" id="types" onChange={handleChange} value={formData.types}>
                            <option value=""></option>
                            <option value="Water">Water</option>
                            <option value="Fire">Fire</option>
                            <option value="Colorless">Colorless</option>
                            <option value="Psychic">Psychic</option>
                            <option value="Grass">Grass</option>
                            <option value="Lightning">Lightning</option>
                            <option value="Fighting">Fighting</option>
                        </select>
                    </div>

                    <div className="CardSearch-input">
                        <label htmlFor="setName">Set Name</label>
                        <select name="setName" id="setName" onChange={handleChange} value={formData.setNames}>
                            <option value=""></option>
                            <option value="Base">Base</option>
                            <option value="Jungle">Jungle</option>
                            <option value="Fossil">Fossil</option>
                            <option value="Base Set 2">Base Set 2</option>
                            <option value="Team Rocket">Team Rocket</option>
                        </select>
                    </div>
                    <div className="CardSearch-buttons">
                        <button className="CardSearch-apply" onClick={handleSearch}>Apply Filters</button>
                        <button className="CardSearch-reset" onClick={clearForm}>Clear Form</button>
                    </div>

                </form>
            </div>
        </div>)
};

export default CardSearch;