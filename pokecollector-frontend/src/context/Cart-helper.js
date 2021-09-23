export const ADD_CARD = "ADD_PRODUCT";
export const REMOVE_CARD = "REMOVE_PRODUCT";

// {"abc": {
//     quantity:1,
//     image:"www.hgoohle.com",
//     price:"1.5"
// }}

const addToCart = (card, state) => {
    if (!card.id) return
    const updatedCart = { ...state.cart };
    const cardsInCart = Object.keys(state.cart);
    if (cardsInCart.includes(card.id)) {
        let updatedCard = { ...updatedCart[card.id] };
        updatedCard.quantity++;
        updatedCart[card.id] = updatedCard;
    } else {
        const cartInfo = {
            quantity: 1,
            name: card.name,
            image: card.images,
            price: card.prices,
            setName: card.setName,
            rarity: card.rarity
        };
        updatedCart[card.id] = cartInfo;
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
}

const removeFromCart = (card, state) => {
    const updatedCart = { ...state.cart };
    if (updatedCart[card.id].quantity > 1) {
        let updatedCard = { ...updatedCart[card.id] };
        updatedCard.quantity--;
        updatedCart[card.id] = updatedCard;
    } else {
        delete updatedCart[card.id];
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    return { ...state, cart: updatedCart };
}

export const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_CARD:
            return addToCart(action.card, state);
        case REMOVE_CARD:
            return removeFromCart(action.card, state);
        default:
            return state;
    }
}
