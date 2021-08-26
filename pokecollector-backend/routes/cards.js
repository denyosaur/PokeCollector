"use strict";

/* Routes for Cards */

const express = require("express");

const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");

const Cards = require("../models/cards");
const UsersCards = require("../models/users_cards");

const { jsonValidate } = require("../helpers/jsonvalidator-helpers");
const cardNewSchema = require("../schemas/cardNew.json");

const router = new express.Router();

/*********NO RESTRICTION*********/

/* GET /cards/ => [{card},...] 
available {query: {
    name, 
    minPrice, 
    maxPrice, 
    rarity, 
    types, 
    setName
}}
*/
router.get("/", async function (req, res, next) {
    const query = req.query;
    //convert minPrice and maxPrice into strings
    if (query.minPrice !== undefined) query.minPrice = +query.minPrice;
    if (query.maxPrice !== undefined) query.maxPrice = +query.maxPrice;

    try {
        const cards = await Cards.findAll(query);

        return res.json({ cards });
    } catch (error) {
        return next(error);
    };
});

/* GET /cards/:cardId => {card}
route to get a specific card's information from db
*/
router.get("/:cardId", async function (req, res, next) {
    try {
        const { cardId } = req.params;

        const card = await Cards.getCardInfo(cardId);

        return res.json({ card });
    } catch (error) {
        return next(error);
    }
});


/*********LOGGED IN*********/

/* GET cards/:username =>  { cardIds }
Returns list of cards that user owns - Correct User or Admin Only
*/
router.get("/user/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const { username } = req.params;

        const cards = await UsersCards.getUsersCards(username);

        return res.json({ cards });
    } catch (error) {
        return next(error);
    };
});

/*********ADMIN ONLY*********/

/* POST /[handle]  =>  { deleted: handle }
create new card entry to cards table - ADMIN ONLY
{ id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, 
    setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices }
*/
router.post("/createCard", ensureAdmin, async function (req, res, next) {
    try {
        jsonValidate(req.body, cardNewSchema);

        const card = req.body;
        const newCards = await Cards._create(card);

        return res.json({ newCards });
    } catch (error) {
        return next(error);
    };
});

router.post("/pullCards/:setId", ensureAdmin, async function (req, res, next) {
    try {
        const { setId } = req.params;

        const newCards = await Cards.pullAndPushCards(setId);

        return res.json({ newCards });
    } catch (error) {
        return next(error);
    };
});

/* DELETE /[handle]  =>  { deleted: handle }
route to delete a card by id - only admins allowed
returns deleted card ID
*/
router.delete("/delete/:cardId", ensureAdmin, async function (req, res, next) {
    try {
        const { cardId } = req.params;

        const card = await Cards.getCardInfo(cardId);
        const deletedCard = await card.delete(card);

        return res.json({ deletedCard });
    } catch (error) {
        return next(error);
    };
});

module.exports = router;