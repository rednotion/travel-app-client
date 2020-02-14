import styled from 'styled-components';

export const AlignPanels = styled.div`
  	display: flex;
  	flex-direction: row;

`;

export const Panel = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 5px;
	background: #f1f4f3;

	width: 300px;
	flex-grow: 1;
`;

export const BackgroundPanel = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 5px;
	background: #f1f4f3;

	flex-grow: 1;
`;

export const PanelTitle = styled.h3`
	margin-top: 0px;
	padding: 1px;
	font-family: "Open Sans", sans-serif;
	font-weight: bold;
`;

export const PanelSubtitle = styled.h4`
	margin-top: 20px;
	padding: 5px;
	font-family: "Open Sans", sans-serif;
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

export const InvisiblePanelFixed = styled.div`
	margin: 8px;
	padding-top: 12px;
	padding-right: 20px;
	padding-left: 20px;
	padding-bottom: 20px;

	border-radius: 5px;

	width: 300px;
`;