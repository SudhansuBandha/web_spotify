import React, { useEffect } from "react";
import tokenGenerator from "./tokenGenerator";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "../axios";

function HomePage() {
  const history = useHistory();

  const login = () => {
    const token = tokenGenerator();
    sessionStorage.setItem("token", token);
    axiosInstance(
      "/spotify/get-auth-url" + "?code=" + sessionStorage.getItem("token")
    ).then((response) => {
      console.log(response);
      if (response !== null) window.location.replace(response.data.url);
    });
  };

  useEffect(() => {
    axiosInstance(
      "/spotify/is-authenticated?code=" + sessionStorage.getItem("token")
    );
    if (
      sessionStorage.getItem("token") !== null &&
      sessionStorage.getItem("access-token") !== null &&
      sessionStorage.getItem("refresh-token") !== null
    ) {
      history.push(`/loggedin`);
    }
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} align="center">
        <Typography variant="h3" compact="h3">
          House Party
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
          <Button color="primary" onClick={login}>
            Login To Spotify
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default HomePage;
