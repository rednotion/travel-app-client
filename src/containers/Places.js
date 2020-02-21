import React, { useState, useEffect } from "react";
import { Glyphicon, ListGroupItem } from "react-bootstrap";

import { API } from "aws-amplify";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, InvisiblePanel } from "../styles/Pages.js";
import Toolbar from "../components/Toolbar.js";
import { LacquerH3 } from "../styles/Text.js";

import "../styles/HoverStyles.css"

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import { PurpleButton, GreenButton, RedButton } from '../styles/Buttons.js';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';


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
        function determineInconsistent(infovar){
            if (infovar === null) { 
                return true; 
            } else if (Object.keys(infovar).length === 0) {
                return true;
            } else {
                return infovar[Object.keys(infovar)[0]].tripId !== props.match.params.tripId;
            }
        }

        async function onLoad() {
            const overallFail = (props.trackerTripId !== props.match.params.tripId)
            try {
                if (overallFail) {
                  var response = await loadTrip()
                  props.setTripInfo(response)
                  props.setTrackerTripId(response.tripId)
                };
                setWishlistId(props.tripInfo.wishlistIds[0]);

                if (overallFail | determineInconsistent(props.taskInfo)) {
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
    		<LacquerH3>{allTasksInfo[whatInfo].taskName}</LacquerH3>
    		<PurpleButton variant="contained" onClick={() => setLetEdit(true)} style={{marginRight: 10}}>
          <EditIcon />&nbsp;Edit
        </PurpleButton>
        <RedButton variant="contained" onClick={handleDelete}>
          <DeleteOutlineOutlinedIcon />&nbsp;Delete
        </RedButton>
    		<div style={{marginTop: 50}}>
    		{allTasksInfo[whatInfo].taskNotes}
        </div>
        </div>
    	);
    }

    function handleDelete(event) {}

    function handleEditChange(event, changeFunction) {
        changeFunction(event.target.value)
    }

    async function onEditFormSubmit(event, currentPlaceInfo) {
        event.preventDefault();

        // make new body
        currentPlaceInfo['taskName'] = document.getElementById('editLocation').value
        currentPlaceInfo['taskDuration'] = document.getElementById("editTaskDuration").value
        if (updateTaskNotes !== null ) { currentPlaceInfo['taskNotes'] = updateTaskNotes }
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
            <LacquerH3>Edit: {currentPlaceInfo.taskName}</LacquerH3>

            <form onSubmit={(e) => onEditFormSubmit(e, currentPlaceInfo)}>
            <TextField 
              id={locationFieldName}
              label={<Typography style={{fontFamily: "Montserrat"}}>
                Location
              </Typography>}
              fullWidth
              data = {null}
              margin="dense"
              variant="filled"
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
              defaultValue={currentPlaceInfo.taskName}
            />

            <TextField
              id="editTaskDuration"
              label={<Typography style={{fontFamily: "Montserrat"}}>
                Duration (hours)
              </Typography>}
              fullWidth
              margin="dense"
              type="number"
              variant="filled" 
              onChange={(e) => handleEditChange(e, setUpdateTaskDuration)}
              defaultValue={parseInt(currentPlaceInfo.taskDuration)}
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
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
              InputLabelProps={{shrink: true}}
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
            />
            <p></p>
            {LoaderButton(false, 
              false, "Update")}
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
    		<LacquerH3>Add a new place</LacquerH3>

    		<form onSubmit={onAddFormSubmit}>
            <TextField 
              id={locationFieldName}
              label={<Typography style={{fontFamily: "Montserrat"}}>
                Location
              </Typography>}
              fullWidth
              data = ""
              margin="dense"
              variant="filled"
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
            />

            <TextField
              id="taskDuration"
              label={<Typography style={{fontFamily: "Montserrat"}}>
                Duration
              </Typography>}
              fullWidth
              margin="dense"
              type="number"
              variant="filled" 
              onChange={handleFieldChange}
              value={fields.taskDuration}
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
            />

            <TextField
              id="taskNotes"
              label={<Typography style={{fontFamily: "Montserrat"}}>
                Additional Notes
              </Typography>}
              fullWidth
              multiline rows="4"
              margin="dense"
              variant="filled"
              type="time"
              value={fields.taskNotes}
              onChange={handleFieldChange}
              InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
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
	        <ListGroupItem key={placeId} onClick={() => handleLinkClick(placeId)} className="LinkStyle">
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
            		<GreenButton variant="contained" onClick={() => setWhatInfo("__add__")}>
            		<AddToPhotosIcon />&nbsp;&nbsp;  Add
            		</GreenButton>
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
        
		{!isLoading && Toolbar(tripId, props.tripInfo.tripName)}

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