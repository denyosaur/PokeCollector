"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/* Functions for cards that users own */

class UsersCards {
    constructor(id, cardId, username, cardName = null, setName = null, setLogo = null, images = null, prices = null) {
        this.id = id;
        this.cardId = cardId;
        this.username = username;
        this.cardName = cardName;
        this.setName = setName;
        this.setLogo = setLogo;
        this.images = images;
        this.prices = prices;
    }
    /* Get all User's Cards
    First, make a db query to check if user with username exists. if not, throw NotFoundError
    make query to get all card IDs that the user owns
    return cardInfos [cardId, ...]
    */
    static async getUsersCards(username) {
        const cardsResult = await db.query(`SELECT u.id, 
                                                u.card_id AS "cardId", 
                                                u.username,
                                                cards.name AS "cardName", 
                                                cards.set_name AS "setName", 
                                                cards.set_logo AS "setLogo", 
                                                cards.images, 
                                                cards.prices
                                            FROM users_cards u
                                            INNER JOIN cards ON u.card_id = cards.id
                                            WHERE u.username = $1`, [username]);
        const cards = cardsResult.rows.map(card => {
            const { id, cardId, username, cardName, setName, setLogo, images, prices } = card;
            return new UsersCards(id, cardId, username, cardName, setName, setLogo, images, prices);
        })

        return cards;
    };

    /* Add new card to user
    First, make a db query to check if the card with cardId exists. if not, throw NotFoundError
    Second, make a db query to check if user already owns the card
        if user owns the card, increment by 1
        if not, INSERT a new entry with card
    return card object {id, username, cardId}
    */
    static async createNewCard(username, cardId) {
        const result = await db.query(`INSERT INTO users_cards
                                       (username, card_id)
                                       VALUES ($1, $2)
                                       RETURNING id, username, card_id AS "cardId"`, [username, cardId]);

        const { id, username, cardId } = result.rows[0];

        return new UsersCards(id, username, cardId);
    };

    /* Add Multiple Cards to a User - used for buying cards
    for each entry in cardArr, use createNewCard
    return an array of objects [{id, username, cardId},...]
    */
    static async createCardsToUser(username, cardArr) {
        const cards = cardArr.map(cardId => {
            return this.createNewCard(username, cardId);
        });

        return cards;
    };

    /* Remove Card From User
    First, make a db query to check if the user owns the card. if not, throw NotFoundError
    update the row's user_id to be null.
    */
    static async _removeUserFromCard(username, cardId) {
        const cardResult = await db.query(`SELECT id, username, card_id AS "cardId"
                                           FROM users_cards
                                           WHERE username = $1 AND card_id = $2`, [username, cardId]);
        const cardOwned = cardResult.rows
        if (!cardOwned) throw new NotFoundError(`Users does not own card with ID: ${cardId}`);

        const removeResult = await db.query(`UPDATE users_cards
                                             SET username = $1
                                             WHERE id = $2
                                             RETURNING id`, [null, cardOwned[0]]);
        const cardRemoved = removeResult.rows[0];
        return cardRemoved;
    };

    /* Add user to card
    First, make a db query to check if the card with cardId exists in users_cards. if not, throw NotFoundError
    Second, update request to change username in users_cards to username 
    return the entry for card in users_cards
    */
    static async _addUserFromCard(username, cardOwnedId) {
        //check if card exists in card table
        const cardExists = await db.query(`SELECT id, card_id AS "cardId", card_name AS "cardName"
                                           FROM cards
                                           WHERE id = $1`, [cardOwnedId]);
        if (!cardExists) throw new NotFoundError(`No card owned with ID: ${cardId}`);

        const updateCard = await db.query(`UPDATE users_cards
                                           SET username = $1
                                           WHERE id = $2
                                           RETURNING id, username, card_id AS "cardId"`, [username, cardOwnedId]);

        const card = updateCard.rows[0];

        return card;
    };

    /* Make Trade - used with Trades.acceptOffer()
    take in seller id, buyer id, and offers
    use addCardToUser and removeCardFromUser to add and remove cards accordingly
    */
    static async makeTrade(sellerName, buyerName, sellerOffer, buyerOffer) {
        const buyersNewCards = sellerOffer.map(cardId => {
            const sellerCard = this._removeUserFromCard(sellerName, cardId);
            this.addCardToUser(buyerName, sellerCard)
        });

        const sellersNewCards = buyerOffer.map(cardId => {
            const buyerCard = this._removeUserFromCard(buyerName, cardId);
            this.addCardToUser(sellerName, buyerCard)
        });

        return { buyersNewCards, sellersNewCards };
    };
};

module.exports = { UsersCards };
