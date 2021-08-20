"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const CardsInDecks = require("./cards_in_decks")

class Deck {
    constructor(id, username, deckName) {
        this.deckId = id;
        this.username = username;
        this.deckName = deckName;
    };

    /* Create New Card Deck
    make a query to find the user ID of user from username
    make query to INSERT a new entry with user ID and deck name
    returns object: {id, username, deckName}
    */
    static async createDeck(username, deckName) {
        const deckResult = await db.query(`INSERT INTO users_decks
                                           (username, deck_name)
                                           VALUES ($1, $2)
                                           RETURNING id, username, deck_name AS "deckName"`, [username, deckName]);

        const { id, username, deckName } = deckResult.rows[0];

        return new Deck(id, username, deckName);
    };

    /* Get All Deck that the User Owns
    makes an initial query to get user's ID
    then makes a query to pull all the decks that the user owns
    returns array [{deckName1}, {deckName2}, ...]
    */
    static async getAllDecks(username) {
        const result = await db.query(`SELECT id, username, deck_name AS "deckName"
                                       FROM user_decks
                                       WHERE username = $1
                                       ORDER BY deck_name`, [username]);

        const decks = result.rows.map(deck => {
            const { id, username, deckName } = deck;
            return new Deck(id, username, deckName);
        })

        return decks;
    };

    /* Get A deck user owned by deck name and username
    makes an initial query to get user's ID
    then makes a query to pull all the decks that the user owns
    returns object {id, username, deckName}
    */
    static async getDeck(deckId) {
        const result = await db.query(`SELECT id, username, deck_name AS "deckName"
                                       FROM user_decks
                                       WHERE id = $1`, [deckId]);

        if (!result.rows[0]) throw new NotFoundError(`No Deck with ID of ${deckId}`);

        const { id, username, deckName } = result.rows[0];

        return new Deck(id, username, deckName);
    };

    /* Update Card Deck Name
    accepts username and an object named data {currentDeckName, updatedDeckName}
    check if currentDeckName in data object exists in users_decks. if not, throw BadRequestError
    make query request to change the currentDeckName to updatedDeckName
    return newDeckName 
    */
    async updateDeckName(newName) {
        const result = await db.query(`UPDATE users_decks
                                       SET deck_name = $1
                                       WHERE id = $2
                                       RETURNING deck_name AS "deckName"`[newName, this.deckId]);

        const newDeckName = result.rows[0];

        return newDeckName;
    };

    /* Delete Card Deck
    make query to DELETE entry with matching username and ID 
    if it doesn't exist, throw NotFoundError
    returns object: {id, username, deckName}
    */
    async delete() {
        const result = await db.query(`DELETE 
                                       FROM users_decks
                                       WHERE id = $1
                                       RETURNING id, username, deck_name AS "deckName"`, [this.deckId]);

        const deck = result.rows[0];

        return deck;
    };

    /* Get all cards from this deck
    make query to DELETE entry with matching username and ID 
    if it doesn't exist, throw NotFoundError
    returns object: {id, username, deckName}
    */
    async getCards() {
        const cards = await CardsInDecks.getAllCards(this.deckId);

        return cards;
    };

    /*Update cards in Deck
    make a query request to remove the card from the deck
    if there is no row with matching deck and card ID, throw NotFoundError
    return removedCard {deckId, cardId}
    */
    async updateCards(removeArr, addArr) {
        const removed = await CardsInDecks.removeCards(this.deckId, removeArr);
        const added = await CardsInDecks.addCards(this.deckId, addArr);
        return { removed, added };
    };
};

module.exports = { Deck };