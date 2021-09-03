import React, { Link } from "react";

// import handleFormSubmit from "../../hooks/handleFormSubmit";
import useFields from "../../hooks/useFields";

import "../../css/register.css"

const Register = ({ setAuthed, handleFormOpen }) => {
    const [formData, handleChange] = useFields({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
    });

    return (
        <div className="Register">
            <h3 className="Register-header">Sign Up</h3>
            <button onClick={handleFormOpen} className="Register-formClose">X</button>
            <p className="Register-agreement">By continuing, you agree to our User Agreement and Privacy Policy.</p>
            <form onSubmit={console.log("submitted")} className="Register-form">

                <label htmlFor="username"></label>
                <input type="text" placeholder="Username" name="username" id="username" onChange={handleChange}></input>

                <label htmlFor="password"></label>
                <input type="password" placeholder="Password" name="password" id="password" onChange={handleChange}></input>

                <label htmlFor="firstName"></label>
                <input type="text" placeholder="First Name" name="firstName" id="firstName" onChange={handleChange}></input>

                <label htmlFor="lastName"></label>
                <input type="text" placeholder="Last Name" name="lastName" id="lastName" onChange={handleChange}></input>

                <label htmlFor="email"></label>
                <input type="email" placeholder="Email" name="email" id="email" onChange={handleChange}></input>

                <button className="Register-button">Submit</button>
                <div className="Register-register">
                    <p>Already a Pokecollector? <a className="Register-signup" onClick={handleFormOpen}>Login</a></p>
                </div>
            </form>
        </div>
    )
};

export default Register;