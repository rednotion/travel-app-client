import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, NavItem, Nav } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes.js";
import { LinkContainer } from "react-router-bootstrap";
// link containers is how we'll get router to work w bootstrap
import { Auth, API } from "aws-amplify";
import { useFormFields } from "./libs/hooksLib";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { BelowAppBar } from "./styles/Pages.js"

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';

{ /* The <> or Fragment component can be thought of as a placeholder component. 
We need this because in the case the user is not logged in, we want to render two links. 
To do this we would need to wrap it inside a single component, like a div. 
But by using the Fragment component it tells React that the two links are inside 
this component but we don’t want to render any extra HTML. */ }

function App(props) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTripId, setCurrentTripId] = useState(null);
  const [tripInfo, setTripInfo] = useState(null);
  const [colInfo, setColInfo] = useState(null);
  const [taskInfo, setTaskInfo] = useState(null);

  useEffect(() => {onLoad();}, []);
  { /* useEffect has 2 arguments: Function; Array of variables 
  Function will be called everytime a component is rendered
  Array of variables say, rerun ONLY IF variables have changed*/}

  async function onLoad() {
    // first, check for user
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

    // then check for trip
    const tripId = deduceLocation()

    if (tripId) {
      var response
      if ((tripId !== currentTripId) | (tripInfo === null) | 
        (colInfo === null) | (taskInfo === null)) {
        try {
          setCurrentTripId(tripId);
          response = await loadTrip(tripId)
          setTripInfo(response)
          console.log("trip response")
          console.log(response)

          response = await loadAllColumns(tripId)
          setColInfo(refactorResponse(response, 'colId'))
          console.log("col response")
          console.log(response)

          response = await loadAllTasks(tripId)
          setTaskInfo(refactorResponse(response, 'taskId'))
          console.log("task response")
          console.log(response)

        } catch(e) {
          alert(e);
        }
      } 
    }

    setIsLoading(false);
  }

  function deduceLocation () {
    const pathItems = (props.location.pathname).split("/")
    if (pathItems.length > 2) {
      return pathItems[2]
    } else {
      return null
    }
  }

  function loadTrip(tripId) { return API.get("travel", `/trips/${tripId}`); }
  function loadAllColumns(tripId) { return API.get("travel", `/cols/${tripId}`); }
  function loadAllTasks(tripId) { return API.get("travel", `/tasks/${tripId}`); }
  function refactorResponse(response, key) {
    var refactoredResponse = {}
    for (var i=0; i < response.length; i++) {
      refactoredResponse[response[i][key]] = response[i]
    }
    return refactoredResponse
  }

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    props.history.push("/login");
  }

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontSize: 15,
    },
    buttonText: {
      fontSize: 12
    }
  }));

  const classes = useStyles()

  return (
    (!isAuthenticating & !isLoading)&&
    <div className="App container">
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          TakeMeTo
        </Typography>
         {isAuthenticated 
          ? <>
            <Button color="inherit" className={classes.buttonText} href="/trips"><AirplanemodeActiveIcon/>&nbsp;&nbsp;My Trips</Button>
            <Button color="inherit" className={classes.buttonText} onClick={handleLogout}>Logout</Button>
            </>
          : <>
            <Button color="inherit" className={classes.buttonText} href="/signup">Signup</Button>
            <Button color="inherit" className={classes.buttonText} href="/login">Login</Button>
            </>
         }
      </Toolbar>
    </AppBar>
    <BelowAppBar>
    <Routes appProps={{ isAuthenticated, userHasAuthenticated, currentTripId, setCurrentTripId, tripInfo, setTripInfo, 
        taskInfo, setTaskInfo, colInfo, setColInfo  }} />
    </BelowAppBar>
    </div>
  );
}

export default withRouter(App);
