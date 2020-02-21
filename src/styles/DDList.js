import styled from 'styled-components';

const durationMultiplier = 70;
const itemPadding = 3;

// Column items
export const DailyColumns = styled.div`
  border-right: 3px solid #f7620c;
  display: flex;
  flex-direction: row;
  overflow-y:auto;
`
export const Title = styled.h4`
  color: #535353;
  margin-top: 0px;
  margin-bottom: 8px;
  padding: 15px;
  font-family: "Rubik Mono One";
`;
export const AlignColumns = styled.div`
	display: flex;
`;
export const ColumnToolbar = styled.div`
  margin: 8px;
  padding: 0px;
  width: 200px;

  flex-grow: 1;
  display: flex,
  flex-direction: column, 
`
export const InsideColumnToolBar = styled.div`
  position: fixed;
  max-width: 250px;
`

const ColumnColor = "#e4e4e4"
export const ColumnContainer = styled.div`
  background: ${props => (props.isDraggingOver ? '#9fa8da' : ColumnColor)}; 
  box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.1);

  margin: 8px;

  min-width: 250px;
  max-width: 300px;

  display: flex;
  flex-direction: column;
  flew-grow: 1;
`;
export const WishlistContainer = styled.div`
  background: ${props => (props.isDraggingOver ? '#ffd54f' : '#fbfbfb')};
  
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

const ItemPadding = "8px";
export const ItemContainer = styled.div`
  border-radius: 8px;
  background: ${props => (props.isDragging ? '#99d3d5' : '#C5CACF')};

  font-family: "Montserrat";
  font-size: 10px;
  
  padding-bottom: 8px;
  padding-left: ${ItemPadding};
  padding-right: ${ItemPadding};

  margin-top: 0px;
  margin-bottom: ${itemPadding + "px"};
  margin-right: 8px;
  margin-left: 5px;
  
  min-height: 35px;
  height: ${props => props.itemDuration * durationMultiplier - itemPadding + "px"};

  overflow: hidden; 
  text-overflow: ellipsis;
`;
export const ItemTitle = styled.div`
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  background: #f7f7f7;

  font-family: "Montserrat";
  font-weight: 600;
  font-size: 11px;

  padding: 8px;

  margin-bottom: 6px;
  margin-right: -${ItemPadding};
  margin-left: -${ItemPadding};

  min-height: 30px;
`
export const ItemBody = styled.div`
  margin: 8px;
  font-family: "Roboto";
  text-overflow: ellipsis;
`
export const WishlistItemContainer = styled.div`
  border-radius: 5px;
  background: ${props => (props.isDragging ? '#ffd740' : '#FFC300')};
  
  padding: 8px;
  min-height: 30px;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;

  font-family: "Montserrat";
  font-weight: 600;
  font-size: 11px; 

  color: "#F1F1F1";

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
const InvalidNotchColor = "#C2C2C2"
export const Ruler = styled.div`
  width: 30px;
  margin-left: 5px;
  margin-bottom: 5px;
  background: ${props => (props.isDraggingOver ? '#9fa8da' : InvalidNotchColor)};
  color: ${props => (props.isDraggingOver ? '#9575cd' : '#546e7a')};
`;
export const RulerNotch = styled.div`
  height: ${durationMultiplier + "px"};
  background: ${props => (props.isDraggingOver ? '#9fa8da' : ColumnColor)};
  font-size: 10px;
  
  padding: 2px;
`;
export const EmptyRulerNotch = styled.div`
  height: ${durationMultiplier + "px"};
  background: ${props => (props.isDraggingOver ? '#7986cb' : InvalidNotchColor)};
  font-size: 10px;
  margin-top: -10px;
  
  padding: 2px;
`;