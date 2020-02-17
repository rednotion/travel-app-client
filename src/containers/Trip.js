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

import { changeDate } from "../components/DateHelper.js"

export default function Trip(props) {
	const [tripInfo, setTripInfo] = useState({});
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
	  			const response = await loadTrip();
	  			setTripInfo(response)
	  			setFormTripName(response.tripName)
	  			setFormTripLocation(response.tripLocation)
	  			setFormTripStartDate(response.tripStartDate)
	  			setFormTripStartTime(response.tripStartTime)
	  			setFormTripEndDate(response.tripEndDate)
	  			setFormTripEndTime(response.tripEndTime)
	  			setFormTripNotes(response.tripNotes)
	  			setFormTripColIds(response.colIds)
	  			setFormWishlistIds(response.wishlistIds)
	  		} catch (e) {
	  			alert(e);
	  		}	  		
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
		<AlignPanels>

		{(toEdit)
			? (
				<InvisiblePanel>
					<PanelTitle>Edit: bla {tripInfo.tripName}</PanelTitle>
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
			)
		}

		<InvisiblePanelFixed pullright>
			<PanelTitle>{tripInfo.tripName}</PanelTitle>
					{<Glyphicon glyph="map-marker"/>} {tripInfo.tripLocation}<br></br>
					<b>Trip Begin</b>: {tripInfo.tripStartDate}<br></br>
					<b>Trip End</b>: {tripInfo.tripEndDate}<br></br>

			<PanelSubtitle>Tools</PanelSubtitle>
			<ButtonToolbar>
				<Button variant="primary" block href={"/plan/"+tripId}>Plan my trip</Button>
				<Button variant="light" block onClick={() => setToEdit(true)}>Edit Trip Details</Button>
			</ButtonToolbar>
		</InvisiblePanelFixed>


		</AlignPanels>
		</BackgroundPanel>
		</div>
	)

}