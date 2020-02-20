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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';


import Script from 'react-load-script';

export default function Places(props) {
	const tripId = props.match.params.tripId
  const [wishlistId, setWishlistId] = useState([])
	const [allTasksInfo, setAllTasksInfo] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [whatInfo, setWhatInfo] = useState("__home__")
	const [letEdit, setLetEdit] = useState(false)
	const [fields, handleFieldChange] = useFormFields({
	    taskDuration: "",
	    taskNotes: ""
  	});
    // for editing
    const [updateTaskDuration, setUpdateTaskDuration] = useState(0.0)
    const [updateTaskNotes, setUpdateTaskNotes] = useState(null)
    const [updateTaskName, setUpdateTaskName] = useState(null)
    const [updateTaskGooglePlaceId, setUpdateTaskGooglePlaceId] = useState(null)

	// On load, load trips 
	useEffect(() => {
        function loadTrip() { return API.get("travel", `/trips/${props.match.params.tripId}`); }
        function loadAllTasks() { return API.get("travel", `/tasks/${props.match.params.tripId}`); }

        console.log("did use effect")
        async function onLoad() {
            try {
                if ((props.tripInfo === null) | (props.tripInfo.tripId !== props.match.params.tripId)) {
                  var response = await loadTrip()
                  props.setTripInfo(response)
                };
                setWishlistId(props.tripInfo.wishlistIds[0]);

                if (props.taskInfo === null) {
                  response = await loadAllTasks()
                  var responseReformat = {}
                  for (var i=0; i < response.length; i++) {
                      responseReformat[response[i].taskId] = response[i]
                  }
                  props.setTaskInfo(responseReformat)
                };
                setAllTasksInfo(props.taskInfo);
            } catch (e) {
                alert(e);
            }
            setIsLoading(false);
        }
        onLoad();
    }, []);

    function handleScriptLoad(locationFieldName) {
        // const options = { types: ['(regions)'], };
        // Initialize Google Autocomplete
        /*global google*/ // To disable any eslint 'google not defined' errors
        const model = new google.maps.places.Autocomplete(
          document.getElementById(locationFieldName),
          // options,
          )
        model.setFields(['formatted_address', 'place_id']);
        model.addListener('place_changed', () => {handlePlaceSelect(model, locationFieldName)});
      }

    function handlePlaceSelect(model, locationFieldName) {
        // Extract City From Address Object
        const addressObject = model.getPlace();
        console.log(addressObject)

        if (addressObject) {
          document.getElementById(locationFieldName).data = addressObject.place_id
        }
    }


    function loadDetails() {
    	return (
    		<div>
    		<h2>{allTasksInfo[whatInfo].taskName}</h2>
    		<Button onClick={() => setLetEdit(true)}>{<Glyphicon glyph="edit"/>} Edit</Button>
    		<p></p>
    		More info
    		</div>
    	);
    }

    function handleEditChange(event, changeFunction) {
        changeFunction(event.target.value)
    }

    async function onEditFormSubmit(event, currentPlaceInfo) {
        event.preventDefault();

        // make new body
        currentPlaceInfo['taskName'] = document.getElementById('editLocation').value
        if (updateTaskDuration !== null) { currentPlaceInfo['taskDuration'] = updateTaskDuration }
        if (updateTaskNotes !== null ) { currentPlaceInfo['tripNotes'] = updateTaskNotes }
        if (typeof document.getElementById('editLocation').data !== "undefined") {
            currentPlaceInfo['taskGooglePlaceId'] = document.getElementById('editLocation').data
        };

        try {
            const response = await API.put("travel", `/tasks/${currentPlaceInfo.tripId}/${currentPlaceInfo.taskId}`, {body: currentPlaceInfo});
            console.log("Update a place")
            window.location.reload(false);
        } catch (e) {
            alert(e);
        }
    }

    function loadEditForm() {
        const locationFieldName = "editLocation"
        const currentPlaceInfo = allTasksInfo[whatInfo]
        const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
        return (
            <div>
            <Script 
            url={url}
            onLoad={() => handleScriptLoad(locationFieldName)}
            />
            <h2 style={{fontFamily: "Roboto"}}>Edit: {currentPlaceInfo.taskName}</h2>

            <form onSubmit={(e) => onEditFormSubmit(e, currentPlaceInfo)}>
            <TextField 
              id={locationFieldName}
              label="Location" 
              fullWidth
              data = {null}
              margin="dense"
              variant="filled"
              InputProps={{style: {fontSize: 12} }}
              defaultValue={currentPlaceInfo.taskName}
            />

            <TextField
              id="editTaskDuration"
              InputProps={{style: {fontSize: 12} }}
              label="Duration"
              fullWidth
              margin="dense"
              type="number"
              variant="filled" 
              onChange={(e) => handleEditChange(e, setUpdateTaskDuration)}
              defaultValue={currentPlaceInfo.taskDuration}
            />

            <TextField
              id="editTaskNotes"
              label="Additional Notes"
              fullWidth
              multiline rows="4"
              margin="dense"
              variant="filled"
              type="time"
              //value={updateTaskNotes}
              defaultValue={currentPlaceInfo.taskNotes}
              onChange={(e) => handleEditChange(e, setUpdateTaskNotes)}
              InputLabelProps={
                {shrink: true,},
                {style: {fontSize: 12} }
              }
            />
            <p></p>
            {LoaderButton(isLoading, false, "Update")}
            </form>
            </div>
        );
    }

    function validateForm() {
        return (
          fields.taskDuration > 0 &&
          fields.taskDuration <= 12
        );
    }

    async function onAddFormSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        const taskData = {
            tripId: props.match.params.tripId,
            taskName: document.getElementById("addLocation").value,
            taskGooglePlaceId: document.getElementById("addLocation").data,
            taskDuration: fields.taskDuration,
            taskNotes: (fields.taskNotes === "" ? null : fields.taskNotes),
            taskAttachment: null
        };
        try {
            const response = await API.post("travel", "/tasks/location", {body: taskData});
            console.log("Posted new place")
            const newTaskData = {taskId: response.taskId}
            await API.put("travel", `/trips/${props.match.params.tripId}/append-task`, {body: newTaskData})
            console.log("appended to trips")
            await API.put("travel", `/cols/${props.match.params.tripId}/${wishlistId}/append-task`, {body: newTaskData})
            console.log("appended to wishlist col")
            window.location.reload(false);
        } catch (e) {
            alert(e);
        }
    }

    function loadAddForm() {
        const locationFieldName = "addLocation"
        const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
    	return (
    		<div>
            <Script 
            url={url}
            onLoad={() => handleScriptLoad(locationFieldName)}
            />
    		<h2 style={{fontFamily: "Roboto"}}>Add a new place</h2>

    		<form onSubmit={onAddFormSubmit}>
            <TextField 
              id={locationFieldName}
              label="Location" 
              fullWidth
              data = ""
              margin="dense"
              variant="filled"
              InputProps={{style: {fontSize: 12} }}
            />

            <TextField
              id="taskDuration"
              InputProps={{style: {fontSize: 12} }}
              label="Duration"
              fullWidth
              margin="dense"
              type="number"
              variant="filled" 
              onChange={handleFieldChange}
              value={fields.taskDuration}
            />

            <TextField
              id="taskNotes"
              label="Additional Notes"
              fullWidth
              multiline rows="4"
              margin="dense"
              variant="filled"
              type="time"
              value={fields.taskNotes}
              onChange={handleFieldChange}
              InputLabelProps={
                {shrink: true,},
                {style: {fontSize: 12} }
              }
            />
            <p></p>
            {LoaderButton(isLoading, !validateForm(), "Submit")}
    		</form>
    		</div>
    	)
    }


    function loadFrame() {
    	// home first
    	if (whatInfo === "__home__") {
    		return (<div>Select a piece to view or edit details.</div>);
    	}

    	// add new item
    	if (whatInfo === "__add__") {
    		return loadAddForm()
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
	            <b><Glyphicon glyph="pushpin"/></b>&nbsp;&nbsp;{title}
	        </ListGroupItem>
	    );
    }

    function renderPlaceLinks(allPlaces) {
        if (allPlaces) {
          const placeLinks = Object.keys(allTasksInfo).filter(key => key.startsWith('place')).map(key => (placeLink(allTasksInfo[key].taskId, allTasksInfo[key].taskName)))
          return(
            <div>
            	<div>
            	<span class="left"><PanelTitle>Your places</PanelTitle></span>
            	<span class="right">
            		<Button onClick={() => setWhatInfo("__add__")}>
            		<Glyphicon glyph="plus"/> Add
            		</Button>
            	</span>
            	</div>
	            {placeLinks}
            </div>
          );
        }
        return("No places yet. Add one! >>")
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
		{!isLoading && renderPlaceLinks(allTasksInfo)}
		</InvisiblePanel>

		</AlignPanels>
		</BackgroundPanel>

		</div>
	)

}