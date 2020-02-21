import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button, ButtonToolbar } from "react-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
	InvisiblePanelFixed, TitlePanel } from "../styles/Pages.js";
import Toolbar from "../components/Toolbar.js";
import { FormColumn, FormRow } from "../styles/Forms.js"
import { LacquerH3 } from "../styles/Text.js";
import { PurpleButton, RedButton } from "../styles/Buttons.js";


import { changeDate } from "../components/DateHelper.js"

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';

import Script from 'react-load-script';



export default function Trip(props) {
	const [tripInfo, setTripInfo] = useState({});
	const [pageIsLoading, setPageIsLoading] = useState(true);
	const tripId = props.match.params.tripId;
	const [toEdit, setToEdit] = useState(false);
	const [formIsLoading, setFormIsLoading] = useState(false);
	// form fields
	const [formTripName, setFormTripName] = useState(null)
	const [formTripStartTime, setFormTripStartTime] = useState(null)
	const [formTripEndTime, setFormTripEndTime] = useState(null)
	const [formTripNotes, setFormTripNotes] = useState(null)

	useEffect(() => {
		function loadTrip() { return API.get("travel", `/trips/${tripId}`);}
	  	async function onLoad() {
  			try {
  				if ((props.tripInfo === null) | (props.trackerTripId !== props.match.params.id)) {
	  				const response = await loadTrip();
	  				props.setTripInfo(response)
	  				props.setTrackerTripId(response.tripId)
	  			}
	  			setTripInfo(props.tripInfo)
	  		} catch (e) {
	  			alert(e);
	  		};
	  		setPageIsLoading(false);
	  	}
	    onLoad();
	  }, []
	);

	function formField(title, id, field, type, valueChangeFunction) {
	    return(
	        <FormGroup controlId={id} bsSize="medium">
	          <ControlLabel>{title}</ControlLabel>
	          <FormControl
	            autoFocus
	            type={type}
	            onChange={e => valueChangeFunction(e.target.value)}
	            value={field}
	          />
	        </FormGroup>
	      );
	  }

	function validateForm() {
	    return (
		  formTripName.length > 0 &&
	      formTripStartTime.length > 0 &&
	      formTripEndTime.length > 0 
	    );
	}
	  
	async function handleTripChange(event) {
		event.preventDefault();
		setFormIsLoading(true)
		const updateTripData = {
			tripName: formTripName || props.tripInfo.tripName, 
			tripLocation: document.getElementById("tripLocation").value || props.tripInfo.tripLocation,
			tripGooglePlaceId: document.getElementById("tripLocation").data || props.tripInfo.tripGooglePlaceId,
			tripStartDate: props.tripInfo.tripStartDate, // no change allowed
			tripStartTime: formTripStartTime || props.tripInfo.tripStartTime,
			tripEndDate: props.tripInfo.tripEndDate, // no change allowed
			tripEndTime: formTripEndTime || props.tripInfo.tripEndTime,
			tripNotes: formTripNotes || props.tripInfo.tripNotes,
			colIds: props.tripInfo.colIds, // no change allowed
			wishlistIds: props.tripInfo.wishlistIds, // no change allowed
		}
		try {
			const response = await API.put("travel", `/trips/${tripId}`, {body: updateTripData});
			setFormIsLoading(false);
			window.location.reload(false);
		} catch (e) {
			alert(e);
			setFormIsLoading(false);
		}
	}

	function handleScriptLoad() {
        /*global google*/ // To disable any eslint 'google not defined' errors
        console.log('loaded script')
        const model = new google.maps.places.Autocomplete(
          document.getElementById("tripLocation"))
        model.setFields(['formatted_address', 'place_id']);
        model.addListener('place_changed', () => {handlePlaceSelect(model)});
      }

    function handlePlaceSelect(model) {
        // Extract City From Address Object
        const addressObject = model.getPlace();
        console.log(addressObject)

        if (addressObject) {
          // set to document info
          document.getElementById("tripLocation").data = addressObject.place_id
        }
    }

	const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`

	return (
		<div>
		{ pageIsLoading && <center><CircularProgress/></center> }

		{ (!pageIsLoading) && Toolbar(tripId, props.tripInfo.tripName) }

		{(!pageIsLoading)
		&& (
			<BackgroundPanel>
			<TitlePanel>
			<LacquerH3>{props.tripInfo.tripName}</LacquerH3>
			{<Glyphicon glyph="map-marker"/>} <b>{props.tripInfo.tripLocation}</b><br></br>
			<b>Trip Begin</b>: {props.tripInfo.tripStartDate}<br></br>
			<b>Trip End</b>: {props.tripInfo.tripEndDate}<br></br>
			</TitlePanel>
			<AlignPanels>
			<InvisiblePanelFixed pullLeft>
				<PurpleButton variant="contained" 
				fullWidth
				style={{marginLeft: -10}}
				onClick={() => setToEdit(true)}>
		          <EditIcon />&nbsp; Edit Trip
		        </PurpleButton>
		        <p></p>
		        <RedButton fullWidth 
		        style={{marginLeft: -10}}
		        variant="contained">
		        Delete
		        </RedButton>
			</InvisiblePanelFixed>

			{(toEdit)
				? (
					<>
					<Script url={url} onLoad={handleScriptLoad} />
					<InvisiblePanel>
						<form onSubmit={handleTripChange}>
						<TextField
				          id="tripName"
				          label={<Typography style={{fontFamily: "Montserrat"}}>
				            Trip Name
				          </Typography>}
				          fullWidth
				          margin="dense"
				          variant="filled" 
				          onChange={(e) => setFormTripName(e.target.value)}
				          defaultValue={props.tripInfo.tripName}
				          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
				        />
				        <TextField
				          id="tripLocation"
				          label={<Typography style={{fontFamily: "Montserrat"}}>
				            Location
				          </Typography>}
				          fullWidth
				          margin="dense"
				          variant="filled" 
				          data=""
				          defaultValue={props.tripInfo.tripLocation}
				          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
				        />
				        <TextField
				          id="tripStartTime"
				          label={<Typography style={{fontFamily: "Montserrat"}}>
				            Arrival Time
				          </Typography>}
				          fullWidth
				          margin="dense"
				          variant="filled" 
				          type="time"
				          defaultValue={props.tripInfo.tripStartTime}
				          onChange={(e) => setFormTripStartTime(e.target.value)}
				          InputLabelProps={{shrink: true}}
				          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
				        />
				        <TextField
				          id="tripEndTime"
				          label={<Typography style={{fontFamily: "Montserrat"}}>
				            Departure Time
				          </Typography>}
				          fullWidth
				          margin="dense"
				          variant="filled" 
				          type="time"
				          defaultValue={props.tripInfo.tripEndTime}
				          onChange={(e) => setFormTripEndTime(e.target.value)}
				          InputLabelProps={{shrink: true}}
				          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
				        />
				        <TextField
				          id="tripNotes"
				          label={<Typography style={{fontFamily: "Montserrat"}}>
				            Additional Notes
				          </Typography>}
				          fullWidth
				          margin="dense"
				          variant="filled" 
				          multiline rows="4"
				          defaultValue={props.tripInfo.tripNotes}
				          onChange={(e) => setFormTripNotes(e.target.value)}
				          InputLabelProps={{shrink: true}}
				          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
				        />
				        

				        { LoaderButton(formIsLoading, false, "Update")}
						</form>
					</InvisiblePanel>
					</>
				) : (
					<InvisiblePanel>
					{props.tripInfo.tripNotes}
					</InvisiblePanel>
				)}
			</AlignPanels>
			</BackgroundPanel>
		)}
		</div>
	)

}