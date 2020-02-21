import Button from '@material-ui/core/Button';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import ExploreIcon from '@material-ui/icons/Explore';
import ViewDayIcon from '@material-ui/icons/ViewDay';
import { deepPurple, green, red } from '@material-ui/core/colors';

export const PurpleButton = withStyles(theme => ({
  root: {
  	fontSize: 10,
    fontFamily: "Rubik Mono One",
    color: theme.palette.getContrastText(deepPurple[700]),
    backgroundColor: deepPurple[700],
    '&:hover': {
      backgroundColor: deepPurple[800],
      color: deepPurple[600]
    },
  },
}))(Button);

export const BlueButton = withStyles(theme => ({
  root: {
    fontSize: 10,
    fontFamily: "Rubik Mono One",
    color: "#eaebeb",
    backgroundColor: "#0BA1BC",
    '&:hover': {
      backgroundColor: "#0a91a9",
      color: "#0a91a9",
    },
  },
}))(Button);

export const GreenButton = withStyles(theme => ({
  root: {
    fontSize: 10,
    fontFamily: "Rubik Mono One",
    color: theme.palette.getContrastText(green[700]),
    backgroundColor: green[700],
    '&:hover': {
      backgroundColor: green[800],
      color: green[600]
    },
  },
}))(Button);

export const RedButton = withStyles(theme => ({
  root: {
    fontSize: 10,
    fontFamily: "Rubik Mono One",
    color: theme.palette.getContrastText(red[700]),
    backgroundColor: red[700],
    '&:hover': {
      backgroundColor: red[800],
      color: red[600]
    },
  },
}))(Button);