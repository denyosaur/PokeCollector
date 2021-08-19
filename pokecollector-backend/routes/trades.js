"use strict";

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin } = require("../middleware/auth");

const Trades = require("../models/trades");
const Messages = require("../models/messages");

const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();



/* GET trades/ => [{id, sellerId, buyerId, sellerOffer, buyerOffer}, ...]
all trades for a user
*/
router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const username = req.params.username;
        const trades = Trades.getAllUserTrades(username);
        return res.json({ trades });
    } catch (error) {
        return next(error);
    };
});

/* GET trades/:id => {id, sellerId, buyerId, sellerOffer, buyerOffer}
get information about a specific trade
*/
router.get("/:username/:tradeId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username, tradeId } = req.params;

        const trade = Trades.getTrade(tradeId, username);
        return res.json({ trade });
    } catch (error) {
        return next(error);
    };
});

/* POST trades/:username/:tradeId/sendMessage => {tradeId, userId, message, timestamp}
post a new entry in the messages table 
*/
router.post("/:username/:tradeId/sendMessage", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const message = req.body;
        const { username, tradeId } = req.params;

        const message = Messages.createMessage(tradeId, username, message);
        return res.status(201).json({ message });
    } catch (error) {
        return next(error);
    };
});

/* POST trades/:username/ => {id, sellerId, buyerId, sellerOffer, buyerOffer}
req.body will contain - seller buyer username and offers (seller and buyer)
create a new trade with offers
*/
router.post("/:username/create", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { buyer, offers, message } = req.body;
        const username = req.params;

        const usernames = {
            seller: username,
            buyer: buyer
        };

        const trade = Trades.createTrade(usernames, offers, message);

        return res.status(201).json({ trade });
    } catch (error) {
        return next(error);
    };
});

/* POST trades/:username/:tradeId => {true}
route that accepts trade offer
*/
router.post("/:username/:tradeId/accept", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { username, tradeId } = req.params;

        const trade = Trades.acceptOffer(username, tradeId);

        return res.status(201).json({ completed: trade });
    } catch (error) {
        return next(error);
    };
});

/* DELETE trades/:username/:tradeId/delete => { deleted: trade }
route that deletes trade offer
*/
router.delete("/:username/:tradeId/delete", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const tradeId = req.params.tradeId;

        const trade = Trades.deleteOffer(tradeId);

        return res.status(201).json({ deleted: trade });
    } catch (error) {
        return next(error);
    };
});