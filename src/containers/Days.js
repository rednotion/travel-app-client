import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button, ButtonToolbar,
	ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import { formField } from "../components/Forms.js"
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
	InvisiblePanelFixed } from "../styles/Pages.js";
import Toolbar from "../components/Toolbar.js";

import "../styles/HoverStyles.css"


import { info as data_info } from "../data/data_trips.js"


export default function Days(props) {
	const tripId = props.match.params.id
	const [allDays, setAllDays] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [whatInfo, setWhatInfo] = useState("__home__")
	const [letEdit, setLetEdit] = useState(false)
	const [fields, handleFieldChange] = useFormFields({
	    placeName: "",
	    placeLocation: "",
	    tripEnd: "",
	    tripLocation: ""
  	});

	// On load, load trips 
	useEffect(() => {
        async function onLoad() {
              try {
                  const userDays = await loadAllDays();
                  setAllDays(userDays);
              } catch (e) {
                  alert(e);
              }
              setIsLoading(false)
          }
          onLoad();
    }, []);

    function loadAllDays() {
        return data_info.columns
        /*return API.get("notes", "/notes");*/
    }

    function loadDetails() {
        var dayActivities = allDays[whatInfo].taskIds
        dayActivities = dayActivities.filter(taskId => taskId.startsWith("place"))

    	return (
    		<div>
    		<h2>{allDays[whatInfo].description}</h2>
    		<Button onClick={() => setLetEdit(true)}>{<Glyphicon glyph="edit"/>} Edit</Button>
    		<p></p>
    		Current activities:<br></br>
    		<ol>
    			{dayActivities.map(place => <li>{data_info.items[place].description}</li>)}
    		</ol>
    		</div>
    	);
    }

    function loadEditForm() {
    	return (
    		<div>
    		<h2>{allDays[whatInfo].description}</h2>
    		<form onSubmit={onEditFormSubmit}>
    		{formField("Title*", "placeName", fields.placeName, "content", handleFieldChange)}
    		{formField("Location*", "placeLocation", fields.placeLocation, "content", handleFieldChange)}
    		<LoaderButton
	          block
	          type="submit"
	          bsSize="large"
	          bsStyle="primary"
	          isLoading={isLoading}
	          disabled={!validateForm()}
	        >
	        Save
	        </LoaderButton>
    		</form>
    		</div>
    	)
    }
    function onEditFormSubmit() {}
    function validateForm() {}

    function loadFrame() {
    	// home first
    	if (whatInfo === "__home__") {
    		return (<div>Select a piece to view or edit details.</div>);
    	}

    	// otherwise, one of the existing items
    	if (!letEdit) {
    		return loadDetails()
    	} else {
    		return loadEditForm()
    	}
    }

    function handleLinkClick(placeId) {
    	setWhatInfo(placeId); // change which frame to show
    	setLetEdit(false); // default to info page
    }

    function placeLink(placeId, title) {
    	// <ListGroupItem key={placeId} onClick={() => loadDetails(placeId)}>
	    return(
	        <ListGroupItem key={placeId} onClick={() => handleLinkClick(placeId)}>
	            <b><Glyphicon glyph="screenshot"/></b>&nbsp;&nbsp;{title}
	        </ListGroupItem>
	    );
    }

    function renderDayLinks(allDays) {
        if (allDays) {
          const dayLinks = Object.keys(allDays).filter(key => !key.includes("wishlist")).map(
          	key => (placeLink(allDays[key].id, allDays[key].description)))
          return(
            <div>
            	<span class="left"><PanelTitle>Your Days</PanelTitle></span>
	            {dayLinks}
            </div>
          );
        }
        return("No days yet. Add one! >>")
      }

    function addPlace() {}


	return (
		<div>
		{Toolbar(tripId)}

		<BackgroundPanel>
		<AlignPanels>

		<InvisiblePanel>
		{loadFrame()}
		</InvisiblePanel>

		<InvisiblePanel>
		{renderDayLinks(allDays)}
		</InvisiblePanel>

		</AlignPanels>
		</BackgroundPanel>

		</div>
	)

}