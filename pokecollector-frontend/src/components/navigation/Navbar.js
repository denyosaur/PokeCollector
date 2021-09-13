import React, { useEffect, useState } from "react";

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import PopUp from "./PopUp";

import "../../css/navbar.css"

const NavbarComponent = ({ authed, setAuthed }) => {
    // let authStatus = localStorage.getItem("token") || false;
    // let username = localStorage.getItem("username") || false;

    const [openLogin, setOpenLogin] = useState("X");
    const [authStatus, setAuthStatus] = useState(localStorage.getItem("token") || false)
    const [username, setUsername] = useState(localStorage.getItem("username") || false)

    //Navbar using React Bootstrap
    const handleFormOpen = (formType) => {
        const text = (typeof (formType.target) !== "undefined") ? formType.target.innerText : "not open";
        setOpenLogin(text);
    }

    useEffect(() => {
        setAuthStatus(localStorage.getItem("token") || false); //authed contains the token
        setUsername(localStorage.getItem("username") || false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed]) //when authed is updated with token from logging in, refresh this component

    const logout = () => {
        setAuthed("notoken");
        localStorage.clear();
    }

    return (
        <div className="Navbar">
            <Navbar className="Navbar-section" expand="lg" collapseOnSelect >
                <Container className="Navbar-container">
                    <Navbar.Brand href="/" className="Navbar-brand">PokeCollector</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="Navbar-navigation">
                            <Nav.Link href="/store" className="Navbar-public">Shop Cards</Nav.Link>
                            {authStatus && <>
                                <Nav.Link href="/mycards">My Cards</Nav.Link>
                                <Nav.Link href="/trades">My Trades</Nav.Link>
                                <Nav.Link href="/decks">My Decks</Nav.Link>
                            </>}
                        </Nav>
                        <Nav className="Navbar-auth ms-auto">
                            {authStatus
                                ? <>
                                    <Nav.Link href="/checkout"><i className="bi bi-cart2"></i>Cart</Nav.Link>
                                    <Nav.Link href="profile">{username}</Nav.Link>
                                    <Nav.Link onClick={logout}>Log Out</Nav.Link>
                                </>
                                : <>
                                    <Nav.Link href="/checkout"><i className="bi bi-cart2"></i>Cart</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} name="Login">Login</Nav.Link>
                                    <Nav.Link onClick={handleFormOpen} name="Sign Up">Sign Up</Nav.Link>
                                </>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <PopUp handleFormOpen={handleFormOpen} openLogin={openLogin} setAuthed={setAuthed} />
        </div >
    )
};

export default NavbarComponent;