import React, { useContext } from "react";

import CartContext from "../../context/CartContext";

import "../../css/cart/cartitem.css";

const CartItem = ({ id }) => {
    const Cart = useContext(CartContext);
    const { image, name, setName, rarity, quantity, price } = Cart.cart[id];

    const cartRemove = (evt) => {
        evt.preventDefault()
        const toRemove = {
            id: id,
            name: name,
            images: image,
            prices: price,
            setName: setName,
            rarity: rarity
        }
        Cart.removeFromCart(toRemove)
    }

    function cartAdd(evt) {
        evt.preventDefault()
        const toAdd = {
            id: id,
            name: name,
            images: image,
            prices: price,
            setName: setName,
            rarity: rarity
        }
        Cart.addToCart(toAdd)
    }

    return (
        <div className="CartItem">
            <div className="CartItem-image">
                <img src={image} alt={`${name} card`} />
            </div>
            <div className="CartItem-info">
                <div className="CartItem-setName">{setName}</div>
                <div className="CartItem-name">{name}</div>
                <div className="CartItem-rarity">{rarity}</div>
                <div className="CartItem-quantity">
                    <button className="CartItem-remove" onClick={cartRemove}><i className="bi bi-caret-left-fill"></i></button>
                    <input disabled="disabled" type="number" placeholder={quantity} name="quantity" id="quantity"></input>
                    <button className="CartItem-add" onClick={cartAdd}><i className="bi bi-caret-right-fill"></i></button>
                </div>
            </div>
            <div className="CartItem-price">
                ${price * quantity}
            </div>
        </div>
    )
}

export default CartItem;