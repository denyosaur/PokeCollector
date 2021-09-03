import React, { useEffect, useState } from "react";

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import Login from "../users/Login";
import Register from "../users/Register";

import "../../css/navbar.css"

const NavbarComponent = ({ authed }) => {
    let authStatus = localStorage.getItem("token") || false
    let username = localStorage.getItem("username") || false

    const [openLogin, setOpenLogin] = useState("X");

    const handleFormOpen = (evt) => {
        setOpenLogin(evt.target.innerText)
    }

    useEffect(() => {
        authStatus = authed
        username = localStorage.getItem("username")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed])

    return (
        <div className="Navbar">
            <Navbar className="Navbar-section" expand="lg" collapseOnSelect >
                <Container>
                    <Navbar.Brand href="/" className="Navbar-brand">PokeCollector</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="Navbar-navigation">
                            <Nav.Link exact to="/shop" className="Navbar-public">Shop Cards</Nav.Link>
                            {authStatus === true && <>
                                <Nav.Link exact to="/trades">My Trades</Nav.Link>
                                <Nav.Link exact to="/decks">My Decks</Nav.Link>
                            </>}
                        </Nav>
                        <Nav className="Navbar-auth">
                            {authStatus === true
                                ? <>
                                    <Nav.Link exact to="/profile">{username}</Nav.Link>
                                    <Nav.Link exact to="/checkout">Checkout</Nav.Link>
                                    <Nav.Link exact to="/logout">Log Out</Nav.Link>
                                </>
                                : <>
                                    <Nav.Link exact to="/checkout">Checkout</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} name="Login">Login</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} name="Sign Up">Sign Up</Nav.Link>
                                </>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {openLogin === "Login" &&
                <div className="Navbar-form">
                    <Container className="Navbar-formContainer">
                        <div className="Navbar-login">
                            <Login handleFormOpen={handleFormOpen} />
                        </div>
                    </Container>
                </div>}
            {openLogin === "Sign Up" &&
                <div className="Navbar-form">
                    <Container className="Navbar-formContainer">
                        <div className="Navbar-register">
                            <Register handleFormOpen={handleFormOpen} />
                        </div>
                    </Container>
                </div>}
        </div >
    )
};

export default NavbarComponent;