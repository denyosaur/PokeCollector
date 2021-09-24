import request from "./api-request-helper";

class DeckApi {
    /******************LOGGED IN************************************/

    /*method for getting all decks a user created
    returns deck object {decks:[{id, username, deckName}, ...]}
    */
    static async getDecks(username, token) {
        const res = await request(`decks/${username}`, token);

        return res;
    }

    /*method for deck information and all cards associated
    returns deck object {deck: {id, username, deckName}, cards: [{id, name, images, setName, setLogo},...]}
    */
    static async getDeckInfo(username, deckId) {
        const res = await request(`decks/${username}/${deckId}`);

        return res;
    }

    /*method for updating deck name
    returns deck object {newDeckName: {id, username, deckName}}
    */
    static async updateDeckName(username, deckId, data) {
        const res = await request(`decks/${username}/${deckId}`, "PATCH", data);

        return res;
    }

    /*method for updating cards in a deck
    data needs to contain {
                            remove:[id1,...], 
                            add:[id1,...]
                        }
    returns deck object {updated:{
                                    removed: {deckId, cardId}, 
                                    added:{deckId, cardId}
                                }}
    */
    static async updateCardsInDeck(username, deckId, data) {
        const res = await request(`decks/${username}/${deckId}`, "POST", data);

        return res;
    }

    /* method for deleting a deck
    returns deck object {deleted: {id, username, deckName}}
    */
    static async deleteDeck(username, deckId) {
        const res = await request(`decks/${username}/${deckId}`, "DELETE");

        return res;
    }
};

export default DeckApi;