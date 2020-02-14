import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

import { PanelTitle, PanelSubtitle } from "../styles/Pages.js"

import { info, distances } from '../data/data_trips.js'

import { Title, AlignColumns, ColumnContainer, AlignItems, 
  ItemContainer, AlignRuler, Ruler, RulerNotch } from "../styles/DDList.js"

//////////

function generateTime(n) {
  const indexes = [...Array(n).keys()];
  const timeLabels = indexes.map(item => (item + 8))
  const labels = timeLabels.map(lab => (
    (lab < 12) ? (lab + "am") : ((lab == 12) ? (lab + "pm") : (lab-12 + "pm"))
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
  return(
    <div>
    {<Glyphicon glyph="map-marker"/>} <b>{place.locationName}</b> <br></br>
    </div>
  );
}

function rebuildList(places, distances) {
  var idx, driveId, runningIdx;
  var newTaskIds = Array.from(places)
  var newDriveItems = new Object()
  const maxIdx = places.length - 1

  runningIdx = 1

  for (idx = 0; idx < maxIdx; idx++) {
    driveId = 'drive-' + idx.toString() + '-' + (idx + 1).toString()
    newTaskIds.splice(runningIdx, 0, driveId) // add to new tasks
    newDriveItems[driveId] = {id: driveId, type: 'drive', duration: 10}
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
    const { destination, source, draggableId } = results;

    if (!destination) {return;}
    if (destination.droppableId == source.droppableId &&
      destination.index == source.index) { return; }

    const start_col = this.state.columns[source.droppableId];
    const finish_col = this.state.columns[destination.droppableId];

    // Stay within the same column
    if (start_col === finish_col){
      const newTaskIds = Array.from(start_col.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start_col,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState)
      return;
    }

    // Move from one col to another
    const startTaskIds = Array.from(start_col.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start_col,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish_col.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish_col,
      taskIds: finishTaskIds,
    }

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);

  }


  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div>
      <DragDropContext onDragEnd={this.onDragEnd}>
        <AlignColumns>
        { /* Each of the droppable columns */}
        {this.state.colOrder.map((colId, index) => (
	        <Droppable droppableId={colId}>
	          {(provided, snapshot) => (
	            <ColumnContainer
	              {...provided.droppableProps}
	              ref={provided.innerRef}
	              isDraggingOver={snapshot.isDraggingOver}
	            >
	            	<Title>{this.state.columns[colId].content}</Title>
	              	{ /* Item */}
                  <AlignRuler>
                  <Ruler pullLeft isDraggingOver={snapshot.isDraggingOver}>
                    {generateTime(14).map(label => (
                      <RulerNotch isDraggingOver={snapshot.isDraggingOver}>
                      {label}
                      </RulerNotch>))}
                  </Ruler>
	              	<AlignItems>
	              	{this.state.columns[colId].taskIds.map((item, index) => (
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
	              	))}
	              	</AlignItems>
                  </AlignRuler>
	              	{provided.placeholder}
	            </ColumnContainer>
	          )}
	      </Droppable>
      ))}

      {/*This is the distance matrix toolbar*/}
      <Droppable droppableId="distances_matrix">
      {(provided, snapshot) => (
        <ColumnContainer
        {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
        >
        <PanelSubtitle>Distance Matrix</PanelSubtitle>
        </ColumnContainer>
      )}
      </Droppable>
	    </AlignColumns>
      </DragDropContext>
      </div>
    );
  }
}

export default function Planner(props) {
	return(<App />)
}