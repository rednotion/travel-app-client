import styled from 'styled-components';
import * as Colors from './colors.js'

const durationMultiplier = 60;
const itemPadding = 3;

// Column items
export const Title = styled.h3`
  background: #d3d4d1;
  margin-top: 0px;
  padding: 10px;
  font-family: "Roboto";
  font-weight: "bold";
`;
export const AlignColumns = styled.div`
	display: flex;
`;
export const ColumnToolbar = styled.div`
  margin: 8px;
  padding: 0px;
  min-width: 200px;
  flex-grow: 1;
  display: flex,
  flex-direction: column, 
`
export const ColumnContainer = styled.div`
  background: ${props => (props.isDraggingOver ? '#a1bcc3' : '#ebece9')};

  margin: 8px;

  min-width: 200px;
  max-width: 300px;
  
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
export const WishlistContainer = styled.div`
  background: ${props => (props.isDraggingOver ? '#8A9EDB' : '#A2A2A2')};

  min-width: 200px;
  max-width: 300px;
  
  flex-grow: 1;
  display: flex;
  flex-direction: column;

`

// List Items
export const AlignItems = styled.div`
	flex-grow: 1;
	min-height: 200px;
  max-height: ${durationMultiplier * 12};
`;
// border: ${props => (props.isDragging ? '#99d3d5' : '1px solid #c7cecf')};
export const ItemContainer = styled.div`
  border-radius: 8px;
  background: ${props => (props.isDragging ? '#99d3d5' : '#d1d8da')};

  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  
  padding-bottom: 8px;

  margin-top: 0px;
  margin-bottom: ${itemPadding + "px"};
  margin-right: 8px;
  margin-left: 5px;
  
  min-height: 35px;
  height: ${props => props.itemDuration * durationMultiplier - itemPadding + "px"}
`;
export const ItemTitle = styled.div`
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  background: #CFABB4;
  padding: 8px;
  min-height: 30px;
`
export const ItemBody = styled.div`
  margin: 8px;
`
export const WishlistItemContainer = styled.div`
  border-radius: 8px;
  background: ${props => (props.isDragging ? '#99d3d5' : '#d1d8da')};
  padding: 8px;
  min-height: 30px;
  margin-bottom: 10px;
  margin-right: 8px;
  margin-left: 8px;

  font-family: "Open Sans", sans-serif;
  font-size: 12px; 
`

// Drive Items
export const DriveContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  height: ${props => props.itemDuration * durationMultiplier + "px"};
  margin-bottom: ${itemPadding + "px"};

  ${props => props.item}
  
  display: flex;
  justify-content: center;
  align-items: center;
`


// Ruler items
export const AlignRuler = styled.div`
  display: flex;
  flex-direction: row;
`;
export const Ruler = styled.div`
  width: 30px;
  margin-left: 5px;
  margin-bottom: 5px;
  background: ${props => (props.isDraggingOver ? '#a1bcc3' : '#b1b3b3')};
  color: ${props => (props.isDraggingOver ? '#528190' : '#8e908f')};
`;
export const RulerNotch = styled.div`
  height: ${durationMultiplier + "px"};
  background: ${props => (props.isDraggingOver ? '#a1bcc3' : '#ebece9')};
  font-size: 10px;
  
  padding: 2px;
`;
export const EmptyRulerNotch = styled.div`
  height: ${durationMultiplier + "px"};
  background: ${props => (props.isDraggingOver ? '#a1bcc3' : '#b1b3b3')};
  font-size: 10px;
  
  padding: 2px;
`;