import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute.js";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home.js";
import NotFound from "./containers/NotFound.js";

import Login from "./containers/Login.js";
import Signup from "./containers/Signup.js";

import Trip from "./containers/Trip.js";
import MyTrips from "./containers/MyTrips.js";

import Planner from "./containers/Planner.js";

export default function Routes({ appProps }) {
  return (
    <Switch>
      { /* Use exact otherwise it'll match any route starting w '/' 
       Note that we are using AppliedRoute rather than the standard Route */ }
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      { /* If you are logged in, these routes should go back to home */}
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
      { /* If you are logged OUT, these routes should go to LOGIN */}
      <AuthenticatedRoute path="/trips" exact component={MyTrips} appProps={appProps} />
      <AuthenticatedRoute path="/trip/:id" exact component={Trip} appProps={appProps} />
      <AuthenticatedRoute path="/plan/:id" exact component={Planner} appProps={appProps} />
      { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
}