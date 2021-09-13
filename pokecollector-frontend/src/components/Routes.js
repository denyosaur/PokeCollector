import React from "react";
import { Route, Switch } from "react-router-dom";

import Homepage from "./navigation/Homepage";
import Store from "./store/Store";
import UserProfile from "./users/UserProfile";
import MyCards from "./users/MyCards";

// import ProtectedRoute from "./ProtectedRoute"

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/"><Homepage /></Route>
            <Route exact path="/store"><Store /></Route>
            <Route exact path="/profile"><UserProfile /></Route>
            <Route exact path="/mycards"><MyCards /></Route>
        </Switch>
    )
};

export default Routes;