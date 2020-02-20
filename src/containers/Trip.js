import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button, ButtonToolbar } from "react-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
	InvisiblePanelFixed } from "../styles/Pages.js";
import Toolbar from "../components/Toolbar.js";
import { FormColumn, FormRow } from "../styles/Forms.js"

import CircularProgress from '@material-ui/core/CircularProgress';

import { changeDate } from "../components/DateHelper.js"

export default function Trip(props) {
	const [tripInfo, setTripInfo] = useState({});
	const [pageIsLoading, setPageIsLoading] = useState(true);
	const tripId = props.match.params.tripId;
	const [toEdit, setToEdit] = useState(false);
	const [formIsLoading, setFormIsLoading] = useState(false);
	// form fields
	const [formTripName, setFormTripName] = useState("")
	const [formTripLocation, setFormTripLocation] = useState("")
	const [formTripStartDate, setFormTripStartDate] = useState("")
	const [formTripStartTime, setFormTripStartTime] = useState("")
	const [formTripEndDate, setFormTripEndDate] = useState("")
	const [formTripEndTime, setFormTripEndTime] = useState("")
	const [formTripNotes, setFormTripNotes] = useState("")
	const [formTripColIds, setFormTripColIds] = useState([])
	const [formTripWishlistIds, setFormWishlistIds] = useState([])

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
	  			// setFormTripName(props.tripInfo.tripName)
	  			// setFormTripLocation(props.tripInfo.tripLocation)
	  			// setFormTripStartDate(props.tripInfo.tripStartDate)
	  			// setFormTripStartTime(props.tripInfo.tripStartTime)
	  			// setFormTripEndDate(props.tripInfo.tripEndDate)
	  			// setFormTripEndTime(props.tripInfo.tripEndTime)
	  			// setFormTripNotes(props.tripInfo.tripNotes)
	  			// setFormTripColIds(props.tripInfo.colIds)
	  			// setFormWishlistIds(props.tripInfo.wishlistIds)
	  		} catch (e) {
	  			alert(e);
	  		};
	  		setPageIsLoading(false);
	  	}
	    onLoad();
	  }, []
	);

	// function loadTrip() { return API.get("travel", `/trips/${tripId}`);}

	// async function checkInfo() {
	// 	console.log("in check info")
	// 	console.log(props.tripInfo)
	// 	if (props.tripInfo === null) {
	// 		console.log('is null')
	// 		try {
	// 			var response = await loadTrip()
	// 			props.setTripInfo(response)
	// 			props.setCurrentTripId(response.tripId)
	// 		} catch (e) { alert(e); }
	// 	};
	// }

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
	      formTripLocation.length > 0 &&
	      formTripStartDate.length > 0 &&
	      (formTripEndDate >= formTripStartDate) &&
	      formTripStartTime.length > 0 &&
	      formTripEndTime.length > 0 &&
	      formTripEndDate.length > 0
	    );
	}
	  
	async function handleTripChange(event) {
		event.preventDefault();
		setFormIsLoading(true)
		const updateTripData = {
			tripName: formTripName,
			tripLocation: formTripLocation,
			tripStartDate: formTripStartDate,
			tripStartTime: formTripStartTime,
			tripEndDate: formTripEndDate,
			tripEndTime: formTripEndTime,
			tripNotes: formTripNotes,
			colIds: formTripColIds,
			wishlistIds: formTripWishlistIds
		}
		try {
			const response = await API.put("travel", `/trips/${tripId}`, {body: updateTripData});
			props.history.push( `/trip/${props.match.params.tripId}`);
		} catch (e) {
			alert(e);
			setFormIsLoading(false);
		}
	}

	return (
		<div>
		{ Toolbar(tripId) }
		<BackgroundPanel>
		{pageIsLoading && <center><CircularProgress/></center>}
		{(!pageIsLoading)
		&& (
			<>
			<AlignPanels>
			<InvisiblePanelFixed pullLeft>
				<PanelTitle>{props.tripInfo.tripName}</PanelTitle>
						{<Glyphicon glyph="map-marker"/>} {props.tripInfo.tripLocation}<br></br>
						<b>Trip Begin</b>: {props.tripInfo.tripStartDate}<br></br>
						<b>Trip End</b>: {props.tripInfo.tripEndDate}<br></br>

				<PanelSubtitle>Tools</PanelSubtitle>
				<ButtonToolbar>
					<Button variant="primary" block href={"/plan/"+tripId}>Plan my trip</Button>
					<Button variant="light" block onClick={() => setToEdit(true)}>Edit Trip Details</Button>
				</ButtonToolbar>
			</InvisiblePanelFixed>
			{(toEdit)
				? (
					<InvisiblePanel>
						<PanelTitle>Edit: bla {props.tripInfo.tripName}</PanelTitle>
						<form onSubmit={handleTripChange}>
							{formField("Name*", "tripName", formTripName, "content", setFormTripName)}
					        {formField("Location", "tripLocation", formTripLocation, "content", setFormTripLocation)}
					        <FormRow>
						        <FormColumn>
						        {formField("Arrival Time*", "tripStartTime", formTripStartTime, "time", setFormTripStartTime)}
						        </FormColumn>
					        	<FormColumn>
					        	{formField("Departure Time*", "tripEndTime", formTripEndTime, "time", setFormTripEndTime)}
					        	</FormColumn>
					        </FormRow>
					        {formField("Notes*", "tripNOtes", formTripNotes, "textarea", setFormTripNotes)}
							<LoaderButton
					          block
					          type="submit"
					          bsSize="large"
					          bsStyle="primary"
					          isLoading={formIsLoading}
					          disabled={!validateForm()}
					        >
					          Save
					        </LoaderButton>
						</form>
					</InvisiblePanel>
				) : (
					<InvisiblePanel>
						Blank
					</InvisiblePanel>
				)}
			</AlignPanels>
			</>
		)}
		</BackgroundPanel>
		</div>
	)

}