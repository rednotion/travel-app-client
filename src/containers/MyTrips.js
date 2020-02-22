import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ListGroupItem, Glyphicon } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { API } from "aws-amplify";
import config from "../config";

import { useFormFields } from "../libs/hooksLib";
import LoaderButton from "../components/LoaderButton";
import { AlignPanels, Panel, PanelTitle, LocationField, InvisibleColumnLeft, InvisibleColumnRight,
  BackgroundPanel, InvisiblePanel } from "../styles/Pages.js";
import { ListItemLink } from "../components/MuiRouteLink.js"

// import { Autocomplete, GoogleApiWrapper } from 'google-maps-react';
import Autocomplete from 'react-google-autocomplete';

//import SearchBar from 'material-ui-search-bar';
import Script from 'react-load-script';

import "../styles/HoverStyles.css"

//material UI
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FilledInput from '@material-ui/core/FilledInput';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import CircularProgress from '@material-ui/core/CircularProgress';



export default function MyTrips(props) {
  // general
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
        if (props.allTripInfo === null) {
          try {
              const allTrips = await loadAllTrips();
              console.log(allTrips)
              props.setAllTripInfo(allTrips);
          } catch (e) {
              alert(e);
          }
        };
        setIsLoading(false)
      }

      onLoad();
  }, []);

  function loadAllTrips() {
      return API.get("travel", "/trips");
  }

  function tripLink(tripId, title) {
      const path = "trip/" + tripId
      return(
          <LinkContainer key={tripId} to={path}>
          <ListGroupItem className="LinkStyle">
              <Glyphicon glyph="chevron-right"></Glyphicon> &nbsp;{title}
          </ListGroupItem>
          </LinkContainer>
      );
  }


  // function tripLink(tripId, title) {
  //   const path = "trip/" + tripId
  //   return (
  //     <ListItemLink to={path}
  //     disableTypography
  //     icon={<ChevronRightRoundedIcon fontSize="large" />}
  //     primary={
  //       <Typography
  //       style={{fontFamily: "Montserrat", fontWeight:600, fontSize: 16}}>
  //       {title}
  //       </Typography>} 
  //     />
  //   );
  // }

  function renderTripLinks(allTripInfo) {
    if (allTripInfo) {
      const tripLinks = [].concat(allTripInfo).map((key, index) => tripLink(key.tripId, key.tripName))
      return(
        tripLinks
      );
    }
    return("No trips yet. Add one! >>")
  }


  async function handleSubmit(event) { 
    event.preventDefault();

    if (validateForm()) {

    setFormIsLoading(true);

    var tripResponse;
    var tripData = {tripName: fields.tripName, tripStartDate: fields.tripStartDate, tripStartTime: fields.tripStartTime,
      tripEndDate: fields.tripEndDate, tripEndTime: fields.tripEndTime, 
      tripLocation: document.getElementById("autocompleteLocation").value,
      tripGooglePlaceId: document.getElementById("autocompleteLocation").data, 
      tripNotes: ((fields.tripNotes !== "") ? fields.tripNotes : null),
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

  const googleUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`

  return (
    <BackgroundPanel>
    <AlignPanels>
    <Script 
        url={googleUrl}
        onLoad={() => handleScriptLoad()}
    />
    <InvisiblePanel>
      <PanelTitle>Your Trips</PanelTitle>
      {!isLoading 
        ? (
          <List component="nav" aria-label="all user trips">
          { renderTripLinks(props.allTripInfo) }
          </List>
        ) : (
          <center><CircularProgress/></center>
        )
    }
      
    </InvisiblePanel>

    <InvisiblePanel>

      <PanelTitle><PlaylistAddIcon style={{fontSize: 25, margin: -4}}/> Add New Trip</PanelTitle>
      <form onSubmit={handleSubmit}>
        <TextField
          id="tripName"
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Trip Name
          </Typography>}
          fullWidth
          margin="dense"
          variant="filled" 
          onChange={handleFieldChange}
          value={fields.tripName}
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />

        <TextField 
          id="autocompleteLocation" 
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Location
          </Typography>}
          fullWidth
          data = ""
          margin="dense"
          variant="filled"
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />
        
        <AlignPanels>
        <InvisibleColumnLeft>
        <TextField
          id="tripStartDate"
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Arrival Date
          </Typography>}
          margin="dense"
          variant="filled"
          fullWidth
          type="date"
          value={fields.tripStartDate}
          onChange={handleFieldChange}
          InputLabelProps={{shrink: true}}
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />
        <TextField
          id="tripStartTime"
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Arrival Time
          </Typography>}
          margin="dense"
          variant="filled"
          fullWidth
          type="time"
          value={fields.tripStartTime}
          onChange={handleFieldChange}
          InputLabelProps={{shrink: true}}
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />
        </InvisibleColumnLeft>

        <InvisibleColumnRight>
        <TextField
          id="tripEndDate"
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Departure Date
          </Typography>}
          fullWidth
          margin="dense"
          variant="filled"
          type="date"
          value={fields.tripEndDate}
          onChange={handleFieldChange}
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
          value={fields.tripEndTime}
          onChange={handleFieldChange}
          InputLabelProps={{shrink: true}}
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />
        </InvisibleColumnRight>
        </AlignPanels>

        <TextField
          id="tripNotes"
          label={<Typography style={{fontFamily: "Montserrat"}}>
            Additional Notes
          </Typography>}
          fullWidth
          multiline rows="4"
          margin="dense"
          variant="filled"
          type="time"
          value={fields.tripNotes}
          onChange={handleFieldChange}
          InputProps={{style: {fontSize: 14, fontFamily: "Montserrat"} }}
        />

        <p></p>
        {LoaderButton(formIsLoading, !validateForm(), "Create")}
      </form>
    </InvisiblePanel>
    </AlignPanels>
    </BackgroundPanel>
  );
}

// disabled={!validateForm()}