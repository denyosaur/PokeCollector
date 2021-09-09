import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import NavbarComp from "./components/navigation/Navbar";
import Routes from "./components/Routes"


import './App.css';

function App() {
  const [authed, setAuthed] = useState(false);


  return (
    <div className="App">

      <BrowserRouter>
        <NavbarComp authed={authed} setAuthed={setAuthed} />
        <div className="App-container">
          <Routes setAuthed={setAuthed} />
        </div>
      </BrowserRouter>

    </div>
  )
};

export default App;
