import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import PopUp from "./PopUp";
import MyCart from "../cart/MyCart";
import CartContext from "../../context/CartContext";

import "../../css/navbar.css"

//Navbar using React Bootstrap
const NavbarComponent = ({ authed, setAuthed }) => {
    const [openLogin, setOpenLogin] = useState("X");
    const [cartOpen, setCartOpen] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("username") || false);
    const Cart = useRef(useContext(CartContext));

    const handleFormOpen = (formType) => {
        const text = (typeof (formType.target) !== "undefined") ? formType.target.innerText : "not open";
        setOpenLogin(text);
    }

    const cartOpenHandler = () => {
        setCartOpen(!cartOpen);
    }

    useEffect(() => {
        setUsername(localStorage.getItem("username") || false); //fetch the updated username

        const cart = JSON.parse(localStorage.getItem("cart")) //fetch the cart from localStorage and parse to object

        //with cart from localStorage, update cart when Navbar is first laoded
        if (cart) {
            for (let card in cart) {
                const toAdd = {
                    id: card,
                    name: cart[card].name,
                    images: cart[card].image,
                    prices: cart[card].price,
                    setName: cart[card].setName,
                    rarity: cart[card].rarity
                };

                Cart.current.addToCart(toAdd)
            };
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed]) //when authed is updated with token from logging in, refresh this component

    const logout = () => {
        setAuthed(false); //set authed to false
        localStorage.removeItem("username"); //remove username in localStorage
        localStorage.removeItem("token"); //remove token in localStorage
    };

    return (
        <div className="Navbar">
            <Navbar className="Navbar-section" expand="lg" collapseOnSelect >
                <Container className="Navbar-container">
                    <Navbar.Brand href="/" className="Navbar-brand">PokeCollector</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="Navbar-navigation">
                            <Nav.Link to="/store" className="Navbar-public" as={Link}>Shop Cards</Nav.Link>
                            {authed && <>
                                <Nav.Link to="/mycards" as={Link}>My Cards</Nav.Link>
                                <Nav.Link to="/mytrades" as={Link}>My Trades</Nav.Link>
                                <Nav.Link to="/mydecks" as={Link}>My Decks</Nav.Link>
                            </>}
                        </Nav>
                        <Nav className="Navbar-auth ms-auto">
                            {authed
                                ? <>
                                    <Nav.Link onClick={cartOpenHandler}><i className="bi bi-cart2"></i>Cart</Nav.Link>
                                    <Nav.Link to="profile" as={Link}>{username}</Nav.Link>
                                    <Nav.Link onClick={logout}>Log Out</Nav.Link>
                                </>
                                : <>
                                    <Nav.Link onClick={cartOpenHandler}><i className="bi bi-cart2"></i>Cart</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} >Login</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} >Sign Up</Nav.Link>
                                </>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <PopUp handleFormOpen={handleFormOpen} openLogin={openLogin} setOpenLogin={setOpenLogin} setAuthed={setAuthed} />
            {cartOpen && <MyCart setCartOpen={setCartOpen} authed={authed} />}
        </div >
    )
};

export default NavbarComponent;