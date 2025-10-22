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

  const [onboardingForm, setOnboardingForm] = useState({ isFetching: true, steps: [] });
  const [onboardingData, setOnboardingData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchOnboardingFormData = async () => {
      setOnboardingForm((prev) => ({ ...prev, isFetching: true, steps: [] }));
      try {
        const { data } = await axios.get("/api/onboarding");
        setOnboardingForm(data);
      } catch (error) {
        console.error(error);
        // If user already filled Onboarding -> User will go to home page
        if (error.response?.status === 403) {
          navigate("/home"); 
        }
      } finally {
        setOnboardingForm((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchOnboardingFormData();
  }, [navigate]);

  const onInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setOnboardingData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveOnboarding = async () => {
    // Prepare data payload
    const stepsPayload = Object.keys(onboardingData).map((key) => ({
      name: key,
      value: onboardingData[key],
    }));

    try {
      // Send data to backend
      await axios.post("/api/onboarding", { steps: stepsPayload });

      // Navigate only on success
      navigate("/home", { state: { onboarding: true } });

    } catch (err) {
      // Handle backend errors
      console.error("Failed to save onboarding:", err);
      alert(err.response?.data?.error || "An error occurred while saving your data.");
    }
  };

  const handleNext = () => {
    if (currentStep < onboardingForm.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    const currentFields = onboardingForm.steps[currentStep];
    if (!currentFields) return false;

    const requiredFields = currentFields.filter(field => field.required);

    return requiredFields.every(field => {
      const value = onboardingData[field.name];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const renderField = (field) => {
    const commonProps = {
      label: field.label,
      name: field.name,
      required: field.required,
      onboardingData: onboardingData,
      onChange: onInputChange,
    };

    switch (field.type) {
      case "text":
        return <TextInput {...commonProps} />;
      case "multiline-text":
        return <TextInput {...commonProps} textarea={true} />;
      case "yes-no":
        return <Toggle {...commonProps} />;
      default:
        console.warn(`Unknown field type: ${field.type}`);
        return null;
    }
  };

  if (onboardingForm?.isFetching) {
    return <div>Loading...</div>;
  }

  const totalSteps = onboardingForm.steps.length;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;
  const canProceed = isStepComplete();

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Paper sx={{
        padding: 5,
        backgroundColor: "#F7F9FD",
        width: '30%',
      }}>

        {onboardingForm.steps[currentStep]?.map(field => (
          <FormControl key={field.name} fullWidth sx={{ p: 2 }}>
            {renderField(field)}
          </FormControl>
        ))}

        <FormControl fullWidth sx={{ p: 2, mt: 2 }}>
          {!canProceed && (
            <Typography sx={{ color: 'red', mb: 2 }}>
              Please fill all the required fields before proceeding.
            </Typography>
          )}

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {!isFirstStep && (
                <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
                  Back
                </Button>
              )}
            </Grid>
            <Grid item>
              {!isLastStep && (
                <Button variant="contained" onClick={handleNext} disabled={!canProceed}>
                  Next
                </Button>
              )}
              {isLastStep && (
                <Button variant="contained" onClick={saveOnboarding} disabled={!canProceed}>
                  Finish
                </Button>
              )}
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </Grid>
  );
};

export default Onboarding;
