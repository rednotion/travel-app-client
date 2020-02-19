import React, { Component, useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import { LinkContainer } from "react-router-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';
import Popup from "reactjs-popup";
import "../styles/HoverStyles.css";
import { useFormFields } from "../libs/hooksLib";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

import { BackgroundPanel, PanelTitle, PanelSubtitlem, InvisiblePanel } from "../styles/Pages"
import { Title, AlignColumns, ColumnContainer, AlignItems, ColumnToolbar,
  ItemContainer, AlignRuler, Ruler, RulerNotch, EmptyRulerNotch, DriveContainer,
  WishlistContainer, ItemTitle, ItemBody, WishlistItemContainer } from "../styles/DDList.js"
import Toolbar from "../components/Toolbar.js";

import { info, distances } from '../data/data_trips.js'

//////////


function generateTime(startTime, endTime) {
  const startHour = parseInt(startTime.slice(0,2)) + 1
  const endHour = parseInt(endTime.slice(0,2)) + 1
  const hours = [...Array(endHour).keys()].slice(startHour, endHour)
  const labels = hours.map(lab => (
    (lab < 12) ? (lab + "am") : ((lab === 12) ? (lab + "pm") : (lab-12 + "pm"))
  ))
  return labels
}

const minTime = Math.min(...info.colOrder.map(colId => info.columns[colId].startTime))

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



// function generateNearLocations(itemId, distances, info) {
//   // returns ['locationName', distance]
//   const distanceDict = distances[itemId]
//   var items = Object.keys(distanceDict).map(function(key) {
//     return [key, distanceDict[key]];
//   });
//   // Sort the array based on the second element
//   items.sort(function(first, second) {
//     return first[1] - second[1];
//   });
//   items = items.filter(pair => pair[0] != itemId)

//   const nearLocations = items.map(each => ([info.items[each[0]].description, each[1]]))

//   return nearLocations.slice(0,3)
// }

function generateNearLocations(taskId) {
  return [['PlaceA', 10], ['PlaceB', 20], ['PlaceC', 30]]
}

function launchToolTip(taskId) {
  const nearLocations = generateNearLocations(taskId)
  return (
    <Popup
      trigger={<span class="LocationTip">Where next?</span>}
      on="hover"
    >
      {nearLocations.map(item => (
        <div><b>{item[0]}</b> is {item[1]} hours away</div>
      ))}
    </Popup>
  )
}

function generateItemTitle(taskItem, isDragging) {
  // const nearestPlaceName = info[nearestPlace].locationName
  if (taskItem.taskType == 'location'){
    return(
      <div>
      <span class="left"><b>{taskItem.taskName}</b> <small><i>({taskItem.taskDuration}h)</i></small></span>
      {(!isDragging) ? <span class="right">{launchPopUp()}</span> : ""}
      </div>
    ) } else {
    return(
      <center><small>{taskItem.taskName}</small></center>
      )
  }
}

function handleSubmit() {}
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

function handleFieldChange() {}
function launchPopUp() {
  const fields = {name: 'hello', location: 'x=10,y=10', duration:10}
  return(
    <Popup 
      trigger={<div className="EditButton"><span class="glyphicon glyphicon-pencil"></span></div>} 
      modal
    >
      <AlignColumns>
      <BackgroundPanel>
      <h3>Current Info</h3>
      </BackgroundPanel>

      <BackgroundPanel>
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="name" bsSize="small">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="content"
              onChange={handleFieldChange}
              value={fields.name}
            />
          </FormGroup>
        </form>
      </BackgroundPanel>
      </AlignColumns>
    </Popup>
  );
}

function getDistance(origin, destination) {
  return 2
}

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

function rebuildList(tripId, locationIds) {
  var idx, driveId, runningIdx;
  var newTaskIds = Array.from(locationIds)
  var newDriveItems = new Object()
  var driveData
  var response
  const maxIdx = locationIds.length - 1

  runningIdx = 1

  console.log(locationIds)

  for (idx = 0; idx < maxIdx; idx++) {
    driveId = 'fakedrive-' + locationIds[idx].toString() + '-to-' + (locationIds[idx + 1]).toString()
    var driveTime = getDistance(locationIds[idx], locationIds[idx+1])
    driveData = {
      taskIdHolder: driveId,
      tripId: tripId,
      taskDuration: driveTime,
      taskName: "Estimated drive time = " + driveTime.toString() + " hours"
    }
    console.log("new drive item")
    console.log(driveData)
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
    this.state = info
    this.onDragEnd = this.onDragEnd.bind(this);
    this.minTime = "08:00"
    this.tripId = ''
    this.isLoading = false
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
      const [newSourceTaskIds, newSourceDriveItems] = rebuildList(this.tripId, sourcePlaces)
      for (const [key, value] of Object.entries(newSourceDriveItems)) { 
        if (!Object.keys(this.taskInfo).includes(key)) { this.taskInfo[key] = value }
      }
      this.colInfo[source.droppableId].taskIds = newSourceTaskIds
      
    }

    if ( this.colInfo[destination.droppableId].colType !== 'wishlist') {
      const destinationPlaces = destinationTaskIds.filter(tag => tag.startsWith('place'))
      // const [newDestinationTaskIds, newDestinationDriveItems] = 
      const [newDestinationTaskIds, newDestinationDriveItems] = rebuildList(this.tripId, destinationPlaces)
      for (const [key, value] of Object.entries(newDestinationDriveItems)) { 
        if (!Object.keys(this.taskInfo).includes(key)) { this.taskInfo[key] = value };
      }
      this.colInfo[destination.droppableId].taskIds = newDestinationTaskIds
    }
  }

  

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div>
      
      { Toolbar(this.tripId) }

      <DragDropContext onDragEnd={this.onDragEnd}>
        <AlignColumns>
        { /* Daily Columns */}
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
                <span class="left">{this.colInfo[colId].colName}</span>
                <span class="right">{<Glyphicon glyph="pushpin"/>}</span>
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
                            itemDuration={this.taskInfo[taskId].taskDuration}
  		                    >
                          <ItemTitle>{generateItemTitle(this.taskInfo[taskId], snapshot.isDragging)}</ItemTitle>
                          <ItemBody>
                            {this.taskInfo[taskId].taskName} + "more words..."
                          </ItemBody>
                          <div>{launchToolTip(this.taskInfo[taskId].taskId)}</div>
  		                    </ItemContainer>
  		                  )}
  		                </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={this.taskInfo[taskId].taskDuration}>
                        {generateItemTitle(this.taskInfo[taskId])}
                      </DriveContainer>
                    )))}
	              	</AlignItems>
                  </AlignRuler>
                  {provided.placeholder}
	            </ColumnContainer>
	          )}
	        </Droppable>
	    ))}
      
      { /* Wishlist Column */}
      <ColumnToolbar>
      <LoaderButton
          block
          onClick={() => {handleUpdate(this.colInfo, this.taskInfo, this.isLoading)}}
          bsSize="large"
          bsStyle="primary"
          isLoading={this.isLoading}
      >
        Update
      </LoaderButton>
      {this.tripInfo.wishlistIds.map((colId, index) => (
          <Droppable droppableId={colId} >
            {(provided, snapshot) => (
              <WishlistContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Title>{this.colInfo[colId].colName}</Title>
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

export default function Planner(props) {
  const newApp = new App
  console.log(props.currentTripId)
  newApp.tripId = props.currentTripId
  newApp.tripInfo = props.tripInfo
  newApp.colInfo = props.colInfo
  newApp.taskInfo = props.taskInfo

	return(newApp)
}