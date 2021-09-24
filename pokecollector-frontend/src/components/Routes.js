import React from "react";
import { Route, Switch } from "react-router-dom";

import Homepage from "./navigation/Homepage";
import Store from "./store/Store";
import MyCart from "./cart/MyCart";
import UserProfile from "./users/UserProfile";
import MyCards from "./users/MyCards";
import MyDecks from "./decks/MyDecks";
import MyTrades from "./messages/MyTrades";

import PrivateRoute from "./PrivateRoute"

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/"><Homepage /></Route>
            <Route exact path="/store"><Store /></Route>
            <Route exact path="/cart"><MyCart /></Route>
            <PrivateRoute exact path="/profile" ><UserProfile /></PrivateRoute>
            <PrivateRoute exact path="/mycards"><MyCards /></PrivateRoute>
            <PrivateRoute exact path="/mydecks"><MyDecks /></PrivateRoute>
            <PrivateRoute exact path="/mytrades"><MyTrades /></PrivateRoute>
        </Switch>
    )
};

export default Routes;