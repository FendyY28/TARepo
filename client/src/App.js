import React from "react";
import { ThemeProvider, StyledEngineProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { theme } from "./themes/theme";
import AppRoutes from "./routes";
import axios from "axios";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
