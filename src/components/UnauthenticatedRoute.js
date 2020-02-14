import React from "react";
import { Route, Redirect } from "react-router-dom";

/* Finds the original URL that we were at before being redirected */
function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return "";
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export default function UnauthenticatedRoute({ component: C, appProps, ...rest }) {
  const redirect = querystring("redirect");
  return (
    <Route
      {...rest}
      render={props =>
        !appProps.isAuthenticated
          ? <C {...props} {...appProps} />
          : <Redirect
              to={redirect === "" || redirect === null ? "/" : redirect}
            />}
            /* We build the redirect url like this so we know where the user was 
            trying to go before we redirected him to LOGIN page */
    />
  );
}