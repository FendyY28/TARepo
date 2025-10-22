import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Button,
  FormControl,
  Paper,
  Typography,
} from "@mui/material";
import Toggle from "./Inputs/Toggle";
import TextInput from "./Inputs/TextInput";

const Onboarding = () => {
  const navigate = useNavigate();

  const [onboardingForm, setOnboardingForm] = useState({ isFetching: true });
  const [onboardingData, setOnboardingData] = useState();

  useEffect(() => {
    const fetchOnboardingFormData = async () => {
      setOnboardingForm((prev) => ({ ...prev, isFetching: true }));
      try {
        const { data } = await axios.get("/api/onboarding");
        setOnboardingForm(data);
      } catch (error) {
        console.error(error);
      } finally {
        setOnboardingForm((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchOnboardingFormData();
  }, []);

  const onInputChange = (event, type = "text") => {
    setOnboardingData((prevData) => {
      return {
        ...prevData,
        [event.target.name]:
          type === "checkbox" ? event.target.checked : event.target.value,
      };
    });
  };

  const saveOnboarding = () => {
    navigate("/home", { state: { onboarding: true } });
  };

  const renderButton = (text, onClick) => {
    return (
      <Button
        sx={{
          mt: 4,
          alignContent: 'right',
          bgcolor: '#3A8DFF',
          px: 3.75,
          py: 0.625,
          color: 'white',
          fontSize: '15px',
          '&:disabled': {
            color: 'white',
            fontSize: '15px',
            bgcolor: 'lightgrey',
          },
          '&:hover': {
            bgcolor: '#3A8DFF',
          },
        }}
        type="submit"
        variant="contained"
        size="large"
        onClick={onClick}
        disabled={false}
      >
        {text}
      </Button>
    );
  };

  if (onboardingForm?.isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container justifyContent="center">
      <Paper sx={{
        padding: 5,
        backgroundColor: "#F7F9FD",
        width: '30%',
      }}>
        <FormControl fullWidth sx={{ p: 2 }}>
          <TextInput
            label={"First Name"}
            name={"firstName"}
            required={true}
            onboardingData={onboardingData}
            onChange={onInputChange}
          />
        </FormControl>

        <FormControl fullWidth sx={{ p: 2 }}>
          <TextInput
            label={"Bio"}
            name={"bio"}
            required={true}
            onboardingData={onboardingData}
            onChange={onInputChange}
            textarea={true}
          />
        </FormControl>

        <FormControl fullWidth sx={{ p: 2 }}>
          <Toggle
            label={"I would like to receive updates"}
            name={"receiveUpdates"}
            onChange={onInputChange}
            onboardingData={onboardingData}
          />
        </FormControl>

        <FormControl fullWidth sx={{ p: 2 }}>
          <Typography sx={{ color: 'red' }}>
            Please fill all the required fields before proceeding.
          </Typography>

          <Grid container justifyContent="space-between">
            <Grid item>
              {renderButton("Back")}
              {renderButton("Finish", saveOnboarding)}
              {renderButton("Next")}
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </Grid>
  );
};

export default Onboarding;