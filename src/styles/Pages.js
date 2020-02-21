import styled from 'styled-components';

export const Logo = styled.span`
	font-family: "Lacquer";
	font-weight: bold;
	font-size: 25px;
`

export const BelowAppBar = styled.div`
	margin-top: 60px;
`

export const AlignPanels = styled.div`
  	display: flex;
  	flex-direction: row;

`;

export const LocationField = styled.div`
	z-index: 2000;
`

export const Padding20 = styled.div`
	padding: 20px;
`

export const Panel = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 0px;
	background: #f1f4f3;
	box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);

	z-index: 1000;

	width: 300px;
	flex-grow: 1;
`;

export const BackgroundPanel = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 0px;
	background: #f1f4f3;
	box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.3);

	flex-grow: 1;
`;

export const PanelTitle = styled.h3`
	margin-top: 0px;
	padding: 1px;
	font-family: "Roboto";
	font-weight: bold;
`;

export const PanelSubtitle = styled.h4`
	margin-top: 20px;
	padding: 5px;
	font-family: "Roboto", sans-serif;
	font-weight: bold;
`;

export const InvisiblePanel = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 5px;

	width: 200px;
	flex-grow: 1;
`;

export const InvisibleColumnLeft = styled.div`
	margin: 0px;
	padding-right: 4px;

	flex-grow: 1;
`;

export const InvisibleColumnRight = styled.div`
	margin: 0px;
	padding-left: 4px;

	flex-grow: 1;
`;


export const InvisiblePanelFixed = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	font-family: "Roboto";
	border-radius: 5px;

	width: 300px;
`;