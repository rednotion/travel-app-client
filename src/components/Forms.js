import React, { useState, useEffect } from "react";
import { FormGroup, FormControl, ControlLabel, Glyphicon, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export function formField(title, id, field, type, changeFunction) {
    return(
        <FormGroup controlId={id} bsSize="small">
          <ControlLabel>{title}</ControlLabel>
          <FormControl
            type={type}
            onChange={changeFunction}
            value={field}
          />
        </FormGroup>
      );
}