import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon } from "react-bootstrap"; //Button
import { ToolbarHeader, ToolbarButton } from "../styles/Misc.js";
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import ExploreIcon from '@material-ui/icons/Explore';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { deepPurple } from '@material-ui/core/colors';
import styled from 'styled-components';

import { ToolbarButtonLink } from './MuiRouteLink.js';
import { Logo, CurrentTrip } from "../styles/Pages.js"

const buttonStyle = {fontSize: 12, marginRight: 10}
const ColorButton = withStyles(theme => ({
  root: {
  	fontSize: 12,
  	marginRight: 10,
    color: theme.palette.getContrastText(deepPurple[700]),
    backgroundColor: deepPurple[700],
    '&:hover': {
      backgroundColor: deepPurple[800],
      color: deepPurple[600]
    },
  },
}))(Button);


export default function Toolbar(tripId, tripName) {
	return(
	<ToolbarHeader>
		<CurrentTrip>{tripName} :</CurrentTrip>
		<ToolbarButtonLink to={"/trip/" + tripId} primary="Trip Home" icon={<HomeIcon />}/>
		<ToolbarButtonLink to={"/days/" + tripId} primary="Days" icon={<TodayIcon />}/>
		<ToolbarButtonLink to={"/places/" + tripId} primary="Places" icon={<ExploreIcon />}/>
		<ToolbarButtonLink to={"/plan/" + tripId} primary="Planner" icon={<ViewDayIcon />}/>
	</ToolbarHeader>
	);
}

// export function oldMUToolbar(tripId) {
// 	return(
// 	<ToolbarHeader>
// 		<Button variant="contained" style={buttonStyle}
// 		color="primary" href={"/trip/" + tripId}>
// 	        <HomeIcon />&nbsp;&nbsp; Trip Home
// 	    </Button>

// 	    <Button variant="contained" style={buttonStyle}
// 	    color="primary" href={"/days/" + tripId}>
// 	        <TodayIcon />&nbsp;&nbsp; Days
// 	    </Button>

	    

// 	    <Button variant="contained" style={buttonStyle}
// 	    color="primary" href={"/places/" + tripId}>
// 	        <ExploreIcon />&nbsp;&nbsp; Places
// 	    </Button>

// 	    <ColorButton variant="contained" 
// 	    color="primary"
// 	    href={"/plan/" + tripId}>
// 	        <ViewDayIcon />&nbsp;&nbsp; Planner
// 	    </ColorButton>
//     </ToolbarHeader>
// 	)
// }

export function oldToolbar(tripId) {
	return (
	<ToolbarHeader>
	      <ToolbarButton>
	      <LinkContainer key="go_to_trip_home" to={"/trip/" + tripId}>
	        <Button>{<Glyphicon glyph="home" />}  Trip Home</Button>
	      </LinkContainer>
	      </ToolbarButton>

	      <ToolbarButton>
	      <LinkContainer key="go_to_days" to={"/days/" + tripId}>
	        <Button>{<Glyphicon glyph="calendar" />}  Days</Button>
	      </LinkContainer>
	      </ToolbarButton>

	      <ToolbarButton>
	      <LinkContainer key="go_to_places" to={"/places/" + tripId}>
	        <Button>{<Glyphicon glyph="map-marker" />}  Places</Button>
	      </LinkContainer>
	      </ToolbarButton>

	      <ToolbarButton>
	      <LinkContainer key="go_to_planner" to={"/plan/" + tripId}>
	      	<Button>{<Glyphicon glyph="tasks" />}  Planner</Button>
	      </LinkContainer>
	      </ToolbarButton>
	</ToolbarHeader>
	)
}