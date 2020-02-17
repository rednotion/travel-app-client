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

export default function Days(props) {
	const tripId = props.match.params.tripId;
	const [allDays, setAllDays] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [whatInfo, setWhatInfo] = useState("__home__");
	const [letEdit, setLetEdit] = useState(false);
	const [fields, handleFieldChange] = useFormFields({
	    colName: "",
	    colIds: "",
	    colLodging: "",
  	});

	// On load, load trips 
	useEffect(() => {
        function loadTrip() { return API.get("travel", `/trips/${props.match.params.tripId}`); }

        function loadCol(colId) { return API.get("travel", `/cols/${colId}`); }

        async function onLoad() {
            // load trip API if you need to set the columns
            try {
                    const infoOnTrip = await loadTrip();
                    const nCols = infoOnTrip.colIds.length
                    var dayOutput = {}
                    var response
                    for (var i = 0; i < nCols; i++) {
                        console.log("calling column=", infoOnTrip.colIds[i])
                        response = await loadCol(infoOnTrip.colIds[i]);
                        dayOutput[response.colId] = response
                    }
                    // props.setCurrentTripId(props.match.params.tripId)
                    // props.setCurrentTripColumns(infoOnTrip.colIds)
                    setAllDays(dayOutput);
                } catch (e) {
                    alert(e);
            }
            setIsLoading(false)
        }
        onLoad();
    }, []);


    function onEditFormSubmit() {}
    function validateForm() {}

    function loadEditForm() {
    	return (
    		<div>
    		<h2>{allDays[whatInfo].colName}</h2>
    		<form onSubmit={onEditFormSubmit}>
    		{formField("Title*", "placeName", fields.colName, "content", handleFieldChange)}
    		{formField("Location*", "placeLocation", fields.colLocation, "content", handleFieldChange)}
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
    
    function loadFrame() {
    	// home first
    	if (whatInfo === "__home__") {
    		return (<div>Select a day to view or edit details.</div>);
    	}

    	// otherwise, one of the existing items
    	if (!letEdit) {
    		return loadDetails()
    	} else {
    		return loadEditForm()
    	}
    }

    function handleLinkClick(colId) {
    	setWhatInfo(colId); // change which frame to show
    	setLetEdit(false); // default to info page
    }

    function placeLink(colId, title) {
    	// <ListGroupItem key={placeId} onClick={() => loadDetails(placeId)}>
	    return(
	        <ListGroupItem key={colId} onClick={() => handleLinkClick(colId)}>
	            <b><Glyphicon glyph="screenshot"/></b>&nbsp;&nbsp;{title}
	        </ListGroupItem>
	    );
    }

    function renderDayLinks(allDays) {
        console.log(allDays)
        if (allDays) {
          const dayLinks = Object.keys(allDays).map(colKey => (placeLink(allDays[colKey].colId, allDays[colKey].colName)))
          return(
            <div>
            	<span className="left"><PanelTitle>Your Days</PanelTitle></span>
	            {dayLinks}
            </div>
          );
        }
        return("No days yet. Add one! >>")
      }

    function addPlace() {}

    function loadDetails() {
        var dayActivities = allDays[whatInfo].taskIds
        dayActivities = dayActivities.filter(taskId => taskId.startsWith("place"))

        return (
            <div>
            <h2>{allDays[whatInfo].colName}</h2>
            <Button onClick={() => setLetEdit(true)}>{<Glyphicon glyph="edit"/>} Edit</Button>
            <p></p>
            {dayActivities.length > 0 ? (
                <div>
                Current activities:<br></br>
                <ol>
                    {dayActivities.map(taskId => <li>{taskId}</li>)}
                </ol>
                </div>
                ) : (
                <div>
                No activities yet. Plan one!
                </div>
            )} 
            
            </div>
        );
    }


	return (
		<div>
		{Toolbar(tripId)}

		<BackgroundPanel>
		<AlignPanels>

		<InvisiblePanel>
		{loadFrame()}
		</InvisiblePanel>

		<InvisiblePanel>
		{!isLoading && renderDayLinks(allDays)}
		</InvisiblePanel>

		</AlignPanels>
		</BackgroundPanel>

		</div>
	)

}