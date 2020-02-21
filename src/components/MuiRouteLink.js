import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Typography from '@material-ui/core/Typography';
import { Route, MemoryRouter } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { deepPurple } from '@material-ui/core/colors';
import { withStyles, makeStyles } from '@material-ui/core/styles';

export function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <>{icon}&nbsp;</> : null}
        {primary}
      </ListItem>
    </li>
  );
}

export function AppBarButtonLink(props) {
  const { icon, primary, to } = props;
  const ColorButton = withStyles(theme => ({
    root: {
      fontSize: 12,
      fontFamily: "Rubik Mono One",
      marginRight: 10,
      color: "#eaebeb",
      '&:hover': {
        color: "#F7620C",
      },
    },
  }))(Button);

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
      <ColorButton style={{fontSize: 12}} component={renderLink}>
        {icon ? <>{icon}</> : null}
        {primary}
      </ColorButton>
  );
}

export function ToolbarButtonLink(props) {
  const { icon, primary, to } = props;
  const buttonStyle = {fontSize: 12, marginRight: 10}
  const ColorButton = withStyles(theme => ({
    root: {
      fontSize: 12,
      fontFamily: "Rubik Mono One",
      marginRight: 10,
      color: "#202428",
      backgroundColor: "#F7620C",
      '&:hover': {
        color: "#F7620C",
        backgroundColor: "#121416"
      },
    },
  }))(Button);


  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
      <ColorButton variant="contained" color="primary" style={buttonStyle} 
        component={renderLink}>
        {icon ? <>{icon}&nbsp;</> : null}
        {primary}
      </ColorButton>
  );
}