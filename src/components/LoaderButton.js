import React from "react";

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { teal, grey } from '@material-ui/core/colors';


const FormSubmitButton = withStyles(theme => ({
  root: {
    fontSize: 12,
    marginRight: 10,
    height: 50,
    fontFamily: "Rubik Mono One",
    color: theme.palette.getContrastText(teal[700]),
    backgroundColor: teal[700],
    '&:hover': {
      backgroundColor: teal[800],
      color: teal[600]
    },
  },
}))(Button);

const FormDisabledButton = withStyles(theme => ({
  root: {
    fontSize: 12,
    marginRight: 10,
    fontFamily: "Rubik Mono One",
    height: 50,
    color: theme.palette.getContrastText(grey[700]),
    backgroundColor: grey[700],
    '&:hover': {
      backgroundColor: grey[700],
      color: theme.palette.getContrastText(grey[700])
    },
  },
}))(Button);


export default function LoaderButton(isLoading, disabled = false, text = "") {
  return (
    (!disabled)
    ? 
      <FormSubmitButton fullWidth type="submit">
        {isLoading && <><CircularProgress color="" size="2rem" />&nbsp;&nbsp;</>}
        {text}
      </FormSubmitButton>
    : 
      <FormDisabledButton fullWidth type="submit">
       {text}
      </FormDisabledButton>
  );
}

