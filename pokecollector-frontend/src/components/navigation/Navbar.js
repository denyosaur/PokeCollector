import React, { useEffect, useState, useContext, useRef } from "react";
import { Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import PopUp from "./PopUp";
import MyCart from "../cart/MyCart";
import CartContext from "../../context/CartContext";

import "../../css/navbar.css"

const NavbarComponent = ({ authed, setAuthed }) => {
    const [openLogin, setOpenLogin] = useState("X");
    const [cartOpen, setCartOpen] = useState(false);
    const [authStatus, setAuthStatus] = useState(localStorage.getItem("token") || false);
    const [username, setUsername] = useState(localStorage.getItem("username") || false);
    const Cart = useRef(useContext(CartContext));



    //Navbar using React Bootstrap
    const handleFormOpen = (formType) => {
        const text = (typeof (formType.target) !== "undefined") ? formType.target.innerText : "not open";
        setOpenLogin(text);
    }

    //Navbar using React Bootstrap
    const cartOpenHandler = () => {
        setCartOpen(!cartOpen);
    }

    useEffect(() => {
        setAuthStatus(localStorage.getItem("token") || false); //fetch the updated token
        setUsername(localStorage.getItem("username") || false); //fetch the updated username
        // eslint-disable-next-line react-hooks/exhaustive-deps

        const cart = JSON.parse(localStorage.getItem("cart")) //fetch the updated username

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

    }, [authed]) //when authed is updated with token from logging in, refresh this component

    const logout = () => {
        setAuthed(false);
        localStorage.removeItem("username");
        localStorage.removeItem("token");
    }

    return (
        <div className="Navbar">
            <Navbar className="Navbar-section" expand="lg" collapseOnSelect >
                <Container className="Navbar-container">
                    <Navbar.Brand href="/" className="Navbar-brand">PokeCollector</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="Navbar-navigation">
                            <Nav.Link to="/store" className="Navbar-public" as={Link}>Shop Cards</Nav.Link>
                            {authStatus && <>
                                <Nav.Link to="/mycards" as={Link}>My Cards</Nav.Link>
                                <Nav.Link to="/trades" as={Link}>My Trades</Nav.Link>
                                <Nav.Link to="/decks" as={Link}>My Decks</Nav.Link>
                            </>}
                        </Nav>
                        <Nav className="Navbar-auth ms-auto">
                            {authStatus
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