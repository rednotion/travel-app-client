import React, { Component } from "react";
import { Glyphicon } from "react-bootstrap";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from 'styled-components';

import { PanelTitle, PanelSubtitle } from "./MyTrips"

import { info, distances } from '../data/data_trips.js'

import { Title, AlignColumns, ColumnContainer, AlignItems, 
  ItemContainer, AlignRuler, Ruler, RulerNotch } from "../styles/DDList.js"

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
  return(
    <div>
    {<Glyphicon glyph="map-marker"/>} <b>{place.id}</b> <br></br>
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
    newDriveItems[driveId] = {id: driveId, type: 'drive', duration: 1}
    runningIdx += 2 // reset running index
  }

  return [newTaskIds, newDriveItems]
}

const Row = ({ data, index, style }: RowProps) => {
  const item = data[index];

   // We are rendering an extra item for the placeholder
  if (!item) { return null; }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        {/*...*/}
      )}
    </Draggable>
  );
};

function renderExtraRow(provided: DroppableProvided, snapshot: DroppableStateSnapshot) {
  // Add an extra item to our list to make space for a dragging item
  // Usually the DroppableProvided.placeholder does this, but that won't
  // work in a virtual list

  console.log(snapshot.isUsing);
}


/////////////
/////////////

class App extends Component {
  constructor(props) {
    super(props);
    this.state = info
    this.distances = distances
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragUpdate = this.onDragUpdate.bind(this);
  }

  onDragUpdate = results => {
    const { destination, source, draggableId } = results;

    if (!destination) { return; }
    if (destination.droppableId == source.droppableId &&
      destination.index == source.index) { return; }

    const itemList = this.state.items
    const thisCol = this.state.columns[destination.droppableId];

    // in this column
    const thisColItems = this.state.columns[destination.droppableId].taskIds;
    thisColItems.splice(destination.index, 0, draggableId).filter(tag => tag.startsWith('place'))

    const itemBeforeMe = (destination.index === 0) 
      ? null 
      : thisColItems.slice(0,destination.index).reverse().filter(tag => tag.startsWith('place'))[0]

    if (itemBeforeMe) {
      // add new information to itemList
      const driveId = 'drive-' + itemBeforeMe + '-to-' + draggableId
      const driveItem = {id: driveId, type: 'drive', locationName: driveId, duration: 1}
      if (!Object.keys(itemList).includes(driveId)) {itemList[driveId] = driveItem}

      // add this new item to the column ordering
      const isItem = (element) => element === draggableId
      const draggableIndex = thisColItems.findIndex(isItem)
      thisColItems.splice(draggableIndex, 0, driveId)

      const newThisColumn = {
          ...thisCol, //other fields constant
          taskIds: thisColItems
      };

      const newState = {
        ...this.state,
        items: itemList,
        columns: {
          ...this.state.columns,
          [newThisColumn.id]: newThisColumn
        }
      }

      this.setState(newState)

    }
  }

  onDragEnd = results => {
    const { destination, source, draggableId } = results;

    if (!destination) {return;}
    if (destination.droppableId == source.droppableId &&
      destination.index == source.index) { return; }

    console.log(draggableId)
    console.log(source.droppableId)
    console.log(this.state.columns[destination.droppableId].taskIds)
    console.log(this.state.columns[source.droppableId].taskIds)

    var newSourceTaskIds = Array.from(this.state.columns[source.droppableId].taskIds)
    newSourceTaskIds = newSourceTaskIds.filter(tag => tag !== draggableId)

    // need to fix source only
    const newSourceColumn = {
      ...this.state.columns[source.droppableId],
      taskIds: newSourceTaskIds
    };
    const newState = {
        ...this.state, // keep other variables
        columns: { // but in columns
          ...this.state.columns, // keep other columns consistent
          [newSourceColumn.id]: newSourceColumn, // replace this column with this info
        },
    };
    this.setState(newState)
    return;
  }


  


  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div>
      <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
        { /* Column */}
        <AlignColumns>
        {this.state.colOrder.map((colId, index) => (
	        <Droppable droppableId={colId} >
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
	    </AlignColumns>
      </DragDropContext>
      </div>
    );
  }
}

export default function TestPage(props) {
	return(<App />)
}