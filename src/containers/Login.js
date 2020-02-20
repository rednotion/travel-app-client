import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { BackgroundPanel } from "../styles/Pages.js";
import { FieldTitle } from "../styles/Forms.js"
import "./Login.css";

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
        <FormGroup controlId="email" bsSize="large">
          <FieldTitle>Email</FieldTitle>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FieldTitle>Password</FieldTitle>
          <FormControl
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </form>
    </div>
    </BackgroundPanel>
  );
}