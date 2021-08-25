"use strict";

const db = require("../db");
const axios = require("axios");

const { NotFoundError, BadRequestError } = require("../expressError");

/* Model for cards in the DB. Holds related functions.*/

class Cards {
    constructor(id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, resistances, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices) {
        this.id = id;
        this.name = name;
        this.supertype = supertype;
        this.subtypes = subtypes;
        this.hp = hp;
        this.types = types;
        this.evolvesTo = evolvesTo;
        this.rules = rules;
        this.attacks = attacks;
        this.weaknesses = weaknesses;
        this.resistances = resistances;
        this.retreatCost = retreatCost;
        this.convertedRetreatCost = convertedRetreatCost;
        this.setName = setName;
        this.setLogo = setLogo;
        this.number = number;
        this.artist = artist;
        this.rarity = rarity;
        this.nationalPokedexNumbers = nationalPokedexNumbers;
        this.legalities = legalities;
        this.images = images;
        this.tcgplayer = tcgplayer;
        this.prices = prices
    };

    /*Pokemon API call to get all cards from a set and push to DB
    make API call using axios.get to get all cards from a set
    use this._create to create cards. 
    return array of Cards object
    */
    static async pullAndPushCards(setName) {
        const url = "https://api.pokemontcg.io/v2/cards";
        const query = {
            q: `set.name:${setName}`
        };

        const result = await axios.get(url, { params: query });
        const cards = result.data.map(card => {
            const newCard = {
                "id": card.id,
                "name": card.name,
                "superType": card.supertype,
                "subtype": card.subtype,
                "hp": card.hp,
                "types": card.types,
                "evolvesTo": card.evolvesTo,
                "rules": card.rules,
                "attacks": card.attacks,
                "weaknesses": card.weaknesses,
                "resistances": card.resistances,
                "retreatCost": card.retreatCost,
                "convertedRetreatCost": card.convertedRetreatCost,
                "setName": card.set.name,
                "setLogo": card.set.images.logo,
                "number": card.number,
                "artist": card.artist,
                "rarity": card.rarity,
                "nationalPokedexNumbers": card.nationalPokedexNumbers,
                "legalities": card.legalities,
                "images": card.images.large,
                "tcgplayer": card.tcgplayer,
                "prices": card.tcgplayer.prices
            };
            return this._create(newCard);
        });

        return cards;
    };


