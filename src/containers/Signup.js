import React, { useState } from "react";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import { Auth } from "aws-amplify";
import { BackgroundPanel } from "../styles/Pages.js";
import TextField from '@material-ui/core/TextField';

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
    	const newUser = await Auth.signUp({
    		username: fields.email,
    		password: fields.password
    	});
    	setIsLoading(false)
    	setNewUser(newUser);
    } catch(e) {
    	/*This is to catch people who refresh in the middle of the confirmation page*/
    	/*Force them to check for confirmation code again instead of signing up*/
    	if (e.code == 'UsernameExistsException') {
    		Auth.resendSignUp(fields.email)
    		setIsLoading(false)
    		setNewUser("UserExists")
    	} else {
    		alert(e.message);
    		setIsLoading(false)
    	}
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
    	await Auth.confirmSignUp(fields.email, fields.confirmationCode);
    	await Auth.signIn(fields.email, fields.password);

    	props.userHasAuthenticated(true);
    	/*This value is defined in App.js, its the same one we set on Login page */
    	props.history.push("/");
    } catch(e) {
    	alert(e.message);
    	setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
      Please check your email for the code.
        <TextField
            id="confirmationCode"
            InputProps={{style: {fontSize: 16} }}
            fullWidth
            label="Confirmation Code"
            margin="dense"
            variant="filled" 
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
        <p></p>
        {LoaderButton(isLoading, !validateConfirmationForm(), "Verify")}
      </form>
    );
  }

  function renderForm() {
    return (
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
            margin="dense"
            variant="filled" 
            type="password"
            onChange={handleFieldChange}
            value={fields.password}
          />
          <br></br>
          <TextField
            id="confirmPassword"
            InputProps={{style: {fontSize: 16} }}
            fullWidth
            label="Confirm Password"
            margin="dense"
            type="password"
            variant="filled" 
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
          <p></p>
        {LoaderButton(isLoading, !validateForm(), "Signup")}
      </form>
    );
  }

  return (
    <BackgroundPanel>
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
    </BackgroundPanel>
  );
}