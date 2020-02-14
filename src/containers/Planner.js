import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

import { PanelTitle, PanelSubtitle } from "../styles/Pages"
import { Title, AlignColumns, ColumnContainer, AlignItems, 
  ItemContainer, AlignRuler, Ruler, RulerNotch, DriveContainer } from "../styles/DDList.js"


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

function generateFindNearestLocation(itemId, distances, info) {
  // returns ['locationName', distance]
  const distanceDict = distances[itemId]
  var items = Object.keys(distanceDict).map(function(key) {
    return [key, distanceDict[key]];
  });
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return first[1] - second[1];
  });

  const nearestPlaceName = info.items[items[0][0]].locationName
  const results = [nearestPlaceName, items[0][1]]

  return results
}

function getDistance(origin, destination, distances) {
  return distances[origin][destination]
}

function generateItemCard(place, distances, info) {
  // const nearestPlaceName = info[nearestPlace].locationName
  if (place.type == 'location'){
    return(
      <div>
      {<Glyphicon glyph="map-marker"/>} <b>{place.description}</b> <br></br>
      </div>
    ) } else {
    return(
      <center><small>{place.description}</small></center>
      )
  }
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
	            	<Title>{this.state.columns[colId].description}</Title>
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
                            {generateItemCard(this.state.items[item], distances, info)}
  		                    </ItemContainer>
  		                  )}
  		                </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={this.state.items[item].duration}>
                        {generateItemCard(this.state.items[item], distances, info)}
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
              <ColumnContainer
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
                          <ItemContainer
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDragging={snapshot.isDragging}
                          >
                            {generateItemCard(this.state.items[item], distances, info)}
                          </ItemContainer>
                        )}
                      </Draggable>
                    )
                    :(
                      <DriveContainer itemDuration={this.state.items[item].duration}>
                        {generateItemCard(this.state.items[item], distances, info)}
                      </DriveContainer>
                    )))}
                  </AlignItems>
                  {provided.placeholder}
              </ColumnContainer>
            )}
          </Droppable>
      ))}
	    </AlignColumns>
      </DragDropContext>
      </div>
    );
  }
}

export default function TestPage(props) {
	return(<App />)
}