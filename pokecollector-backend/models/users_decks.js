"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class CardDeck {
    /* Create New Card Deck
    make a query to find the user ID of user from username
    make query to INSERT a new entry with user ID and deck name
    returns object: {username, deckName}
    */
    static async createDeck(username, deckName) {
        const deckResult = await db.query(`INSERT INTO users_decks
                                           (username, deck_name)
                                           VALUES ($1, $2)
                                           RETURNING deck_name AS "deckName"`, [username, deckName]);

        const newDeck = deckResult.rows[0];

        return newDeck;
    };

    /* Get All Deck that the User Owns
    makes an initial query to get user's ID
    then makes a query to pull all the decks that the user owns
    returns array [deckName1, deckName2, ...]
    */
    static async getAllDecks(username) {
        const deckResult = await db.query(`SELECT deck_name 
                                           FROM user_decks
                                           WHERE username = $1
                                           ORDER BY deck_name`, [username]);

        return deckResult.rows;
    };

    /* Update Card Deck Name
    accepts username and an object named data {currentDeckName, updatedDeckName}
    check if currentDeckName in data object exists in users_decks. if not, throw BadRequestError
    make query request to change the currentDeckName to updatedDeckName
    return newDeckName 
    */
    static async updateDeckName(username, data) {
        const { currentDeckName, updatedDeckName } = data;
        //check if the deck exists
        const deckCheck = await db.query(`SELECT deck_name FROM users_decks WHERE username = $1 AND deck_name = $2`, [username, currentDeckName]);
        if (!deckCheck.rows[0]) throw new BadRequestError(`No Deck with Name: ${currentDeckName}`);

        const result = await db.query(`UPDATE users_decks
                                 SET deck_name = $1
                                 WHERE deck_name = $2
                                 RETURNING deck_name`[updatedDeckName, currentDeckName]);

        const newDeckName = result.rows[0];

        return newDeckName;
    };

    /* Delete Card Deck
    make a query to find the user ID of user from username
    make query to DELETE entry with matching user ID and deck name 
    returns object: {username, deckName}
    */
    static async deleteDeck(username, deckName) {
        //check if the deck exists
        const duplicateCheck = await db.query(`SELECT deck_name FROM users_decks WHERE user_id = $1 AND deck_name = $2`, [user.id, deckName]);
        if (!duplicateCheck.rows[0]) throw new BadRequestError(`No Deck with Name: ${deckName}`);

        const result = await db.query(`DELETE 
                                       FROM users_decks
                                       WHERE username = $1 AND deck_name = $2
                                       RETURNING username, deck_name AS "deckName"`, [username, deckName]);

        const deck = result.rows[0];

        if (!deck) throw new NotFoundError(`No deck with name: ${deckName}`);

        return deck;
    };
};

module.exports = { CardDeck };