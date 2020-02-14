import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button, ButtonToolbar } from "react-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
	InvisiblePanelFixed } from "./MyTrips_css.js";
import Toolbar from "../components/Toolbar.js";

import { trips as data_trips } from "../data/data_trips.js"


export default function Trip(props) {
	const [tripInfo, setTripInfo] = useState({})
	const [fields, handleFieldChange] = useFormFields({
    tripName: "",
    tripStart: "",
    tripEnd: "",
    tripLocation: ""})
	const tripId = props.match.params.id
	const [toEdit, setToEdit] = useState(false)
	const [toPlan, setToPlan] = useState(false)

	useEffect(() => {
		function loadTrip() { return data_trips[tripId] }
	  	async function onLoad() {

	  		try {
	  			const info = await loadTrip();
	  			setTripInfo(info);
	  		} catch (e) {
	  			alert(e);
	  		}
	  	}

	    onLoad();
	  }, []
	  );

	function formField(title, id, field, type) {
	    return(
	        <FormGroup controlId={id} bsSize="large">
	          <ControlLabel>{title}</ControlLabel>
	          <FormControl
	            autoFocus
	            type={type}
	            onChange={handleFieldChange}
	            value={field}
	          />
	        </FormGroup>
	      );
	  }

	function handleTripChange() {}

	return (
		<div>
		{ Toolbar(tripId) }
		<BackgroundPanel>
		<AlignPanels>

		{(toEdit)
			? (
				<InvisiblePanel>
					<PanelTitle>Edit {tripInfo.tripName}</PanelTitle>
					<form onSubmit={handleTripChange}>
						{formField("Trip Name*", "tripName", fields.tripName, "content")}
        				{formField("Trip Start*", "tripStart", fields.tripStart, "date")}
        				{formField("Trip End*", "tripEnd", fields.tripEnd, "date")}
        				{formField("Trip Location", "tripLocation", fields.tripLocation, "content")}
						<Button block type="submit">Save</Button>
					</form>
				</InvisiblePanel>
			) : (
		(toPlan)
			? (
				<InvisiblePanel>
					TO plan
				</InvisiblePanel>
			) : (
				<InvisiblePanel>
					Blank
				</InvisiblePanel>
			))
		}

		<InvisiblePanelFixed pullright>
			<PanelTitle>{tripInfo.tripName}</PanelTitle>
					{<Glyphicon glyph="map-marker"/>} {tripInfo.tripLocation}<br></br>
					<b>Trip Begin</b>: {tripInfo.tripStart}<br></br>
					<b>Trip End</b>: {tripInfo.tripEnd}<br></br>

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