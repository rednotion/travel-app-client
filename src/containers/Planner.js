import React, { Component, useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon } from "react-bootstrap";
import ReactDOM from "react-dom";
import { LinkContainer } from "react-router-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';
import Popup from "reactjs-popup";
import "../styles/HoverStyles.css";
import { useFormFields } from "../libs/hooksLib";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";


import { BackgroundPanel, PanelTitle, PanelSubtitlem, InvisiblePanel, Padding20 } from "../styles/Pages"
import { Title, AlignColumns, ColumnContainer, AlignItems, ColumnToolbar,
  ItemContainer, AlignRuler, Ruler, RulerNotch, EmptyRulerNotch, DriveContainer,
  WishlistContainer, ItemTitle, ItemBody, WishlistItemContainer, DailyColumns } from "../styles/DDList.js"
import Toolbar from "../components/Toolbar.js";
import { LacquerH3 } from "../styles/Text.js";
import { PurpleButton, GreenButton } from "../styles/Buttons.js";

import Script from 'react-load-script';

import FlareIcon from '@material-ui/icons/Flare';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { lightBlue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import MapIcon from '@material-ui/icons/Map';


//////////

export default function Planner(props) {
  const newApp = new App
  newApp.tripId = props.trackerTripId
  newApp.tripInfo = props.tripInfo
  newApp.colInfo = props.colInfo
  newApp.taskInfo = props.taskInfo
  newApp.googleApiUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`

  return((newApp))
}


const ColorButton = withStyles(theme => ({
  root: {
    fontSize: 16,
    color: theme.palette.getContrastText(lightBlue[500]),
    backgroundColor: lightBlue[500],
    '&:hover': {
      backgroundColor: lightBlue[700],
      color: lightBlue[600]
    },
  },
}))(Button);


function generateTime(startTime, endTime) {
  const startHour = parseInt(startTime.slice(0,2)) + 1
  const endHour = parseInt(endTime.slice(0,2)) + 1
  const hours = [...Array(endHour).keys()].slice(startHour, endHour)
  const labels = hours.map(lab => (
    (lab < 12) ? (lab + "am") : ((lab === 12) ? (lab + "pm") : (lab-12 + "pm"))
  ))
  return labels
}

function renderEmptyNotches(colId, startTime, minTime, isDraggingOver) {
  if (minTime < startTime) {
    return (
      generateTime(minTime, startTime).map(label => (
        <EmptyRulerNotch isDraggingOver={isDraggingOver}>
        </EmptyRulerNotch>
    )))
  } else {
    return( <div></div>)
  }
}

function handleSubmit(event, taskItem) {
  event.preventDefault();
  console.log(document.getElementById("editTime").value)
  console.log(taskItem)
}

function launchPopUp(taskItem) {
  return(
    <Popup 
      id={"pop_up" + taskItem.taskId}
      trigger={<IconButton size="small" style={{marginTop: -5}}><EditIcon fontSize="small"/></IconButton>} 
      modal
    >
      <Padding20>
      <LacquerH3>{taskItem.taskName}</LacquerH3>
      <p></p>
      <div fontFamily="Roboto" fontSize="14"><b>Note</b>: Please head to <b>Places</b> tab to make edits to Location</div>
      <p></p>
      <form onSubmit={(e) => handleSubmit(e, taskItem)}>
      <TextField 
              id="editTime"
              label="Duration" 
              fullWidth
              margin="dense"
              variant="filled"
              type="number"
              defaultValue={taskItem.taskDuration}
              InputProps={{style: {fontSize: 12} }}
      />
      <TextField 
              id="editNotes"
              label="Notes" 
              fullWidth
              margin="dense"
              variant="filled"
              multiline rows="4"
              defaultValue={taskItem.taskNotes}
              InputProps={{style: {fontSize: 12} }}
      />
      <p></p>
      {LoaderButton(false, false, "Update")}
      </form>
      </Padding20>
    </Popup>
  );
}

function generateItemTitle(taskItem, isDragging) {
  // const nearestPlaceName = info[nearestPlace].locationName
  const shortenedTitle = taskItem.taskName.split(",")[0]
  if (taskItem.taskType == 'location'){
    return(
      <div>
      <span class="left"><b>{shortenedTitle}</b> <small><i>({taskItem.taskDuration}h)</i></small></span>
      {(!isDragging) ? <span class="right">{launchPopUp(taskItem)}</span> : ""}
      </div>
    ) } else {
    return(
      <center><small>{taskItem.taskName}</small></center>
      )
  }
}

const Arrow = ({ text, className }) => {
  return (
    <div
      className={className}
    >{text}</div>
  );
};
const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

async function handleUpdate(colInfo, taskInfo, isLoading) {
  isLoading = true;

  var response
  var realDriveDict = {}

  // update tasks first
  const fakeDrives = Object.keys(taskInfo).filter(key => key.startsWith('fakedrive'))
  console.log(fakeDrives)
  for (var i=0; i < fakeDrives.length; i++) {
    // upload each new drive, and add the real taskId to dictionary
    try {
      response = await API.post("travel", "/tasks/drive", {body: taskInfo[fakeDrives[i]]})
      realDriveDict[fakeDrives[i]] = response.taskId
    } catch (e) {
      alert(e);
    }
  }

  var editedTaskIds = []
  var newColData = {}
  // then update each column
  const columnIds = Object.keys(colInfo)
  for (var i=0; i < columnIds.length; i++) {
    // change the fake drive keys
    console.log(columnIds[i]);
    editedTaskIds = colInfo[columnIds[i]].taskIds.map(taskId => realDriveDict[taskId] || taskId);
    // create a new body
    newColData = {
      ...colInfo[columnIds[i]],
      'taskIds': editedTaskIds
    }
    // post the body
    try {
      await API.put("travel", `/cols/${newColData.tripId}/${columnIds[i]}`, {body: newColData})
    } catch (e) {
      alert(e);
    }
  }

  isLoading = false;
}

function rebuildList(tripId, locationIds, taskInfo, distanceInfo) {
  var idx, runningIdx;
  var newTaskIds = Array.from(locationIds)
  var newDriveItems = new Object()
  var driveData, response
  const maxIdx = locationIds.length - 1

  runningIdx = 1

  var origin, destination;
  var driveId, driveTime, driveText;

  for (idx = 0; idx < maxIdx; idx++) {
    origin = taskInfo[locationIds[idx]].taskGooglePlaceId;
    destination = taskInfo[locationIds[idx+1]].taskGooglePlaceId;

    driveId = 'fakedrive-' + locationIds[idx].toString() + '-to-' + (locationIds[idx + 1]).toString()
    driveTime = distanceInfo[origin][destination].duration.value / 60 / 60
    driveText = distanceInfo[origin][destination].duration.text

    driveData = {
      taskIdHolder: driveId,
      tripId: tripId,
      taskDuration: driveTime,
      taskName: "Estimated drive = " + driveText
    }
    newTaskIds.splice(runningIdx, 0, driveData.taskIdHolder) // add to new tasks
    newDriveItems[driveData.taskIdHolder] = driveData
    runningIdx += 2 // reset running index
  }

  return [newTaskIds, newDriveItems]
}


/////////////
/////////////

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {distanceInfo: null, placeIdDict: null, isLoading: true}
    this.onDragEnd = this.onDragEnd.bind(this);
    this.minTime = "09:00"
    this.tripId = ''
    this.isLoading = false
    this.googleApiUrl = ""
    this.tripInfo = null
    this.colInfo = null
    this.taskInfo = null
  }

  onDragEnd = results => {
    const { destination, source, draggableId } = results;

    // start with fixing source list
    const sourceTaskIds = this.colInfo[source.droppableId].taskIds
    sourceTaskIds.splice(sourceTaskIds.indexOf(draggableId), 1)
    // fix destination list - more complicated
    const destinationTaskIds = this.colInfo[destination.droppableId].taskIds
    destinationTaskIds.splice(destination.index, 0, draggableId)

    // initialize column info
    var newColumns = {
      ...this.colInfo,
    }

    // Update WISHLIST (no drive items)
    if ( this.colInfo[source.droppableId].colType !== 'wishlist') {
      // now for both lists, we regenerate the distances
      const sourcePlaces = sourceTaskIds.filter(tag => tag.startsWith('place'))
      const [newSourceTaskIds, newSourceDriveItems] = rebuildList(this.tripId, sourcePlaces, this.taskInfo, this.state.distanceInfo)
      for (const [key, value] of Object.entries(newSourceDriveItems)) { 
        if (!Object.keys(this.taskInfo).includes(key)) { this.taskInfo[key] = value }
      }
      this.colInfo[source.droppableId].taskIds = newSourceTaskIds
      
    }

    if ( this.colInfo[destination.droppableId].colType !== 'wishlist') {
      const destinationPlaces = destinationTaskIds.filter(tag => tag.startsWith('place'))
      // const [newDestinationTaskIds, newDestinationDriveItems] = 
      const [newDestinationTaskIds, newDestinationDriveItems] = rebuildList(this.tripId, destinationPlaces, this.taskInfo, this.state.distanceInfo)
      for (const [key, value] of Object.entries(newDestinationDriveItems)) { 
        if (!Object.keys(this.taskInfo).includes(key)) { this.taskInfo[key] = value };
      }
      this.colInfo[destination.droppableId].taskIds = newDestinationTaskIds
    }
  }

  launchToolTip = (taskId) => {
    if (this.state.isLoading) {
      return ( <div></div> )
    } else {
      const nearLocations = this.generateNearLocations(taskId).map(item => (
        [this.taskInfo[item[0]].taskName.split(",")[0], item[1]]
      ));

      return (
        <Popup
          trigger={<IconButton size="small" style={{marginTop: -5}}><ControlCameraIcon /></IconButton>}
          on="hover"
        >
        {nearLocations.map(item => (<div><b>{item[0]}</b> is {item[1]} away</div> ))}
        </Popup>
      )
    };
  }

  generateNearLocations = (taskId) => {
    // returns ['locationName', distance]
    if (!this.state.isLoading) {
      const thisPlaceId = this.taskInfo[taskId].taskGooglePlaceId
      const distanceDict = this.state.distanceInfo[thisPlaceId]
      var items = Object.keys(distanceDict).map(function(placeId) {
        return [placeId, distanceDict[placeId].duration.value, distanceDict[placeId].duration.text];
      });

      // Sort the array based on the second element
      items.sort(function(first, second) {
        return first[1] - second[1];
      });
      items = items.filter(pair => pair[0] != thisPlaceId)

      const nearLocations = items.map(each => ([this.state.placeIdDict[each[0]], each[2]]))
      return nearLocations.slice(0,3)

    } else {
      return []
    }
  }


  handleScriptLoad = () => {
    var self = this
    var places = Object.keys(self.taskInfo).filter(
      key => key.startsWith('place')).map(
      key => Object({["placeId"]: this.taskInfo[key].taskGooglePlaceId}))
    console.log(places)
    if (places.length > 0) {
      const service = new window.google.maps.DistanceMatrixService

      service.getDistanceMatrix({
        origins: places,
        destinations: places,
        travelMode: 'DRIVING',
        unitSystem: window.google.maps.UnitSystem.METRIC,
      }, function(response, status) {
            if (status !== 'OK') {
              alert('Error was: ' + status);
        } else {
          console.log(response)
          var reformatDistanceInfo = {}
          for (var x=0; x < places.length; x++) {
            var innerDictionary = {}
            for (var y=0; y < places.length; y++) {
              innerDictionary[places[y].placeId] = response.rows[x].elements[y]
            }
            reformatDistanceInfo[places[x].placeId] = innerDictionary;
          }
          console.log(reformatDistanceInfo)

          var reversePlaceId = {}
          Object.keys(self.taskInfo).filter(key => key.startsWith('place')).map(key => 
            reversePlaceId[self.taskInfo[key].taskGooglePlaceId] = key
          );

          self.setState({
            distanceInfo: reformatDistanceInfo, 
            placeIdDict: reversePlaceId,
            isLoading: false
          });
        }
      })
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div>
      <Script url={this.googleApiUrl} onLoad={() => this.handleScriptLoad()}/>
      { Toolbar(this.tripId) }
      <DragDropContext onDragEnd={this.onDragEnd}>
        <AlignColumns>
        { /* Daily Columns */}
        <DailyColumns>
        {this.tripInfo.colIds.map((colId, index) => (
	        <Droppable droppableId={colId} >
	          {(provided, snapshot) => (
	            <ColumnContainer
	              {...provided.droppableProps}
	              ref={provided.innerRef}
	              isDraggingOver={snapshot.isDraggingOver}
	            >
                <Title>
                <div>
                <span className="left">{this.colInfo[colId].colName}</span>
                <span className="right"><IconButton size="small" style={{marginTop: -5}}><MoreVertIcon /></IconButton></span>
                </div>
                </Title>
                  {renderEmptyNotches(colId, this.colInfo[colId].colStartTime, this.minTime, snapshot.isDraggingOver)}
                  <AlignRuler>
                  <Ruler pullLeft isDraggingOver={snapshot.isDraggingOver}>
                    {generateTime(this.colInfo[colId].colStartTime, this.colInfo[colId].colEndTime).map(label => (
                      <RulerNotch isDraggingOver={snapshot.isDraggingOver}>
                      {label}
                      </RulerNotch>))}
                  </Ruler>
	              	<AlignItems>
                  { /* Item */}
	              	{this.colInfo[colId].taskIds.map((taskId, index) => (
                    (this.taskInfo[taskId].taskType === 'location') 
                    ? (
  		                <Draggable key={taskId} draggableId={taskId} index={index}>
  		                  {(provided, snapshot) => (
  		                    <ItemContainer
  		                      ref={provided.innerRef}
  		                      {...provided.draggableProps}
  		                      {...provided.dragHandleProps}
  		                      isDragging={snapshot.isDragging}
                            itemDuration={parseFloat(this.taskInfo[taskId].taskDuration)}
  		                    >
                          <ItemTitle>{generateItemTitle(this.taskInfo[taskId], snapshot.isDragging)}</ItemTitle>
                          <ItemBody>
                            {this.taskInfo[taskId].taskNotes}
                            <div className="right">{!this.state.isLoading && this.launchToolTip(taskId)}</div>
                          </ItemBody>
  		                    </ItemContainer>
  		                  )}
  		                </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={parseFloat(this.taskInfo[taskId].taskDuration)}>
                        {!this.state.isLoading && generateItemTitle(this.taskInfo[taskId])}
                      </DriveContainer>
                    )))}
	              	</AlignItems>
                  </AlignRuler>
                  {provided.placeholder}
	            </ColumnContainer>
  	          )}
  	      </Droppable>
  	    ))}
        </DailyColumns>
      
      { /* Wishlist Column */}
      <ColumnToolbar>
      <GreenButton style={{fontSize:14, marginBottom: 10}} fullWidth onClick={() => {handleUpdate(this.colInfo, this.taskInfo, this.isLoading);}}>
        <SaveIcon style={{fontSize: 14}}/>&nbsp; Save Changes
      </GreenButton>
      <PurpleButton variant="contained" fullWidth style={{fontSize: 12}}>
        <MapIcon />&nbsp; View on map
      </PurpleButton>
      <p></p>
      {this.tripInfo.wishlistIds.map((colId, index) => (
          <Droppable droppableId={colId} >
            {(provided, snapshot) => (
              <WishlistContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Title><FlareIcon /> {this.colInfo[colId].colName}</Title>
                  <AlignItems>
                  { /* Item */}
                  {this.colInfo[colId].taskIds.map((taskId, index) => (
                    (this.taskInfo[taskId].taskType === 'location') 
                    && (
                      <Draggable key={taskId} draggableId={taskId} index={index}>
                        {(provided, snapshot) => (
                          <WishlistItemContainer
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          >
                            {generateItemTitle(this.taskInfo[taskId], snapshot.isDragging)}
                          </WishlistItemContainer>
                        )}
                      </Draggable>
                    )))}
                  </AlignItems>
                  {provided.placeholder}
              </WishlistContainer>
            )}
          </Droppable>
      ))}
      </ColumnToolbar>
      </AlignColumns>
      </DragDropContext>
      </div>
    );
  }
}

