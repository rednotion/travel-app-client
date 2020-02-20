import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, Button, ControlLabel, Glyphicon } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, Panel, PanelTitle, LocationField, InvisibleColumnLeft, InvisibleColumnRight } from "../styles/Pages.js";

// import { Autocomplete, GoogleApiWrapper } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';

//import SearchBar from 'material-ui-search-bar';
import Script from 'react-load-script';

//material UI
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';


export default function MyTrips(props) {
  // general
  const [allTrips, setAllTrips] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // for the form
  const [fields, handleFieldChange] = useFormFields({
    tripName: "",
    tripStartDate: "",
    tripStartTime: "",
    tripEndDate: "",
    tripEndTime: "",
    tripNotes: "",
  });
  const [newTripId, setNewTripId] = useState(null);
  const [formIsLoading, setFormIsLoading] = useState(false);
  
  

  /* On load, find our trips */
  useEffect(() => {
      async function onLoad() {
          try {
              const allTrips = await loadAllTrips();
              console.log(allTrips)
              setAllTrips(allTrips);
          } catch (e) {
              alert(e);
          }
          setIsLoading(false)
      }

      onLoad();
  }, []);

  function loadAllTrips() {
      return API.get("travel", "/trips");
  }

  function formField(title, id, field, type) {
    return(
        <FormGroup controlId={id} bsSize="small">
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

  function tripLink(tripId, title) {
    const path = "trip/" + tripId
    return (
      <ListItem button component="a" href={path}>
      <ChevronRightRoundedIcon />
      <ListItemText><span style={{fontSize: "15px"}}>{title}</span></ListItemText>
      </ListItem>
    );
  }

  function renderTripLinks(allTrips) {
    if (allTrips !== []) {
      const tripLinks = [].concat(allTrips).map((key, index) => tripLink(key.tripId, key.tripName))
      //const tripLinks = Object.keys(allTrips).map((key) => (tripLink(allTrips[key].tripId, allTrips[key].tripName)))
      return(
        tripLinks
      );
    }
    return("No trips yet. Add one! >>")
  }


  async function handleSubmit(event) { 
    event.preventDefault();

    setFormIsLoading(true);

    var tripResponse;
    var tripData = {tripName: fields.tripName, tripStartDate: fields.tripStartDate, tripStartTime: fields.tripStartTime,
      tripEndDate: fields.tripEndDate, tripEndTime: fields.tripEndTime, 
      tripLocation: document.getElementById("autocompleteLocation").value,
      tripGooglePlaceId: document.getElementById("autocompleteLocation").data, 
      tripNotes: ((fields.tripNotes !== "") & fields.tripNotes : null),
      colIds: [], wishlistIds: [], taskIds: []};
    try {
      tripResponse = await API.post("travel", "/trips", {body: tripData});
      console.log(tripResponse.tripId)
    } catch (e) {
      alert(e);
    }

    // create columns
    const endDate = new Date(fields.tripEndDate);
    const startDate = new Date(fields.tripStartDate);
    const nDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    // initialize new daycolumns
    var day
    var newColIds = []
    var response
    for (day = 0; day < nDays; day++) {
      var colData = {tripId: tripResponse.tripId, colType: "day", colName: "Day " + (day+1), 
        colStartTime: ((day === 0) ? fields.tripStartTime : "09:00"), 
        colEndTime: ((day === nDays-1) ? fields.tripEndTime : "22:00"), taskIds: [], colNotes: null, colLodging: {}};
      try { 
        response = await API.post("travel", "/cols", {body: colData})
        newColIds.push(response.colId)
      } catch(e) {
        alert(e);
      }
    }
    // initialize wishlist column
    const wishlistData = {tripId: tripResponse.tripId, colType: "wishlist", colName: "Wishlist", colStartTime: null, 
      colEndTime: null, taskIds: [], colNotes: null, colLodging: null};
    var newWishlistId = null
    try {
      response = await API.post("travel", "/cols", {body: wishlistData})
      newWishlistId = response.colId
    } catch(e) {
      alert(e);
    }

    // update API again
    tripData['colIds'] = newColIds
    tripData['wishlistIds'] = [newWishlistId]
    try {
      response = await API.put("travel", "/trips/" + tripResponse.tripId, {body: tripData})
      window.location.reload(false);
    } catch(e) {
      alert(e);
      setFormIsLoading(false);
    } 
  }

  function validateForm() {
    return (
      fields.tripName.length > 0 &&
      fields.tripStartDate.length > 0 &&
      (fields.tripEndDate >= fields.tripStartDate) &&
      fields.tripStartTime.length > 0 &&
      fields.tripEndTime.length > 0 &&
      fields.tripEndDate.length > 0
    );
  }

  function handleScriptLoad() {
    // Declare Options For Autocomplete
    // const options = {
    //   types: ['(regions)'],
    // };

    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    const model = new google.maps.places.Autocomplete(
      document.getElementById('autocompleteLocation'),
      // options,
      )

    model.setFields(['formatted_address', 'place_id']);
    model.addListener('place_changed', () => {handlePlaceSelect(model)});
  }

  function handlePlaceSelect(model) {
    // Extract City From Address Object
    const addressObject = model.getPlace();
    console.log(addressObject)

    if (addressObject) {
      document.getElementById("autocompleteLocation").data = addressObject.place_id
    }
  }

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`
  
  return (
    <AlignPanels>
    <Script 
        url={url}
        onLoad={() => handleScriptLoad()}
    />
    <Panel>
      <PanelTitle>Your Trips</PanelTitle>
      <List component="nav" aria-label="all user trips">
      { renderTripLinks(allTrips) }
      </List>
    </Panel>

    <Panel>

      <PanelTitle><Glyphicon glyph="plus"/> Add New Trip</PanelTitle>


      <form onSubmit={handleSubmit}>
        <TextField
          id="tripName"
          InputProps={{style: {fontSize: 12} }}
          label="Trip Name"
          fullWidth
          margin="dense"
          variant="filled" 
          onChange={handleFieldChange}
          value={fields.tripName}
        />

        <TextField 
          id="autocompleteLocation" 
          label="Location" 
          fullWidth
          data = ""
          margin="dense"
          variant="filled"
          InputProps={{style: {fontSize: 12} }}
        />
        
        <AlignPanels>
        <InvisibleColumnLeft>
        <TextField
          id="tripStartDate"
          label="Arrival Date"
          margin="dense"
          variant="filled"
          fullWidth
          type="date"
          value={fields.tripStartDate}
          onChange={handleFieldChange}
          InputLabelProps={
            {shrink: true,}
          }
        />
        <TextField
          id="tripStartTime"
          label="Arrival Time"
          margin="dense"
          variant="filled"
          fullWidth
          type="time"
          value={fields.tripStartTime}
          onChange={handleFieldChange}
          InputLabelProps={
            {shrink: true,}
          }
        />
        </InvisibleColumnLeft>

        <InvisibleColumnRight>
        <TextField
          id="tripEndDate"
          label="Departure Date"
          fullWidth
          margin="dense"
          variant="filled"
          type="date"
          value={fields.tripEndDate}
          onChange={handleFieldChange}
          InputLabelProps={
            {shrink: true,}
          }
        />
        <TextField
          id="tripEndTime"
          label="Departure Time"
          fullWidth
          margin="dense"
          variant="filled"
          type="time"
          value={fields.tripEndTime}
          onChange={handleFieldChange}
          InputLabelProps={
            {shrink: true,}
          }
        />
        </InvisibleColumnRight>
        </AlignPanels>

        <TextField
          id="tripNotes"
          label="Additional Notes"
          fullWidth
          multiline rows="4"
          margin="dense"
          variant="filled"
          type="time"
          value={fields.tripNotes}
          onChange={handleFieldChange}
          InputLabelProps={
            {shrink: true,},
            {style: {fontSize: 12} }
          }
        />

        <p></p>

        { /* formField("Additional Notes", "tripNotes", fields.tripNotes, "textarea") */}
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={formIsLoading}
          
        >
          Create
        </LoaderButton>
      </form>
    </Panel>
    </AlignPanels>
  );
}

// disabled={!validateForm()}