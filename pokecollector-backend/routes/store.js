"use strict";

/* Routes for Authentication */

const jsonschema = require("jsonschema");
const cardSchema = require("../schemas/cardSchema.json");

const { ensureCorrectUserOrAdmin } = require("../middleware/auth");
const express = require("express");
const UsersCards = require("../models/users_cards");
const Users = require("../models/users");
const router = new express.Router();

/* POST /store/:username => {newCards:[{id, username, cardId},...]}
post new cards to users_cards table
exmple cart = [id1, id2, id3, ...]
*/
router.post("/:username/purchase", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const cart = req.body.cart;
        const username = req.params.username;
        const newCards = UsersCards.createCardsToUser(username, cart);

        return res.status(201).json({ newCards });
    } catch (error) {
        return next(error);
    };
});

/* PATCH /store/:username/removeFunds => {updatedAmount:{username, currencyAmount}}
patch the current currency amount by the amount passed in 
*/
router.patch("/:username/removeFunds", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const price = req.body.price;
        const username = req.params.username;

        const user = await Users.getUser(username);
        const updatedAmount = await user.removeAmount(price);

        return res.json({ updatedAmount });
    } catch (error) {
        return next(error);
    };
});

/* PATCH /store/:username/addFunds => {updatedAmount:{username, currencyAmount}}
patch the current currency amount by the amount passed in 
*/
router.patch("/:username/addFunds", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const addFunds = req.body.funds;
        const username = req.params.username;

        const user = await Users.getUser(username);
        const updatedAmount = await user.addAmount(addFunds);

        return res.json({ updatedAmount });
    } catch (error) {
        return next(error);
    };
});