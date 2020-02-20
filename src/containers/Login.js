import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { BackgroundPanel } from "../styles/Pages.js";
import { FieldTitle } from "../styles/Forms.js"
import "./Login.css";

import TextField from '@material-ui/core/TextField';

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      props.userHasAuthenticated(true);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <BackgroundPanel>
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <TextField
            id="email"
            InputProps={{style: {fontSize: 16} }}
            fullWidth
            label="Email"
            margin="dense"
            variant="filled" 
            onChange={handleFieldChange}
            value={fields.email}
          />
          <br></br>
          <TextField
            id="password"
            InputProps={{style: {fontSize: 16} }}
            fullWidth
            label="Password"
            type="password"
            margin="dense"
            variant="filled" 
            onChange={handleFieldChange}
            value={fields.password}
          />
          <p></p>
        {LoaderButton(isLoading, !validateForm(), "Login")}
      </form>
    </div>
    </BackgroundPanel>
  );
}