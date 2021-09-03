import React from "react";
import { Route, Switch } from "react-router-dom";

import Homepage from "./navigation/Homepage";
import Store from "./store/Store";

// import ProtectedRoute from "./ProtectedRoute"

const Routes = ({ }) => {
    return (
        <Switch>
            <Route exact path="/"><Homepage /></Route>
            <Route exact path="/store"><Store /></Route>
        </Switch>
    )
};

export default Routes;