    /*Create a new card in the card_library table.
        check if the card exists by searching for the card_id. card_id is taken from the IDs given by the API.
        if ID exists, return BadRequestError for duplicate.
        if card doesn't exist, create a new entry for card in card_library
    */
    static async _create({ id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices }) {
        const duplicateCheck = await db.query(`SELECT card_id AS "cardId"
                                               FROM cards
                                               WHERE card_name = $1 AND setName = $2`, [name, setName]);

        //check if the new card is already in DB
        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate entry for: ${card_id}, ${card_name} `)

        const res = await db.query(`
        INSERT INTO cards
        (id, name, supertype, subtypes, hp, types, evolves_to, rules, attacks, weaknesses, resistances, retreat_cost, converted_retreat_cost, set_name, set_logo, number, artist, rarity, national_pokedex_numbers, legalities, images, tcgplayer, prices)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING id,
                  name,
                  supertype,
                  subtypes,
                  hp,
                  types,
                  evolves_to AS "evolvesTo",
                  rules,
                  attacks,
                  weaknesses,
                  resistances,
                  retreat_cost AS "retreatCost",
                  converted_retreat_cost AS "convertedRetreatCost",
                  set_name AS "setName",
                  set_logo AS "setLogo",
                  number,
                  artist,
                  rarity,
                  national_pokedex_numbers AS "nationalPokedexNumbers",
                  legalities,
                  images,
                  tcgplayer,
                  prices`, [id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices])

        const { id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices } = res.rows[0];

        return new Cards(id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices);
    };



    /*method to find all the cards. can use search filters to filter out results
    query variable holds the base SQL query. whereExpressions will hold the sql query strings for search filters. Where statements hold the syntax for db.query.
    queryValues holds the actual values that will be put in with the db.query
    */
    static async findAll(searchFilters = {}) {
        const query = `SELECT id,
                            name,
                            supertype,
                            subtypes,
                            hp,
                            types,
                            evolves_to AS "evolvesTo",
                            rules,
                            attacks,
                            weaknesses,
                            resistances,
                            retreat_cost AS "retreatCost",
                            converted_retreat_cost AS "convertedRetreatCost",
                            set_name AS "setName",
                            set_logo AS "setLogo",
                            number,
                            artist,
                            rarity,
                            national_pokedex_numbers AS "nationalPokedexNumbers",
                            legalities,
                            images,
                            tcgplayer,
                            prices
                     FROM cards`;
        let whereExpressions = []; //array to hold the parts of the WHERE constraints
        let queryValues = []; //array to hold the values used to replace

        const { name, minPrice, maxPrice, rarity, types, setName } = searchFilters;

        //name, minPrice, maxPrice, rarity, types, setName are all the possible saerch terms.
        //for each search query, create and push into where expressions the SQL syntax.
        if (name) { //name query
            queryValues.push(`% ${name}% `);
            whereExpressions.push(`name ILIKE $${queryValues.length} `);
        }
        if (minPrice !== undefined) {//minimum price query
            queryValues.push(minPrice);
            whereExpressions.push(`price >= $${queryValues.length} `);
        };
        if (maxPrice !== undefined) {//maximum price query
            queryValues.push(maxPrice);
            whereExpressions.push(`price <= $${queryValues.length} `);
        };
        if (rarity !== undefined) {//rarity query
            queryValues.push(rarity);
            whereExpressions.push(`rarity = $${queryValues.length} `);
        };
        if (types !== undefined) {//types query, searches through array in SQL
            let sqlTypes = `{ "${types}" } `
            queryValues.push(sqlTypes);
            whereExpressions.push(`types @> $${queryValues.length} `);
        };
        if (setName !== undefined) {//set name query
            queryValues.push(setName);
            whereExpressions.push(`setName = $${queryValues.length} `);
        };

        //Create Where statement by combining all search queries from above
        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ")
        }

        //finalize query by adding ORDER BY name by default
        query += " ORDER BY name";

        const cardResponse = await db.query(query, queryValues);

        const cards = cardResponse.rows.map(card => {
            const { id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices } = card;
            return new Cards(id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices);
        });

        return cards;
    };

    /*Get All Information on a Single Card 
        query variable holds the base SQL query.
        returns all information about card
    */
    static async getCardInfo(cardId) {
        let query = await db.query(`SELECT id,
                                           name,
                                           supertype,
                                           subtypes,
                                           hp,
                                           types,
                                           evolves_to AS "evolvesTo",
                                           rules,
                                           attacks,
                                           weaknesses,
                                           resistances,
                                           retreat_cost AS "retreatCost",
                                           converted_retreat_cost AS "convertedRetreatCost",
                                           set_name AS "setName",
                                           set_logo AS "setLogo",
                                           number,
                                           artist,
                                           rarity,
                                           national_pokedex_numbers AS "nationalPokedexNumbers",
                                           legalities,
                                           images,
                                           tcgplayer,
                                           prices
                                   FROM cards
                                   WHERE id = $1`, [cardId]);
        if (!query) throw new NotFoundError(`No card with ID: ${cardId} `);

        const { id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, resistances, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices } = query.rows[0];
        return new Card(id, name, supertype, subtypes, hp, types, evolvesTo, rules, attacks, weaknesses, resistances, retreatCost, convertedRetreatCost, setName, setLogo, number, artist, rarity, nationalPokedexNumbers, legalities, images, tcgplayer, prices);
    };

    /*Delete a card in the card table.
    make a delete query where id = cardId
    if query is null, throw NotFoundError
    return card ID
    */
    async delete() {
        const result = await db.query(`DELETE
                                       FROM cards
                                       WHERE id = $1
                                       RETURNING id`, [this.id]);

        const card = result.rows[0];

        return card;
    }

    // /*
    // Card Pack Open Method

    // */
    // static async openCardPack(setName) {
    //     //get all cards for the specific set
    //     let query = await db.query(`SELECT * FROM cards WHERE set_name = $1`, [setName]);
    //     let cardSet = query.rows;

    //     return cardSet;
    // };



}

module.exports = { Cards };