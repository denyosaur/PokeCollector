"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressErrors");
const CardsInDecks = require("./cards_in_decks")

/* Functions for Deck Building */

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
    static async createDeck(newDeck) {
        const { username, deckName } = newDeck;

        const deckResult = await db.query(`INSERT INTO decks
                                           (username, deck_name)
                                           VALUES ($1, $2)
                                           RETURNING id, username AS "newUsername", deck_name AS "newDeckName"`, [username, deckName]);

        const { id, newUsername, newDeckName } = deckResult.rows[0];

        return new Deck(id, newUsername, newDeckName);
    };

    /* Get All Deck that the User Owns
    makes an initial query to get user's ID
    then makes a query to pull all the decks that the user owns
    returns array [{deckName1}, {deckName2}, ...]
    */
    async getAllDecks(uname) {
        const result = await db.query(`SELECT id, username, deck_name AS "deckName"
                                       FROM decks
                                       WHERE username = $1
                                       ORDER BY deck_name`, [uname]);

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
                                       FROM decks
                                       WHERE id = $1`, [deckId]);

        if (!result.rows[0]) throw new NotFoundError(`No Deck with ID of ${deckId}`);

        const { id, username, deckName } = result.rows[0];

        return new Deck(id, username, deckName);
    };

    /* Update Card Deck Name
    accepts username and an object named data {currentDeckName, updatedDeckName}
    check if currentDeckName in data object exists in decks. if not, throw BadRequestError
    make query request to change the currentDeckName to updatedDeckName
    return newDeckName 
    */
    static async updateDeckName(newName) {
        const result = await db.query(`UPDATE decks
                                       SET deck_name = $1
                                       WHERE id = $2
                                       RETURNING id, username, deck_name AS "deckName"`, [newName, this.deckId]);

        const { id, username, deckName } = result.rows[0];

        return new Deck(id, username, deckName);
    };

    /* Delete Card Deck
    make query to DELETE entry with matching username and ID 
    if it doesn't exist, throw NotFoundError
    returns object: {id, username, deckName}
    */
    static async delete() {
        const result = await db.query(`DELETE 
                                       FROM decks
                                       WHERE id = $1
                                       RETURNING id, username, deck_name AS "deckName"`, [this.deckId]);

        const deck = result.rows[0];
        return deck;
    };

    /* Get all cards from this deck
    call method getAllCards from CardsInDecks with deck ID passed in
    returns object: [{id, name, images, setName, setLogo},...]
    */
    static async getCards() {
        const cards = await CardsInDecks.getAllCards(this.deckId);
        return cards;
    };

    /*Update cards in Deck
    call method removeCards from CardsInDecks with deck ID passed in
    if there is no row with matching deck and card ID, throw NotFoundError
    return object 
    {updated:{
        removed: {deckId, cardId}, 
        added:{deckId, cardId}
    }}
    */
    static async updateCards(removeArr, addArr) {
        const updated = await CardsInDecks.updateDeckCards(this.deckId, removeArr, addArr);
        return updated;
    };
};

module.exports = Deck;