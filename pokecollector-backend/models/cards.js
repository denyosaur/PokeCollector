"use strict";

const db = require("../db");
const { BadRequestError } = require("../expressError");
const { NotFoundError } = require("../expressErrors");

/*
Model for cards in the DB. Holds related functions.
*/
class Cards {
    /*Create a new card in the card_library table.
        check if the card exists by searching for the card_id. card_id is taken from the IDs given by the API.
        if ID exists, return BadRequestError for duplicate.
        if card doesn't exist, create a new entry for card in card_library
    */
    static async create({ id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices }) {
        const duplicateCheck = await db.query(
            `SELECT card_id 
            FROM cards
            WHERE card_name = $1 AND setName = $2`,
            [name, setName]);

        //check if the new card is already in DB
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate entry for: ${card_id}, ${card_name}`)

        const res = await db.query(`
        INSERT INTO cards
        (id, name, supertype, subtypes, hp, types, evolves_to, rules, attacks, weaknesses, retreat_cost, converted_retreat_cost, set_name, set_logo, number, artist, rarity, national_pokedex_numbers, legalities, images, tcgplayer, prices)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)`
        [id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices])
        const cardInfo = res.rows[0];
        return cardInfo;
    }

    /*Delete a card in the card table.
    make a delete query where id = cardId
    if query is null, throw NotFoundError
    return card ID
    */
    static async delete(cardId) {
        const result = await db.query(`DELETE  
                                     FROM cards
                                     WHERE id = $1
                                     RETURNING id`, [cardId]);

        const card = result.rows[0];
        if (!card) throw new NotFoundError(`No card with ID: ${cardId}`);

        return card;
    }

    /*method to find all the cards. can use search filters to filter out results
    query variable holds the base SQL query. whereExpressions will hold the sql query strings for search filters. Where statements hold the syntax for db.query.
    queryValues holds the actual values that will be put in with the db.query
    */
    static async findAll(searchFilters = {}) {
        let query = `SELECT id, name, images, prices, rarity, setName
                    FROM cards`;
        let whereExpressions = []; //array to hold the parts of the WHERE constraints
        let queryValues = []; //array to hold the values used to replace

        const { name, minPrice, maxPrice, rarity, types, setName } = searchFilters

        //name, minPrice, maxPrice, rarity, types, setName are all the possible saerch terms.
        //for each search query, create and push into where expressions the SQL syntax.
        if (name) { //name query
            queryValues.push(`%${name}%`);
            whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }
        if (minPrice !== undefined) {//minimum price query
            queryValues.push(minPrice);
            whereExpressions.push(`price >= $${queryValues.length}`);
        };
        if (maxPrice !== undefined) {//maximum price query
            queryValues.push(maxPrice);
            whereExpressions.push(`price = $${queryValues.length}`);
        };
        if (rarity !== undefined) {//rarity query
            queryValues.push(rarity);
            whereExpressions.push(`rarity = $${queryValues.length}`);
        };
        if (types !== undefined) {//types query, searches through array in SQL
            let sqlTypes = `{"${types}"}`
            queryValues.push(sqlTypes);
            whereExpressions.push(`types @> $${queryValues.length}`);
        };
        if (setName !== undefined) {//set name query
            queryValues.push(setName);
            whereExpressions.push(`setName = $${queryValues.length}`);
        };

        //Create Where statement by combining all search queries from above
        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ")
        }

        //finalize query by adding ORDER BY name by default
        query += " ORDER BY name";

        const cardResponse = await db.query(query, queryValues);

        return cardResponse.rows;
    };

    /*Get All Information on a Single Card 
        query variable holds the base SQL query.
        returns all information about card
    */
    static async getCardInfo(cardId) {
        let query = await db.query(`SELECT * FROM cards WHERE id = $1`, [cardId]);
        if (!query) throw new NotFoundError(`No card with ID: ${cardId}`);

        return query.rows;
    };

    /*
    Card Pack Open Method

    */
    static async openCardPack(setName) {
        //get all cards for the specific set
        let query = await db.query(`SELECT * FROM cards WHERE set_name = $1`, [setName]);
        let cardSet = query.rows;

        return cardSet;
    };



}

module.exports = { Cards };