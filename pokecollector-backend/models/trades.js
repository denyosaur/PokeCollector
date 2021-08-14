"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql-helpers");
const cards = require("./cards");


class Trades {
    /* Create a Card Trade Message
    for each key in usernames, make a query request to fetch IDs. 
    make a db request to insert new trade into trades table
    return new trade object {seller, buyer, sellerOffer, buyerOffer}
    */
    static async createTrade(usernames, offers, messageId) {
        const { sellerOffer, buyerOffer } = offers;
        let userIds = {};

        for (let key in usernames) {
            const user = await db.query(`SELECT id
                                     FROM users
                                     WHERE username = $1`,
                [usernames[key]]);
            const id = user.rows[0];
            userIds[key] = id;
        };


        const result = await db.query(`INSERT INTO trades
                                 (message_id, seller_ID, buyer_id, seller_offer, buyer_offer)
                                 VALUES ($1, $2, $3, $4, $5)
                                 RETURNING seller_id AS "sellerId", 
                                           buyer_id AS "buyerId", 
                                           seller_offer AS "sellerOffer"
                                           buyer_offer AS "buyerOffer"`,
            [messageId, userIds.seller, userIds.buyer, sellerOffer, buyerOffer]);

        const newTrade = result.rows[0];

        return newTrade;
    };

    /* Get All of User's Seller/Buyer Offers
    select the user ID based on username and check if it exists.
    if it doesn't exist, throw a not found error
    make a query request to get all trades where the user ID matches the seller_id or buyer_id
    return the results [{id, sellerId, buyerId, sellerOffer, buyerOffer}, ...]
    */
    static async getAllUserTrades(username) {
        const checkExist = await db.query(`SELECT id FROM users WHERE username = $1`, [usernames]);
        if (!checkExist.rows[0]) throw new NotFoundError(`No user with username: ${username}`);

        const user = checkExist.rows[0];

        const result = await db.query(`SELECT id, seller_id, buyer_id, seller_offer, buyer_offer
                                       FROM trades 
                                       WHERE seller_id = $1 OR buyer_id = $2
                                       RETURNING id
                                                 seller_id AS "sellerId", 
                                                 buyer_id AS "buyerId", 
                                                 seller_offer AS "sellerOffer", 
                                                 buyer_offer AS "buyerOffer"`, [user, user]);

        return result.rows;
    };

    /* Accept Offer
    */
    static async acceptOffer() {

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
                          RETURNING message_id AS "messageId", 
                                    seller_id AS "sellerId", 
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
    static async removeOffer(id) {
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