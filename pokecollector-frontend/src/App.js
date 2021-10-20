import { BrowserRouter } from "react-router-dom";
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarComp from "./components/navigation/Navbar";
import Routes from "./components/Routes";

import CartGlobal from "./context/CartGlobal";

import Background from './images/background.jpg';

import './App.css';

function App() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(localStorage.getItem("token") || false); //fetch the token from localStorage, set to false if not available


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="App">

      <CartGlobal>
        <BrowserRouter>
          <NavbarComp authed={authed} setAuthed={setAuthed} />
          <div className="App-background" style={{ backgroundImage: `url(${Background})` }}></div>
          <div className="App-container">
            <Routes />
          </div>
        </BrowserRouter>
      </CartGlobal>
    </div>
  )
};

export default App;
