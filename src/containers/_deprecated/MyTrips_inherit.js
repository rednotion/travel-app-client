import React, { Component, useState, useEffect } from "react";
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


function handleFieldChange() {}
function fakeSubmit() {}

function new_script(src) {
  return new Promise(function(resolve, reject){
    var script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', function () {
      resolve();
    });
    script.addEventListener('error', function (e) {
      reject(e);
    });
    document.body.appendChild(script);
  })
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	status: 'start',
    	model: null}; // let state be loading

    this.scriptVariable = null
    this.sciptLink = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBgjsq4fLOlvASDo7M5GDalMAm3hiqxdKc&libraries=places"

    this.initAutoComplete = this.initAutoComplete.bind(this);

    this.formIsLoading = false
    this.googleModel = null
    this.fields = {
    	tripName: "",
    	tripStartDate: "",
    	tripStartTime: "",
    	tripEndDate: "",
    	tripEndTime: "",
    	tripNotes: ""
    }
  }



  handleScriptLoad = () => {
  	var self = this;
  	console.log("i am here")

  	const resultScript = new Promise (function(resolve, reject) {
  		const myScript = document.createElement("script");
	  	myScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBgjsq4fLOlvASDo7M5GDalMAm3hiqxdKc&libraries=places";
	  	myScript.addEventListener('load', function () { resolve(); });
	  	myScript.addEventListener('error', function (e) { reject(e); });
  		document.body.appendChild(myScript);
  	})
  	console.log(resultScript)

  	resultScript.then(function() {
  		console.log("loaded script")
  		self.setState({status: 'loaded'})
  	}) 
  }

  initAutoComplete = () => {
  		console.log("init AC")
  	  	const model = new window.google.maps.places.Autocomplete(document.getElementById("location"))
  		model.setFields(['formatted_address', 'place_id']);
  		model.addListener('place_changed', () => {this.handlePlaceSelect(model)});
  		this.setState({model: model})
  }

  
  handlePlaceSelect = (model) =>  {
    // Extract City From Address Object
    const addressObject = model.getPlace();
    console.log(addressObject)

    if (addressObject) {
      console.log(addressObject.formatted_address)
    }
  }


  render() {
  	var self = this; 
  	if (self.state.status === 'start') {
  		setTimeout(function () { self.handleScriptLoad()}, 0);
  	}

	  return ( 
	  	<div>
	  	{ (this.state.status === 'loaded') && 
	  	<AlignPanels>
	    <Panel>
	      <PanelTitle>Your Trips</PanelTitle>
	      <List component="nav" aria-label="all user trips">
	      { /* renderTripLinks(allTrips) */ }
	      <input id="location" ref={this.ac}/>
	      </List>
	    </Panel>

	    <Panel>
	      <PanelTitle><Glyphicon glyph="plus"/> Add New Trip</PanelTitle>
	      <form onSubmit={fakeSubmit}>
	        <TextField
	          id="tripName"
	          InputProps={{style: {fontSize: 12} }}
	          label="Trip Name"
	          fullWidth
	          margin="dense"
	          variant="filled" 
	          onChange={handleFieldChange}
	          value={this.fields.tripName}
	        />

	        <TextField 
	          id="autocompleteLocation" 
	          label="Location" 
	          ref="autocompleteLocation"
	          fullWidth
	          margin="dense"
	          variant="filled"
	          InputProps={{style: {fontSize: 12} }}
	        />
	        <p></p>
	        
	        <LoaderButton
	          block
	          type="submit"
	          bsSize="large"
	          bsStyle="primary"
	          isLoading={this.formIsLoading}
	        >
	          Create
	        </LoaderButton>
	      </form>
	    </Panel>
	    </AlignPanels>

	}
	</div>
	);
  }
}


export default function MyTrips(props) {
  const newApp = new App
  //newApp.tripId = props.currentTripId

  return(newApp)
}
