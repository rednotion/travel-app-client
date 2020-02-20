import React, { useRef, useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem, Glyphicon, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import Popup from "reactjs-popup";

import { AlignPanels, BackgroundPanel, PanelTitle, PanelSubtitle, InvisiblePanel, 
    InvisiblePanelFixed } from "../styles/Pages.js";

import { trips as data_trips } from "../data/data_trips.js"


export default function Home(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [allTrips, setAllTrips] = useState({})

  /* On load, find our trips */
    useEffect(() => {
        async function onLoad() {
              try {
                  const allTrips = await loadAllTrips();
                  setAllTrips(allTrips);
              } catch (e) {
                  alert(e);
              }
              setIsLoading(false)
          }

          onLoad();
    }, []);

    function loadAllTrips() {
        return data_trips
        /*return API.get("notes", "/notes");*/
    }

    function tripLink(tripId, title) {
        const path = "trip/" + tripId
        return(
          <LinkContainer key={tripId} to={path}>
            <ListGroupItem>
                <h4>
                    <b><Glyphicon glyph="pushpin"/></b>&nbsp;&nbsp;{title}
                </h4>
            </ListGroupItem>
          </LinkContainer>
        );
      }

    function renderTripLinks(allTrips) {
        if (allTrips) {
          const tripLinks = Object.keys(allTrips).map((key, index) => (tripLink(allTrips[key].tripId, allTrips[key].tripName)))
          return(
            <BackgroundPanel>
                <PanelTitle>Your trips</PanelTitle>
                {tripLinks}
            </BackgroundPanel>
          );
        }
        return("No trips yet. Add one! >>")
      }

    function renderLanding() {
        return(
            <InvisiblePanel>
            <center>Please log in</center>
            </InvisiblePanel>
        )
    }

    /* Summary of what to render */
    return (
        <AlignPanels>
        <BackgroundPanel>
            {props.isAuthenticated ? renderTripLinks(allTrips) : renderLanding()}
        </BackgroundPanel>

        <BackgroundPanel>
        Random
        </BackgroundPanel>
        </AlignPanels>
    );
}