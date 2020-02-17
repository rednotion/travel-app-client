import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes.js";
import { LinkContainer } from "react-router-bootstrap";
// link containers is how we'll get router to work w bootstrap
import { Auth } from "aws-amplify";
import { useFormFields } from "./libs/hooksLib";

{ /* The <> or Fragment component can be thought of as a placeholder component. 
We need this because in the case the user is not logged in, we want to render two links. 
To do this we would need to wrap it inside a single component, like a div. 
But by using the Fragment component it tells React that the two links are inside 
this component but we don’t want to render any extra HTML. */ }

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [currentTripColumns, setCurrentTripColumns] = useState(null)

  useEffect(() => {onLoad();}, []);
  { /* useEffect has 2 arguments: Function; Array of variables 
  Function will be called everytime a component is rendered
  Array of variables say, rerun ONLY IF variables have changed*/}
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    props.history.push("/login");
  }


  return (
    !isAuthenticating &&
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">TakeMeTo</Link> 
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {isAuthenticated
              ? <>
                  <LinkContainer to="/trips">
                    <NavItem>My Trips</NavItem>
                  </LinkContainer>
                  <NavItem onClick={handleLogout}>Logout</NavItem>
                </>
              : <>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes appProps={{ isAuthenticated, userHasAuthenticated, currentTripId, setCurrentTripId, currentTripColumns, setCurrentTripColumns }} />
    </div>
  );
}

export default withRouter(App);
