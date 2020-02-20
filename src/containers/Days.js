import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button, ButtonToolbar,
	ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { LacquerH3 } from "../styles/Text.js";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
	InvisiblePanelFixed } from "../styles/Pages.js";
import Toolbar from "../components/Toolbar.js";

import "../styles/HoverStyles.css"

export default function Days(props) {
	const tripId = props.match.params.tripId;
	const [allDays, setAllDays] = useState({});
	const [pageIsLoading, setPageIsLoading] = useState(true);
	const [whatInfo, setWhatInfo] = useState("__home__");

	// On load, load trips 
	// useEffect(() => {
 //        function loadTrip() { return API.get("travel", `/trips/${props.match.params.tripId}`); }
 //        function loadAllCols() { return API.get("travel", `/cols/${props.match.params.tripId}`); }

 //        async function onLoad() {
 //            // load trip API if you need to set the columns
 //            try {
 //                    // set column order
 //                    const infoOnTrip = await loadTrip();
 //                    props.setTripInfo(infoOnTrip)
                    
 //                    const dayOutput = await loadAllCols();
 //                    var dayOutputReformat = {}
 //                    for (var i=0; i < dayOutput.length; i++) {
 //                        dayOutputReformat[dayOutput[i].colId] = dayOutput[i]
 //                    }
 //                    setAllDays(dayOutputReformat);
 //                } catch (e) {
 //                    alert(e);
 //            }
 //            setIsLoading(false)
 //        }
 //        onLoad();
 //    }, []);

    function loadTrip() { return API.get("travel", `/trips/${props.match.params.tripId}`); }
    function loadCols() { return API.get("travel", `/cols/${props.match.params.tripId}`); }
    function loadTasks() { return API.get("travel", `/tasks/${props.match.params.tripId}`); }

    function handleLinkClick(colId) {
    	setWhatInfo(colId); // change which frame to show
    }

    function placeLink(colId, title) {
    	// <ListGroupItem key={placeId} onClick={() => loadDetails(placeId)}>
	    return(
	        <ListGroupItem key={colId} onClick={() => handleLinkClick(colId)}>
	            <b><Glyphicon glyph="screenshot"/></b>&nbsp;&nbsp;{title}
	        </ListGroupItem>
	    );
    }

    async function checkInfo() {
        console.log("in checkInfo")
        var response
        // check trips first
        if (props.tripInfo === null) {
            try {
                response = await loadTrip();
                props.setTripInfo(response)
            } catch (e) { alert(e); }
        }

        // check days 
        if (props.colInfo === null) {
            try {
                response = await loadCols();
                var dayOutputReformat = {}
                for (var i=0; i < response.length; i++) {
                    dayOutputReformat[response[i].colId] = response[i]
                }
                props.setColInfo(dayOutputReformat);
            } catch (e) { alert(e);}
        }

        // check taskInfo 
        if (props.taskInfo === null) {
            try {
                response = await loadTasks();
                var taskOutputReformat = {}
                for (var i=0; i < response.length; i++) {
                    taskOutputReformat[response[i].taskId] = response[i]
                }
                props.setTaskInfo(taskOutputReformat);
            } catch (e) { alert(e);}
        }
    }

    function renderDayLinks() {
        checkInfo();
        console.log(props.colInfo)
        const dayLinks = props.tripInfo.colIds.map(colKey => (placeLink(props.colInfo[colKey].colId, props.colInfo[colKey].colName)))
        return(
            <div>
            	<span className="left"><PanelTitle>Your Days</PanelTitle></span>
	            {dayLinks}
            </div>
          );
    }

    function loadDetails() {
        var dayActivities = props.colInfo[whatInfo].taskIds
        dayActivities = dayActivities.filter(taskId => taskId.startsWith("place"))

        return (
            <div>
            <LacquerH3>{props.colInfo[whatInfo].colName}</LacquerH3>
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

    function loadFrame() {
        if (whatInfo === "__home__") {
            return (<div>Select a day to view or edit details.</div>);
        } else {
            return loadDetails()
        }
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
        {renderDayLinks()}
		</InvisiblePanel>

		</AlignPanels>
		</BackgroundPanel>

		</div>
	)

}