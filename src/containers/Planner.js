import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import { LinkContainer } from "react-router-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';
import Popup from "reactjs-popup";


import "../styles/HoverStyles.css"

import { BackgroundPanel, PanelTitle, PanelSubtitle } from "../styles/Pages"
import { Title, AlignColumns, ColumnContainer, AlignItems, 
  ItemContainer, AlignRuler, Ruler, RulerNotch, DriveContainer,
  WishlistContainer, ItemTitle, ItemBody, WishlistItemContainer } from "../styles/DDList.js"
import Toolbar from "../components/Toolbar.js";

import { info, distances } from '../data/data_trips.js'

//////////

function generateTime(n) {
  const indexes = [...Array(n).keys()];
  const timeLabels = indexes.map(item => (item + 8))
  const labels = timeLabels.map(lab => (
    (lab < 12) ? (lab + "am") : ((lab === 12) ? (lab + "pm") : (lab-12 + "pm"))
  ))
  return labels
}

function getDistance(origin, destination, distances) {
  return distances[origin][destination]
}

function generateNearLocations(itemId, distances, info) {
  // returns ['locationName', distance]
  const distanceDict = distances[itemId]
  var items = Object.keys(distanceDict).map(function(key) {
    return [key, distanceDict[key]];
  });
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return first[1] - second[1];
  });
  items = items.filter(pair => pair[0] != itemId)

  const nearLocations = items.map(each => ([info.items[each[0]].description, each[1]]))

  return nearLocations.slice(0,3)
}

function launchToolTip(itemId, distances, info) {
  const nearLocations = generateNearLocations(itemId, distances, info)
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

function generateItemTitle(place, isDragging) {
  // const nearestPlaceName = info[nearestPlace].locationName
  if (place.type == 'location'){
    return(
      <div>
      <span class="left"><b>{place.description}</b></span>
      {(!isDragging) ? <span class="right">{launchPopUp()}</span> : ""}
      </div>
    ) } else {
    return(
      <center><small>{place.description}</small></center>
      )
  }
}

function handleFieldChange() {}
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
          <FormGroup controlId="formgroup1" bsSize="small">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="content"
              onChange={handleFieldChange}
              value="hello"
            />
          </FormGroup>
        </form>
      </BackgroundPanel>
      </AlignColumns>
    </Popup>
  );
}

