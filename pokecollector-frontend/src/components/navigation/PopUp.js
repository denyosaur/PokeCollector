import React, { Component } from "react";

import Login from "../users/Login";
import Register from "../users/Register";

import "../../css/loginregpopup.css"

class PopUp extends Component {
    render() {
        const { openLogin, handleFormOpen, setAuthed } = this.props;

        return (
            <>
                {(openLogin === "Login" || openLogin === "Sign Up") &&
                    <>
                        <div className="Popup-background"></div>
                        <div className="Popup">
                            <div className="Popup-formContainer">
                                {(openLogin === "Login") && <Login handleFormOpen={handleFormOpen} setAuthed={setAuthed} />}
                                {(openLogin === "Sign Up") && <Register handleFormOpen={handleFormOpen} setAuthed={setAuthed} />}
                            </div>
                        </div>
                    </>}
            </>
        )
    }
}

export default PopUp;