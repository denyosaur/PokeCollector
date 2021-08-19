"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql-helpers");

const UsersCards = require("./users_cards")
const Messages = require("./messages")

class Trades {
    /* Create a Card Trade
    for each key in usernames, make a query request to fetch IDs. 
    make a db request to insert new trade into trades table
    create a new message using Messages.createMessage
    return new trade object {seller, buyer, sellerOffer, buyerOffer, {message}}
    */
    static async createTrade(usernames, offers, message) {
        const { sellerOffer, buyerOffer } = offers;
        let userIds = {};

        for (let key in usernames) {
            const user = await db.query(`SELECT id
                                         FROM users
                                         WHERE username = $1`, [usernames[key]]);
            const id = user.rows[0];
            userIds[key] = id;
        };


        const tradeRes = await db.query(`INSERT INTO trades
                                         (seller_ID, buyer_id, seller_offer, buyer_offer, completed)
                                         VALUES ($1, $2, $3, $4, $5)
                                         RETURNING id,
                                                   seller_id AS "sellerId", 
                                                   buyer_id AS "buyerId", 
                                                   seller_offer AS "sellerOffer",
                                                   buyer_offer AS "buyerOffer",
                                                   completed`,
            [userIds.seller, userIds.buyer, sellerOffer, buyerOffer, false]);
        const newTrade = tradeRes.rows[0];

        const message = Messages.createMessage(newTrade.id, usernames.seller, message);
        newTrade.message = message;

        return newTrade;
    };

    /* Get trade by ID
    make query to get all information of trade by ID. if trade doesn't exist, throw NotFoundError
    check that only the username passed in belongs to either seller or buyer. if not throw BadRequestError
    return the results {id, sellerId, buyerId, sellerOffer, buyerOffer, completed}
    */
    static async getTrade(tradeId, username) {
        const result = await db.query(`SELECT id, seller_id, buyer_id, seller_offer, buyer_offer, completed
                                       FROM trades 
                                       WHERE id = $1
                                       RETURNING id,
                                                 seller_id AS "sellerId", 
                                                 buyer_id AS "buyerId", 
                                                 seller_offer AS "sellerOffer", 
                                                 buyer_offer AS "buyerOffer",
                                                 completed`, [tradeId]);

        const trade = result.rows[0];
        if (!trade) throw new NotFoundError(`No trade with ID: ${tradeId}`);

        const userInfo = await db.query(`SELECT id FROM users WHERE username = $1`, [username]);
        const userId = userInfo.rows[0];
        if (!(trade.sellerId === userId || trade.buyerId === userId)) throw new BadRequestError(`Incorrect user: ${username}`);

        const messages = await db.query(`SELECT id, trade_id, user_id, message, timestamp
                                         FROM messages
                                         WHERE trade_id = $1
                                         RETURNING id,
                                                   trade_id AS "tradeId",
                                                   user_id AS "userId",
                                                   message
                                                   timestamp`, [tradeId]);
        trade.messages = messages.rows;

        return trade;
    };

    /* Get All of User's Seller/Buyer Offers
    make query to check that username exists. if it doesn't exist, throw a not found error
    make a query request to get all trades where the user ID matches the seller_id or buyer_id
    return the results [{id, sellerId, buyerId, sellerOffer, buyerOffer}, ...]
    */
    static async getAllUserTrades(username) {
        const checkExist = await db.query(`SELECT id FROM users WHERE username = $1`, [usernames]);
        if (!checkExist.rows[0]) throw new NotFoundError(`No user with username: ${username}`);

        const user = checkExist.rows[0];

        const result = await db.query(`SELECT id, seller_id, buyer_id, seller_offer, buyer_offer, completed
                                       FROM trades 
                                       WHERE seller_id = $1 OR buyer_id = $2
                                       RETURNING id,
                                                 seller_id AS "sellerId", 
                                                 buyer_id AS "buyerId", 
                                                 seller_offer AS "sellerOffer", 
                                                 buyer_offer AS "buyerOffer",
                                                 completed`, [user, user]);

        return result.rows;
    };

    /* Accept Offer
    find the user id of the person who accepted offer
    make query to check that trade ID exists. if it doesn't exist, throw a NotFoundError
    if the user who accepts offer is not the buyer, throw BadRequestError

    call usersCards.makeTrade() method from UsersCards to swap the crads between two users.
    return true
    */
    static async acceptOffer(username, tradeId) {
        const user = await db.query(`SELECT id FROM users WHERE username = $1`, [username]);
        const userId = user.rows[0];

        const checkTradeExists = await db.query(`SELECT id, seller_id, buyer_id, seller_offer, buyer_offer, completed
                                           FROM trades 
                                           WHERE id = $1
                                           RETURNING id,
                                                 seller_id AS "sellerId", 
                                                 buyer_id AS "buyerId", 
                                                 seller_offer AS "sellerOffer", 
                                                 buyer_offer AS "buyerOffer"`, [tradeId]);

        const { id, sellerId, buyerId, sellerOffer, buyerOffer } = checkExist.rows[0];

        if (!checkTradeExists.rows[0]) throw new NotFoundError(`No trade found with ID: ${tradeId}`);
        if (userId !== buyerId) throw new BadRequestError(`User made the offer: ${userId}`);

        UsersCards.makeTrade(sellerId, buyerId, sellerOffer, buyerOffer);

        const finalize = await db.query(`UPDATE trades
                                         SET completed = $1
                                         WHERE id = $2
                                         RETURNING completed,`[true, id]);
        return finalize.rows[0];
    };


    /* Update Trade Offer
    changableData is an object that contains columns that can be updated.
    send the new data ({sellerOffer, buyerOffer}) and changableData to sqlForPartialUpdate for sql queries
    indexId holds the last index of the values array. this wil be 
    */
    static async updateOffer(id, data) {
        const changableData = {
            sellerOffer: "seller_offer",
            buyerOffer: "buyer_offer"
        };
        const { cols, values } = sqlForPartialUpdate(data, changableData);

        const indexId = "$" + (values.length + 1);

        const querySql = `UPDATE trades 
                          SET ${cols} 
                          WHERE id = ${indexId} 
                          RETURNING seller_id AS "sellerId", 
                                    buyer_id AS "buyerId", 
                                    seller_offer AS "sellerOffer", 
                                    buyer_offer AS "buyerOffer"`;
        const result = await db.query(querySql, [...values, id]);
        const trade = result.rows[0];

        if (!trade) throw new NotFoundError(`No trade with ID: ${id}`);

        return trade;
    };

    /* Delete/Refuse Offer
    make a query to delete offer by ID
    if offer is not found, throw NotFoundError
    return trade the id
    */
    static async deleteOffer(id) {
        const result = await db.query(`DELETE
                                       FROM trades
                                       WHERE id = $1
                                       RETURNING id`, [id]);

        const trade = result.rows[0];

        if (!trade) throw new NotFoundError(`No trade with ID: ${id}`);

        return trade;
    };

};

module.exports = { Trades };