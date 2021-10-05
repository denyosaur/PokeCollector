import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import UsersApi from "../../api/users-api";
import NotificationCard from "../navigation/NotificationCard";

import "../../css/userprofile.css";

const UserProfile = () => {
    const history = useHistory();

    let authorization = localStorage.getItem("token") || false;
    let currUsername = localStorage.getItem("username") || false;

    const INITIAL_VALUE = {
        firstName: "placeholder",
        lastName: "placeholder"
    };

    const [form, setForm] = useState(INITIAL_VALUE);
    const [notification, setNotification] = useState(false);

    useEffect(() => {
        async function getProfile() {
            const profileRes = await UsersApi.currUser(currUsername, authorization);
            const { firstName, lastName, email, currencyAmount, username } = profileRes.user;
            setForm({
                firstName: firstName,
                lastName: lastName,
                currencyAmount: currencyAmount,
                email: email,
                password: "",
                secondPw: "",
                currPassword: "",
                username: username
            });
        }
        getProfile();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault(); //stop page from reloading
        try {
            const updatedForm = form;
            delete updatedForm.currencyAmount;
            delete updatedForm.secondPw;

            await UsersApi.patchUserDetails(currUsername, form, authorization);

            setNotification({
                message: ["Successfully updated!"],
                status: "success"
            });

            setTimeout(() => {
                history.push("/"); //push profile to history 
            }, 1000);
        }
        catch (error) {
            const msg = {
                message: error,
                status: "error"
            }
            setNotification(msg);
        }
    };

    const newPasswordCheck = form.secondPw === form.password;

    return (
        <div className="Profile">
            <h3 className="Profile-header">User Profile Page</h3>

            {notification && <NotificationCard notification={notification} setNotification={setNotification} />}

            <form onSubmit={handleSubmit}>
                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className="Profile-col-75">
                        <input disabled="disabled" type="text" placeholder={form.username} name="username" id="username"  ></input>
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="currentFunds">Current Funds</label>
                    </div>
                    <div className="Profile-col-75">
                        <input disabled="disabled" type="text" placeholder={`$${form.currencyAmount}`} name="currentFunds" id="currentFunds"></input>
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="firstName">First Name</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="text" placeholder={form.firstName} name="firstName" id="firstName" onChange={handleChange} minLength="1" maxLength="30"></input>
                    </div>

                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="lastName">Last Name</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="text" placeholder={form.lastName} name="lastName" id="lastName" onChange={handleChange} minLength="1" maxLength="30" ></input>
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="lastName">Email</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="email" placeholder={form.email} name="email" id="email" onChange={handleChange} minLength="6" maxLength="60"></input>
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="newPassword">New Password</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="password" placeholder="Enter a new password" name="password" id="password" onChange={handleChange} minLength="5" maxLength="30"></input>
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="secondPw">Re-enter New Password</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="password" placeholder="Re-enter password from above" name="secondPw" id="secondPw" onChange={handleChange} minLength="5" maxLength="30"></input>
                        {!newPasswordCheck && <div className="Profile-newpwwarning">Password must match above.</div>}
                    </div>
                </div>

                <div className="Profile-inputgroup">
                    <div className="Profile-col-25">
                        <label htmlFor="currPassword">Current Password</label>
                    </div>
                    <div className="Profile-col-75">
                        <input type="password" placeholder="Enter current password" name="currPassword" id="currPassword" onChange={handleChange} minLength="5" maxLength="30"></input>
                    </div>
                </div>

                <button className="Profile-button">Save</button>
            </form>
        </div>
    )
}

export default UserProfile;