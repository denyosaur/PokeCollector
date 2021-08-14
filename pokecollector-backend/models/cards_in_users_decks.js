"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { NotFoundError } = require("../expressErrors");

class CardsInUsersDecks {
    /*Add Cards to Deck
    make a query request make a new entry with deck ID and card ID
    return addCard {deckId, cardId}
    */
    addCardToDeck(deckId, cardId) {
        const addCard = await db.query(`INSERT INTO cards_in_users_decks
                                        (deck_id, users_cards_id)
                                        VALUES ($1, $2)
                                        RETURNING deck_id AS "deckId", users_cards_id AS "cardId"`, [deckId, cardId]);

        const addedCard = addCard.rows[0];

        return addedCard;
    };

    /*Get All Cards in Deck
    make a query request make a new entry with deck ID and card ID
    return addCard {deckId, cardId}
    */
    getAllCardsInDeck(deckId) {
        const decks = await db.query(`SELECT users_cards_id
                                      FROM cards_in_users_decks
                                      WHERE deck_id = $1`, [deckId]);

        const cards = decks.rows[0];

        if (!cards) throw new NotFoundError(`No deck with ID: ${deckId}`);

        return cards;
    };

    /*Remove Card from Deck
    make a query request to remove the card from the deck
    if there is no row with matching deck and card ID, throw NotFoundError
    return removedCard {deckId, cardId}
    */
    removeCardFromDeck(deckId, cardId) {
        const remove = await db.query(`DELETE
                                       FROM cards_in_users_decks
                                       WHERE deck_id = $1 AND card_Id = $2
                                       RETURNING deck_id AS "deckId", users_cards_id AS "cardId"`, [deckId, cardId]);

        const removedCard = remove.rows[0];

        if (!removedCard) throw new NotFoundError(`No card with ID: ${id} found in deck ${deckId}`);

        return removedCard;
    };

}

module.exports = { CardsInUsersDecks };
