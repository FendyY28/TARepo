import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Typography, Box } from "@mui/material";

const Home = ({ user, logout }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) navigate("/login");
      else navigate("/register");
    }
  }, [user, navigate, isLoggedIn]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <Box sx={{ padding: 8 }}>
      <Typography variant="h4">Home Page</Typography>
      <Grid container>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Logout
        </Button>
      </Grid>
    </Box>
  );
};

export default Home;