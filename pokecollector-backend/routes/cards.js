"use strict";

/* Routes for Authentication */

const jsonschema = require("jsonschema");
const express = require("express");
const router = new express.Router();

const { Cards } = require("../models/cards");
const { UsersCards } = require("../models/cards");

const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");



const { BadRequestError } = require("../expressError");

/*********NO RESTRICTION*********/

/* GET /cards/ => [{card},...] 
available query filters: {name, minPrice, maxPrice, rarity, types, setName}
*/
router.get("/", async function (req, res, next) {
    const query = req.query;
    //convert minPrice and maxPrice into strings
    if (query.minPrice !== undefined) query.minPrice = +query.minPrice;
    if (query.maxPrice !== undefined) query.maxPrice = +query.maxPrice;

    try {
        //validate the username and password object schema
        const validate = jsonschema.validate(req.body, cardSearchSchema);
        if (!validate.valid) {
            const errors = validate.errors.map(err => err.stack);
            throw new BadRequestError(errors);
        };

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
        const id = req.params.cardId;
        const card = await Cards.getCardInfo(id);
        return res.json({ card });
    } catch (error) {
        return next(error);
    }
});


/*********LOGGED IN*********/

/* GET cards/:username =>  { cardIds }
Returns list of cards that user owns - Correct User or Admin Only
*/
router.get("/:username", ensureLoggedIn, async function (req, res, next) {
    try {
        const username = req.params.username;
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
        const card = req.body;
        const newCard = {
            "name": card.name,
            "superType": card.supertype,
            "subtype": card.subtype,
            "hp": card.hp,
            "types": card.types,
            "evolvesTo": card.evolvesTo,
            "rules": card.rules,
            "attacks": card.attacks,
            "weaknesses": card.weaknesses,
            "retreatCost": card.retreatCost,
            "convertedRetreatCost": card.convertedRetreatCost,
            "setName": card.set.name,
            "setLogo": card.set.images.logo,
            "number": card.number,
            "artist": card.artist,
            "rarity": card.rarity,
            "nationalPokedexNumbers": card.nationalPokedexNumbers,
            "legalities": card.legalities,
            "images": card.images.large,
            "tcgplayer": card.tcgplayer,
            "prices": card.tcgplayer.prices
        };
        const newCards = await Cards.create(newCard);
        return res.json({ newCards });
    } catch (error) {
        return next(error);
    };
});

/* DELETE /[handle]  =>  { deleted: handle }
route to delete a card by id - only admins allowed
returns deleted card ID
*/
router.post("/delete/:cardId", ensureAdmin, async function (req, res, next) {
    try {
        const card = req.params.cardId;

        const deletedCard = await Cards.delete(card);
        return res.json({ deletedCard });
    } catch (error) {
        return next(error);
    };
});

module.exports = router;