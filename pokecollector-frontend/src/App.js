import { BrowserRouter } from "react-router-dom";
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarComp from "./components/navigation/Navbar";
import Routes from "./components/Routes";

import CartGlobal from "./context/CartGlobal";


import './App.css';

function App() {
  const [authed, setAuthed] = useState(false);

  return (
    <div className="App">
      <CartGlobal>
        <BrowserRouter>

          <NavbarComp authed={authed} setAuthed={setAuthed} />
          <div className="App-container">
            <Routes setAuthed={setAuthed} />
          </div>

        </BrowserRouter>
      </CartGlobal>

    </div>
  )
};

export default App;
