"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressErrors");

class CardsInDecks {
    constructor(id, name, images, setName, setLogo) {
        this.id = id;
        this.name = name;
        this.images = images;
        this.setName = setName;
        this.setLogo = setLogo;
    }
    /*Get All Cards in Deck
    make a query request make a new entry with deck ID and card ID
    return addCard [{id, name, images, setName, setLogo},...]
    */
    static async getAllCards(deckId) {
        const cardResults = await db.query(`SELECT id, 
                                                   name, 
                                                   images, 
                                                   set_name AS "setName", 
                                                   set_logo AS "setLogo"
                                            FROM cards c
                                            INNER JOIN users_cards 
                                                ON c.id = users_cards.card_id
                                            INNER JOIN cards_in_users_decks u
                                                ON u.users_cards_id = users_cards.id
                                            WHERE u.deck_id = $1`, [deckId]);
        const cards = cardResults.rows.map(card => {
            const { id, name, images, setName, setLogo } = card;
            return new CardsInDecks(id, name, images, setName, setLogo);
        });

        // SELECT s_name, score, status, address_city, email_id, accomplishments
        // FROM student s
        // INNER JOIN marks m ON s.s_id = m.s_id
        // INNER JOIN details d ON d.school_id = m.school_id;

        if (!cards) throw new NotFoundError(`No cards in deck with ID: ${deckId}`);

        return cards;
    };

    /*Add Cards to Deck
    create SQL valid string of [($x, $1), ($x, $2),...] to be used insert query using .map
    make insert into query to add the cards to the deck
    return added cards [{deckId, cardId},...]
    */
    static async addCards(deckId, addArr) {
        const lastIdx = addArr.length + 1;
        const sqlValues = addArr.map((cardId, idx) => {
            return `($${lastIdx}, $${idx})`
        });
        const sqlString = sqlValues.join(", ");

        const addCard = await db.query(`INSERT INTO cards_in_users_decks
                                        (deck_id, users_cards_id)
                                        VALUES ${sqlString}
                                        RETURNING deck_id AS "deckId", users_cards_id AS "cardId"`, [...addArr, deckId]);

        const addedCards = addCard.rows;

        return addedCards;
    };

    /*Remove Card from Deck
    create SQL valid string of [(deck_id = $x AND card_id = $1), (deck_id = $x AND card_id = $2),...] to be used delete query using .map
    make delete query to remove the cards to the deck
    return removed cards [{deckId, cardId},...]
    */
    static async removeCards(deckId, removeArr) {
        const lastIdx = removeArr.length + 1;
        const sqlValues = addArr.map((cardId, idx) => {
            return `(deck_id = $${lastIdx} AND card_id = $${idx})`
        });
        const sqlString = sqlValues.join(", ");
        const remove = await db.query(`DELETE
                                       FROM cards_in_users_decks
                                       WHERE ${sqlString}
                                       RETURNING deck_id AS "deckId", users_cards_id AS "cardId"`, [...removeArr, deckId]);

        const removedCards = remove.rows[0];

        return removedCards;
    };
};

module.exports = { CardsInDecks };
