import React, { useState } from "react";

import "./Login.css";

import google_integration from "../images/google_integration.png";
import places from "../images/places.png";
import planner_one from "../images/planner_one.png";
import planner_two from "../images/planner_two.png";

import { BackgroundPanel } from "../styles/Pages.js";
import { ToolbarButtonLink } from "../components/MuiRouteLink.js";


const imageStyle = {
	boxShadow: "1px 2px 10px rgba(0, 0, 0, .7)"
}
const blockStyle = {
	marginTop: 50,
}
const subtitleStyle = {
	width: 450,
	borderLeft: "5px solid #F7620C",
	color: "#e2e2e2",
	fontSize: 12,
	margin: "auto",
	marginTop: 10,
	textAlign: "left",
	paddingLeft: 15,
	paddingTop: 5,
	paddingBottom: 5,
}

export default function Home(props) {
  return (
  	<div style={{color: "#efefef", marginTop: 100, fontFamily: "Montserrat", textAlign: "center"}}>

    <span style={{fontFamily: "Rubik Mono One", color: "#F7620C"}}>TAKEMETHERE</span> is an integrated platform to help you manage and plan your holidays.

    <div style={blockStyle}>
    <img src={places} style={imageStyle} width="500px"></img>
    <p></p>
    <span style={{fontWeight: 700}}>Keep track of your wishlist</span> by logging places.
    </div>


    <div style={blockStyle}>
    <img src={google_integration} style={imageStyle} width="500px"></img>
    <p></p>
    Make use of our <span style={{fontWeight: 700}}>integrated Google Autocomplete</span> to find your stops. 
    </div>

    <div style={blockStyle}>
    <img src={planner_one} style={imageStyle} width="500px"></img>
    <p></p>
    Plan and change your trip whenever with our <span style={{fontWeight: 700}}>drag-and-drop</span> lists.
    <br></br>
    <div style={subtitleStyle}>
	    Daily columns are generated for you based on your trip dates & times<br></br>
	    Drive time in between locations is <span style={{fontWeight: 700}}>automatically estimated</span> for you!
    </div>
    </div>

    <div style={blockStyle}>
    <img src={planner_two} style={imageStyle} width="500px"></img>
    <p></p>
    To make things easier, the <span style={{fontWeight: 700}}>toolbar follows</span> you around the page as you plan.
    </div>

    <div style={{marginTop: 30, marginBottom: 60}}>
    <ToolbarButtonLink to="signup" primary="Sign Up"/>
    </div>


    </div>
  );
}