import React, { useState, useContext, useEffect } from "react";

import StoreApi from "../../api/store-api";

import CartContext from "../../context/CartContext";
import CartItem from "./CartItem";
import NotificationCard from "../navigation/NotificationCard";

import "../../css/cart/mycart.css";

const MyCart = ({ setCartOpen, authed }) => {
    let currUsername = localStorage.getItem("username") || false;

    const INITIAL_VALUE = { price: 0, quantity: 0 }
    const notification = {
        message: ["Login to purchase!"],
        status: "fail"
    }
    const { purchase, removeFunds } = StoreApi;
    const { cart } = useContext(CartContext);
    const [totals, setTotals] = useState(INITIAL_VALUE)

    useEffect(() => {
        let newTotals = {
            price: 0,
            quantity: 0
        }
        for (let id in cart) {
            newTotals.quantity += cart[id].quantity;
            newTotals.price += (cart[id].price * cart[id].quantity);
        }
        setTotals(newTotals);
    }, [cart])

    const closeCart = () => { setCartOpen(false); }; //handler for closing cart window

    /*handler for checking out
    API request to:
        1. remove cost of cards
        2. add cards to user's inventory
    then remove "cart" from localStorage and restore the cart totals
    */
    const checkout = () => {
        let cost = { "funds": totals.price };
        async function makePurchase() {
            await removeFunds(currUsername, cost, authed);
            await purchase(currUsername, cart, authed);
            localStorage.removeItem("cart");
            setTotals(INITIAL_VALUE);
        }
        makePurchase();
    };

    //array of cards in cart
    const cartItems = Object.keys(cart).map(id => { return <CartItem id={id} key={id} /> });

    return (
        <>
            <div className="MyCart">
                <div className="MyCart-header">
                    <div className="MyCart-title">My Cart</div>
                    <div className="MyCart-close"><i className="bi bi-x-lg Login-formClose" onClick={closeCart} ></i></div>
                </div>
                <div className="MyCart-items">
                    {cartItems}
                </div>
                <div className="MyCart-Checkout">
                    <div className="MyCart-total">
                        <span>Total: ${totals.price}</span>
                    </div>
                    {authed
                        ? <button className="MyCart-Checkout-button" onClick={checkout}>Checkout[{totals.quantity}]</button>
                        : <NotificationCard notification={notification} />}
                </div>
            </div>
            <div className="MyCart-background" onClick={closeCart}></div>
        </>
    )
}

export default MyCart;