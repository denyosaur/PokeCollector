"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

//class to handle methods for cards that users own

class UsersCards {
    /* Get all User's Cards
    First, make a db query to check if user with username exists. if not, throw NotFoundError
    make query to get all card IDs that the user owns
    return cardInfos [cardId, ...]
    */
    getUsersCards(username) {
        const checkExists = await db.query(`SELECT id 
                                            FROM users
                                            WHERE username = $1`, [username]);
        if (!checkExists) throw new NotFoundError(`No user with username: ${username}`);

        const getCards = await db.query(`SELECT card_id
                                         FROM users_cards
                                         WHERE username = $1`[username]);

        const cardInfos = getCards.rows.map(id => {
            const card = await db.query(`SELECT id, name, set_name, set_logo, images, prices
                                         FROM cards
                                         WHERE id = $1`, [id]);
            return card.rows[0];
        });
        return cardInfos;
    };

    /* Add new card to user
    First, make a db query to check if the card with cardId exists. if not, throw NotFoundError
    Second, make a db query to check if user already owns the card
        if user owns the card, increment by 1
        if not, INSERT a new entry with card
    return card object {id, username, cardId}
    */
    createNewCard(username, cardId) {
        //check if card exists in card table
        const checkCardExists = await db.query(`SELECT card_id, card_name 
                                           FROM cards
                                           WHERE card_id = $1`, [cardId]);
        const checkUserExists = await db.query(`SELECT id 
                                            FROM users
                                            WHERE username = $1`, [username]);
        if (!checkCardExists) throw new NotFoundError(`No card with ID: ${cardId}`);
        if (!checkUserExists) throw new NotFoundError(`No user with username: ${username}`);


        const result = await db.query(`INSERT INTO users_cards
                                            (username, card_id)
                                            VALUES ($1, $2)
                                            RETURNING id, username, card_id AS "cardId"`,
            [username, cardId]);

        const card = result.rows[0];

        return card;
    };



    /* Add Multiple Cards to a User - used for buying cards
    for each entry in cardArr, use createNewCard
    return an array of objects [{id, username, cardId},...]
    */
    createCardsToUser(username, cardArr) {
        const cards = cardArr.map(cardId => {
            return this.createNewCard(username, cardId)
        });
        return cards;
    };

    /* Remove Card From User
    First, make a db query to check if the user owns the card. if not, throw NotFoundError
    update the row's user_id to be null.
    */
    removeUserFromCard(username, cardId) {
        const cardResult = await db.query(`SELECT id, username, card_id 
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
    addUserFromCard(username, cardOwnedId) {
        //check if card exists in card table
        const cardExists = await db.query(`SELECT id, card_id, card_name 
                                                  FROM cards
                                                  WHERE id = $1`, [cardOwnedId]);
        if (!cardExists) throw new NotFoundError(`No card owned with ID: ${cardId}`);

        const updateCard = await db.query(`UPDATE users_cards
                                           SET username = $1
                                           WHERE id = $2
                                           RETURNING id, username , card_id AS "cardId"`, [username, cardOwnedId]);

        const card = updateCard.rows[0];

        return card;
    };

    /* Make Trade - used with Trades.acceptOffer()
    take in seller id, buyer id, and offers
    use addCardToUser and removeCardFromUser to add and remove cards accordingly
    */
    makeTrade(sellerId, buyerId, sellerOffer, buyerOffer) {
        const buyer = await db.query(`SELECT username
                                       FROM users
                                       WHERE id = $1`[buyerId]);
        const seller = await db.query(`SELECT username
                                       FROM users
                                       WHERE id = $1`[sellerId]);

        const buyersNewCards = sellerOffer.map(cardId => {
            const sellerCard = this.removeUserFromCard(seller.rows[0], cardId);
            this.addCardToUser(buyerId, sellerCard)
        });
        const sellersNewCards = buyerOffer.map(cardId => {
            const buyerCard = this.removeUserFromCard(buyer.rows[0], cardId);
            this.addCardToUser(sellerId, buyerCard)
        });
        return { buyersNewCards, sellersNewCards };
    };
};

module.exports = { UsersCards };
