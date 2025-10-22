import React from 'react';
import { Button, Snackbar } from '@mui/material';
import Close from '@mui/icons-material/Close';

const SnackbarError = ({ setSnackBarOpen, errorMessage, snackBarOpen }) => {
  return (
    <Snackbar
      open={snackBarOpen}
      onClose={() => setSnackBarOpen(false)}
      message={errorMessage || 'Sorry, an error occurred. Please try again'}
      action={
        <Button
          size="small"
          onClick={() => setSnackBarOpen(false)}
          sx={{
            color: 'white',
          }}
        >
          <Close color="secondary" />
        </Button>
      }
      ContentProps={{
        sx: {
          backgroundColor: 'red', 
          fontWeight: 'bold', 
        },
      }}
    />
  );
};

export default SnackbarError;