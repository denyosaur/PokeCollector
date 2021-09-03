import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import ApiContext from "../apiContext"

function ProtectedRoute({ exact, path, children }) {
    const api = useContext(ApiContext);
    const username = localStorage.getItem("username") || false

    const check = async (name) => {
        const userInfo = await api.currUser(name)
        return userInfo
    }

    const loggedIn = check(username)

    if (!loggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        <Route exact={exact} path={path}>
            {children}
        </Route>
    );
}


export default ProtectedRoute;
