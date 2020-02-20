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

        function loadAllCols() { return API.get("travel", `/cols/${props.match.params.tripId}`); }

        async function onLoad() {
            // load trip API if you need to set the columns
            try {
                    // set column order
                    const infoOnTrip = await loadTrip();
                    props.setTripInfo(infoOnTrip)
                    
                    const dayOutput = await loadAllCols();
                    var dayOutputReformat = {}
                    for (var i=0; i < dayOutput.length; i++) {
                        dayOutputReformat[dayOutput[i].colId] = dayOutput[i]
                    }
                    setAllDays(dayOutputReformat);
                } catch (e) {
                    alert(e);
            }
            setIsLoading(false)
        }
        onLoad();
    }, []);

    function loadFrame() {
    	// home first
    	if (whatInfo === "__home__") {
    		return (<div>Select a day to view or edit details.</div>);
    	} else {
    		return loadDetails()
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
        if (allDays) {
          const dayLinks = props.tripInfo.colIds.map(colKey => (placeLink(allDays[colKey].colId, allDays[colKey].colName)))
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
            <p></p>
            {dayActivities.length > 0 ? (
                <div>
                Current activities:<br></br>
                <ol>
                    {dayActivities.map(taskId => <li>{props.taskInfo[taskId].taskName}</li>)}
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