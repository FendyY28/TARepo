import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
} from "@mui/material";

const Login = ({ user, login }) => {
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formElements = form.elements;
    const username = formElements.username.value;
    const password = formElements.password.value;

    await login({ username, password });
  };

  useEffect(() => {
    if (user && user.id) navigate("/onboarding");
  }, [user, navigate]);

  return (
    <Grid container justifyContent="center">
      <Box>
        <Grid container item>
          <Typography>Need to register?</Typography>
          <Link href="/register" to="/register">
            <Button>Register</Button>
          </Link>
        </Grid>
        <form onSubmit={handleLogin}>
          <Grid>
            <Grid>
              <FormControl margin="normal" required>
                <TextField
                  aria-label="username"
                  label="Username"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Grid>
            <FormControl margin="normal" required>
              <TextField
                label="password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Grid>
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Grid>
  );
};

export default Login;
