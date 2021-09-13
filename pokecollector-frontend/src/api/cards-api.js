import request from "./api-request-helper";

class CardsApi {
    /******************NO RESTRICTION************************************/

    /*method for getting all cards or searching cards with queries
    available for data {query: {
                            name, 
                            minPrice, 
                            maxPrice, 
                            rarity, 
                            types, 
                            setName
                        }}
    returns [{card},...] 
    */
    static async getCards(data = {}) {
        const res = await request("cards/", "", "GET", data);

        return res;
    }

    /*method for getting info on a specific card by ID
    returns card object {card} with information
    */
    static async getCardInfo(cardId) {
        const res = await request(`cards/${cardId}`);

        return res;
    }

    /******************LOGGED IN************************************/

    /*method for getting info on a specific card by ID
    returns cards object { cards: [{ownedId, username, cardId, cardInfo},...] }
    */
    static async getOwnedCards(username, token) {
        const res = await request(`cards/user/${username}`, token);

        return res;
    }

    /******************ADMIN ONLY************************************/

    /*method for pulling card data from external API And uploading to pokecollector db
    returns newCards object {newCards:[{card},...]}
    */
    static async createCardsBySet(setId) {
        const res = await request(`cards/pullCards/${setId}`, "POST");

        return res;
    }

    /*method for deleting a card by id
    returns newCards object {newCards:[{card},...]}
    */
    static async deleteCard(cardId) {
        const res = await request(`cards/delete/${cardId}`, "DELETE");

        return res;
    }
};


export default CardsApi;