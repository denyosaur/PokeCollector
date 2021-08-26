"use strict";

const db = require("../db");

const Cards = require("./cards");

const { NotFoundError } = require("../expressErrors");

/* Functions for cards that users own */

class UsersCards {
    constructor(id, username, cardId, cardInfo = null) {
        this.ownedId = id;
        this.username = username;
        this.cardId = cardId;
        this.cardInfo = cardInfo;
    };

    /* Get all User's Cards
    First, make a db query to check if user with username exists. if not, throw NotFoundError
    make query to get all card IDs that the user owns
    return cardInfos [{ownedId, username, cardId, cardInfo},...]
    */
    static async getUsersCards(username) {
        const cardsResult = await db.query(`SELECT u.id AS "ownedId", 
                                                   u.card_id AS "cardId", 
                                                   u.username,
                                                   cards.id,
                                                   cards.name, 
                                                   cards.supertype, 
                                                   cards.subtypes, 
                                                   cards.hp, 
                                                   cards.types, 
                                                   cards.evolves_to AS "evolvesTo", 
                                                   cards.rules, 
                                                   cards.attacks, 
                                                   cards.weaknesses, 
                                                   cards.resistances, 
                                                   cards.retreat_cost AS "retreatCost", 
                                                   cards.converted_retreat_cost AS "convertedRetreatCost", 
                                                   cards.set_name AS "setName", 
                                                   cards.set_logo AS "setLogo", 
                                                   cards.artist, 
                                                   cards.rarity, 
                                                   cards.national_pokedex_numbers AS "nationalPokedexNumbers", 
                                                   cards.legalities, 
                                                   cards.images, 
                                                   cards.tcgplayer, 
                                                   cards.prices
                                            FROM users_cards u
                                            INNER JOIN cards ON u.card_id = cards.id
                                            WHERE u.username = $1`, [username]);

        const ownedCards = cardsResult.rows.map(cardData => {
            const { ownedId, cardId, username, id, name, superType, subtype, hp, types, evolvesTo, rules, attacks, weaknesses, resistances, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices } = cardData;

            const cardInfo = new Cards(id, name, superType, subtype, hp, types, evolvesTo, rules, attacks, weaknesses, resistances, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices);

            const usersCardsInfo = new UsersCards(ownedId, username, cardId, cardInfo);

            return usersCardsInfo;
        })

        return ownedCards;
    };

    /* Add new card to user
    First, make a db query to check if the card with cardId exists. if not, throw NotFoundError
    Second, make a db query to check if user already owns the card
        if user owns the card, increment by 1
        if not, INSERT a new entry with card
    return card object {id, username, cardId}
    */
    static async createNewCard(newUsername, newCardId) {
        const result = await db.query(`INSERT INTO users_cards
                                       (username, card_id)
                                       VALUES ($1, $2)
                                       RETURNING id, username, card_id AS "cardId"`, [newUsername, newCardId]);

        const cardInfo = await Cards.getCardInfo(newCardId);

        const { id, username, cardId } = result.rows[0];

        return new UsersCards(id, username, cardId, cardInfo);
    };

    /* Add Multiple Cards to a User - used for buying cards
    for each entry in cardArr, use createNewCard
    return an array of objects [{UsersCards},...]
    */
    static async createCardsToUser(username, cardArr) {
        const cards = await Promise.all(cardArr.map(async (cardId) => {
            const newCard = await this.createNewCard(username, cardId);
            return newCard;
        }));

        return cards;
    };

    /* Make Trade - used with Trades.acceptOffer()
    take in seller id, buyer id, and offers
    use addCardToUser and removeCardFromUser to add and remove cards accordingly
    */
    static async makeTrade(sellerName, buyerName, sellerOffer, buyerOffer) {
        const buyersNew = await this._transfer(sellerName, buyerName, sellerOffer);
        const sellersNew = await this._transfer(buyerName, sellerName, buyerOffer);

        return { buyersNew, sellersNew };
    };
    /* support function used to transfer ownership of cards in users_card
    */
    static async _transfer(oldOwner, newOwner, toTrade) {
        const transferRes = await Promise.all(toTrade.map(async (cardId) => {
            const updateOwner = await db.query(`UPDATE users_cards
                                                SET username=$1
                                                WHERE username=$2 AND card_id=$3
                                                RETURNING id, username, card_id AS "cardId"`, [newOwner, oldOwner, cardId]);

            return updateOwner.rows[0];
        }));

        return transferRes;
    };

    static async _checkOwnership(username, toTrade) {
        const string = `username = $1 AND card_id IN ()`
        const check = await db.query(`SELECT id, username, card_id AS "cardId"
                                      FROM users_cards
                                      WHERE username = $1 AND card_id IN ()`);
    };
};

module.exports = UsersCards;