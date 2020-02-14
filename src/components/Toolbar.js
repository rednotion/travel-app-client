import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Glyphicon, Button } from "react-bootstrap";
import { ToolbarHeader, ToolbarButton } from "../styles/Misc.js"

export default function Toolbar(tripId) {
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