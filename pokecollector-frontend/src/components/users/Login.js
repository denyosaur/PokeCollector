import React, { Link } from "react";

// import handleFormSubmit from "../../hooks/handleFormSubmit";
import useFields from "../../hooks/useFields";

import "../../css/login.css"

const Login = ({ setAuthed, handleFormOpen }) => {
    const [formData, handleChange] = useFields({
        username: "",
        password: ""
    });

    return (
        <div className="Login">
            <h3 className="Login-header">Login</h3>
            <button onClick={handleFormOpen} className="Login-formClose">X</button>
            <p className="Login-agreement">By continuing, you agree to our User Agreement and Privacy Policy.</p>
            <form onSubmit={console.log("submitted")} className="Login-form">
                <label htmlFor="username"></label>
                <input type="text" placeholder="Username" name="username" id="username" onChange={handleChange}></input>

                <label htmlFor="password"></label>
                <input type="password" placeholder="Password" name="password" id="password" onChange={handleChange}></input>
                <button className="Login-button">Submit</button>
                <div className="Login-register">
                    <p>New to Pokecollector? <a className="Login-signup" onClick={handleFormOpen}>Sign Up</a></p>
                </div>
            </form>
        </div>
    )
};

export default Login;