import React, { useReducer } from "react";

import CartContext from "./CartContext";
import { ADD_CARD, REMOVE_CARD, cartReducer } from "./Cart-helper";

const CartGlobal = ({ children }) => {
    const [cartState, dispatcher] = useReducer(cartReducer, { cart: {} });

    const addToCart = (card) => {
        dispatcher({ type: ADD_CARD, card: card })
    };

    const removeFromCart = (card) => {
        dispatcher({ type: REMOVE_CARD, card: card })
    };

    const localStorageCartUpdate = () => {

    };
    //add all useEffect here for exporting

    const value = {
        cart: cartState.cart,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        localStorageCartUpdate: localStorageCartUpdate
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export default CartGlobal;