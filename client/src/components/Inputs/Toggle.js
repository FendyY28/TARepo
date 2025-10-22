import React from "react";
import { FormGroup, FormControlLabel, Switch } from "@mui/material";

const Toggle = ({
  label,
  name,
  required = false,
  onChange,
  onboardingData,
}) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            aria-label={label}
            name={name}
            checked={onboardingData?.[name] || false}
            onChange={(event) => onChange(event, "checkbox")}
            required={required}
            color="primary"
          />
        }
        label={label}
      />
    </FormGroup>
  );
};

export default Toggle;
