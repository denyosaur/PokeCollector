"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql-helpers");

const UsersCards = require("./users_cards")
const Messages = require("./messages")

/* Functions for Trades */

class Trades {
    constructor(id, sellerName, buyerName, sellerOffer, buyerOffer, completed = false, messages = null) {
        this.id = id;
        this.sellerName = sellerName;
        this.buyerName = buyerName;
        this.sellerOffer = sellerOffer;
        this.buyerOffer = buyerOffer;
        this.completed = completed;
        this.messages = messages;
    };

    /* Create a Card Trade
    for each key in usernames, make a query request to fetch IDs. 
    make a db request to insert new trade into trades table
    create a new message using Messages.createMessage
    return new trade object {seller, buyer, sellerOffer, buyerOffer, {message}}
    */
    static async createTrade(sellerName, buyerName, offers, message) {
        const { sellerOffer, buyerOffer } = offers;

        const tradeRes = await db.query(`INSERT INTO trades
                                         (seller_name, buyer_name, seller_offer, buyer_offer, completed)
                                         VALUES ($1, $2, $3, $4, $5)
                                         RETURNING id,
                                                   seller_name AS "sellerName", 
                                                   buyer_name AS "buyerName", 
                                                   seller_offer AS "sellerOffer",
                                                   buyer_offer AS "buyerOffer",
                                                   completed`,
            [sellerName, buyerName, sellerOffer, buyerOffer, false]);
        const { id, sellerName, buyerName, sellerOffer, buyerOffer, completed } = tradeRes.rows[0];
        const newTrade = new Trades(id, sellerName, buyerName, sellerOffer, buyerOffer, completed);

        const message = await Messages.createMessage(id, sellerName, message);
        newTrade.messages = message;

        return newTrade;
    };

    /* Get trade by ID
    make query to get all information of trade by ID. if trade doesn't exist, throw NotFoundError
    make query to get all messages related to trade and add to new Trades() object
    return the results {id, sellerName, buyerName, sellerOffer, buyerOffer, completed, messages}
    */
    static async getTrade(tradeId) {
        const result = await db.query(`SELECT id, 
                                              seller_name AS "sellerName", 
                                              buyer_name AS "buyerName", 
                                              seller_offer AS "sellerOffer", 
                                              buyer_offer AS "buyerOffer", 
                                              completed
                                       FROM trades 
                                       WHERE id = $1`, [tradeId]);

        if (!result.rows[0]) throw new NotFoundError(`No trade with ID: ${tradeId}`);

        const { id, sellerName, buyerName, sellerOffer, buyerOffer, completed } = result.rows[0];

        const messages = await Messages.getAllMessages(tradeId);

        const trade = new Trades(id, sellerName, buyerName, sellerOffer, buyerOffer, completed, messages);

        return trade;
    };

    /* Get All of User's Seller/Buyer Offers
    make a query request to get all trades where the username matches the seller_name or buyer_name
    return the results [{id, sellerName, buyerName, sellerOffer, buyerOffer}, ...]
    */
    static async getAllUserTrades(username) {
        const result = await db.query(`SELECT id, 
                                              seller_name AS "sellerName", 
                                              buyer_name AS "buyerName", 
                                              seller_offer AS "sellerOffer", 
                                              buyer_offer AS "buyerOffer", 
                                              completed
                                       FROM trades 
                                       WHERE seller_name = $1 OR buyer_name = $1`, [username]);

        const trades = result.map(trade => {
            const { id, sellerName, buyerName, sellerOffer, buyerOffer, completed } = trade;
            return new Trades(id, sellerName, buyerName, sellerOffer, buyerOffer, completed);
        });

        return trades;
    };

    /* Accept Offer
    find the user id of the person who accepted offer
    make query to check that trade ID exists. if it doesn't exist, throw a NotFoundError
    if the user who accepts offer is not the buyer, throw BadRequestError

    call usersCards.makeTrade() method from UsersCards to swap the crads between two users.
    return true
    */
    async acceptOffer(username) {
        if (username !== this.buyerName) throw new BadRequestError(`This user made the offer: ${username}`);

        UsersCards.makeTrade(this.sellerName, this.buyerName, this.sellerOffer, this.buyerOffer);

        const finalize = await db.query(`UPDATE trades
                                         SET completed = $1
                                         WHERE id = $2
                                         RETURNING completed,`[true, id]);
        return finalize.rows[0];
    };

    /* Update Trade Offer
    data is an object that contains columns that can be updated.
    send the new data ({sellerOffer, buyerOffer}) and changableData to sqlForPartialUpdate for sql queries
    indexIdx holds the last index of the values array. this wil be used for the last spot in array
    make a db query to update the seller and buyer offers
    with the returning information, create a new Trades object
    */
    async updateOffer(data) {
        const changableData = {
            sellerOffer: "seller_offer",
            buyerOffer: "buyer_offer"
        };
        const { setCols, values } = sqlForPartialUpdate(data, changableData);

        const indexId = "$" + (values.length + 1);

        const querySql = `UPDATE trades 
                          SET ${setCols} 
                          WHERE id = ${indexId} 
                          RETURNING id,
                                    seller_name AS "sellerName", 
                                    buyer_name AS "buyerName", 
                                    seller_offer AS "sellerOffer", 
                                    buyer_offer AS "buyerOffer",
                                    completed`;
        const result = await db.query(querySql, [...values, this.id]);

        const { id, sellerName, buyerName, sellerOffer, buyerOffer, completed } = result.rows[0];
        const updatedTrade = new Trades(id, sellerName, buyerName, sellerOffer, buyerOffer, completed);

        return updatedTrade;
    };

    /* Delete/Refuse Offer
    make a query to delete offer by ID
    if offer is not found, throw NotFoundError
    return trade the id
    */
    async deleteOffer() {
        const result = await db.query(`DELETE
                                       FROM trades
                                       WHERE id = $1
                                       RETURNING id`, [this.id]);

        const trade = result.rows[0];

        return trade;
    };

};

module.exports = { Trades };