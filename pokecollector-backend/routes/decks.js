"use strict";

/* Routes for Authentication */

const jsonschema = require("jsonschema");
const cardSchema = require("../schemas/cardSchema.json");

const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const express = require("express");

const Decks = require("../models/decks");

const router = new express.Router();


/* GET /decks/:username => {decks:[{deckName1}, {deckName2}, ...]}
get a list of all the decks the user owns
*/
router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const username = req.params.username;
        const decks = await Decks.getAllDecks(username);

        return res.json({ decks });
    } catch (error) {
        return next(error);
    };
});

/* GET /decks/:username => {deck, cards: [{id, name, images, setName, setLogo},...]}
get list of all cards in the deck
*/
router.get("/:username/:deckId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const deckId = req.params.deckId;

        const deck = await Decks.getDeck(deckId);
        const cards = await deck.getCards();

        return res.json({ deck, cards });
    } catch (error) {
        return next(error);
    };
});

/* POST /decks/:username => {deck: deckName}
create a new deck
*/
router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const deckName = req.body.deckName;
        const username = req.params.username;

        const deck = await Decks.createDeck(username, deckName);

        return res.json({ deck });
    } catch (error) {
        return next(error);
    };
});


/* PATCH /decks/:username => {deck: deckName}
updates name of deck that user owns
req.body = {currentDeckName, updatedDeckName}
*/
router.patch("/:username/:deckId/updateName", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { deckId, newName } = req.body;
        const deck = await Decks.getDeck(deckId);

        const newDeckName = await deck.updateDeckName(newName);

        return res.json({ newDeckName });
    } catch (error) {
        return next(error);
    };
});

/* POST /decks/:username => {updated: {added}, {removed}}
insert or delete cards from deck 
req.body = {[remove], [add]} - array of card IDs
*/
router.patch("/:username/:deckId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { remove, add } = req.body;
        const deckId = req.params;
        const deck = await Decks.getDeck(deckId);

        const updated = await deck.updateCards(remove, add);
        return res.json({ updated });
    } catch (error) {
        return next(error);
    };
});

/* DELETE /decks/:username/:deckId => {deleted: {username, deckName}}
delete entire deck
*/
router.delete("/:username/:deckId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { deckId } = req.params;
        const deck = await Decks.getDeck(deckId);

        const deleted = deck.delete();

        return res.json({ deleted });
    } catch (error) {
        return next(error);
    };
});