function rebuildList(places, distances) {
  var idx, driveId, runningIdx;
  var newTaskIds = Array.from(places)
  var newDriveItems = new Object()
  const maxIdx = places.length - 1

  runningIdx = 1

  for (idx = 0; idx < maxIdx; idx++) {
    driveId = 'drive-' + places[idx].toString() + '-to-' + (places[idx + 1]).toString()
    var driveTime = getDistance(places[idx], places[idx+1], distances)
    newTaskIds.splice(runningIdx, 0, driveId) // add to new tasks
    newDriveItems[driveId] = {
      id: driveId, 
      type: 'drive', 
      duration: driveTime,
      description: "Estimated drive time = " + driveTime.toString() + " hours"
    }
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
    this.distances = distances
    this.onDragEnd = this.onDragEnd.bind(this);
    this.tripId = ''
  }



  onDragEnd = results => {
    var itemList = this.state.items
    const { destination, source, draggableId } = results;

    // start with fixing source list
    const sourceTaskIds = this.state.columns[source.droppableId].taskIds
    sourceTaskIds.splice(sourceTaskIds.indexOf(draggableId), 1)
    // fix destination list - more complicated
    const destinationTaskIds = this.state.columns[destination.droppableId].taskIds
    destinationTaskIds.splice(destination.index, 0, draggableId)


    var newColumns = {
      ...this.state.columns,
    }

    // Update WISHLIST (no drive items)
    if ( this.state.columns[source.droppableId].type !== 'wishlist') {
      // now for both lists, we regenerate the distances
      const sourcePlaces = sourceTaskIds.filter(tag => tag.startsWith('place'))
      const [newSourceTaskIds, newSourceDriveItems] = rebuildList(sourcePlaces, this.distances)
      for (const [key, value] of Object.entries(newSourceDriveItems)) { 
        if (!Object.keys(itemList).includes(key)) { itemList[key] = value }
      }
    const newSourceColumn = {
      ...this.state.columns[source.droppableId],
      taskIds: newSourceTaskIds};
    newColumns[newSourceColumn.id] = newSourceColumn
    }

    if ( this.state.columns[destination.droppableId].type !== 'wishlist') {
      // repeat for destination
      const destinationPlaces = destinationTaskIds.filter(tag => tag.startsWith('place'))
      const [newDestinationTaskIds, newDestinationDriveItems] = rebuildList(destinationPlaces, this.distances)
      for (const [key, value] of Object.entries(newDestinationDriveItems)) { 
        if (!Object.keys(itemList).includes(key)) { itemList[key] = value }
      }
    const newDestinationColumn = {
      ...this.state.columns[destination.droppableId],
      taskIds: newDestinationTaskIds};
    newColumns[newDestinationColumn.id] = newDestinationColumn
    }

    const newState = {
      ...this.state,
      items: itemList,
      columns: newColumns,
    }

    this.setState(newState)

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
        {this.state.colOrder.map((colId, index) => (
	        <Droppable droppableId={colId} >
	          {(provided, snapshot) => (
	            <ColumnContainer
	              {...provided.droppableProps}
	              ref={provided.innerRef}
	              isDraggingOver={snapshot.isDraggingOver}
	            >
                <Title>
                <div>
                <span class="left">{this.state.columns[colId].description}</span>
                <span class="right">{<Glyphicon glyph="pushpin"/>}</span>
                </div>
                </Title>
                  <AlignRuler>
                  <Ruler pullLeft isDraggingOver={snapshot.isDraggingOver}>
                    {generateTime(14).map(label => (
                      <RulerNotch isDraggingOver={snapshot.isDraggingOver}>
                      {label}
                      </RulerNotch>))}
                  </Ruler>
	              	<AlignItems>
                  { /* Item */}
	              	{this.state.columns[colId].taskIds.map((item, index) => (
                    (this.state.items[item].type === 'location') 
                    ? (
  		                <Draggable key={item} draggableId={item} index={index}>
  		                  {(provided, snapshot) => (
  		                    <ItemContainer
  		                      ref={provided.innerRef}
  		                      {...provided.draggableProps}
  		                      {...provided.dragHandleProps}
  		                      isDragging={snapshot.isDragging}
                            itemDuration={this.state.items[item].duration}
  		                    >
                          <ItemTitle>{generateItemTitle(this.state.items[item], snapshot.isDragging)}</ItemTitle>
                          <ItemBody>
                            {this.state.items[item].description} + "more words..."
                          </ItemBody>
                          <div>{launchToolTip(this.state.items[item].id, this.distances, this.state)}</div>
  		                    </ItemContainer>
  		                  )}
  		                </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={this.state.items[item].duration}>
                        {generateItemTitle(this.state.items[item])}
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
      {this.state.wishlistColOrder.map((colId, index) => (
          <Droppable droppableId={colId} >
            {(provided, snapshot) => (
              <WishlistContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                <Title>{this.state.columns[colId].description}</Title>
                  <AlignItems>
                  { /* Item */}
                  {this.state.columns[colId].taskIds.map((item, index) => (
                    (this.state.items[item].type === 'location') 
                    ? (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <WishlistItemContainer
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          >
                            {generateItemTitle(this.state.items[item], snapshot.isDragging)}
                          </WishlistItemContainer>
                        )}
                      </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={this.state.items[item].duration}>
                        {generateItemTitle(this.state.items[item])}
                      </DriveContainer>
                    )))}
                  </AlignItems>
                  {provided.placeholder}
              </WishlistContainer>
            )}
          </Droppable>
      ))}
      </AlignColumns>
      </DragDropContext>
      </div>
    );
  }
}

export default function Planner(props) {
  console.log(props.match.params.id)
  const newApp = new App
  newApp.tripId = props.match.params.id
	return(newApp)
}