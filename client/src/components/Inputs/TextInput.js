import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({
  label,
  name,
  required = false,
  onChange,
  onboardingData,
  textarea = false,
}) => {
  return (
    <TextField
      aria-label={label}
      label={label}
      name={name}
      type="text"
      required={required}
      value={onboardingData?.[name] || ""}
      onChange={onChange}
      multiline={textarea}
      minRows={4}
    />
  );
};

export default TextInput;
