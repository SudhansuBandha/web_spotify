import React, { useEffect } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "../axios";

function LoggedIn() {
  const history = useHistory();

  const fetchUserDetails = () => {
    axiosInstance(
      "/spotify/get-user-tokens" + "?code=" + sessionStorage.getItem("token")
    ).then((response) => {
      sessionStorage.setItem("access-token", response.data.access_token);
      sessionStorage.setItem("refresh-token", response.data.refresh_token);
      sessionStorage.setItem("expires-in", response.data.expires_in);
      sessionStorage.setItem("token-type", response.data.token_type);
    });
  };

  const logout = () => {
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("refresh-token");
    sessionStorage.removeItem("expires-in");
    sessionStorage.removeItem("token-type");
    history.push("/");
  };

  useEffect(() => {
    if (sessionStorage.getItem("room-code") !== null) {
      history.push(`/room/${sessionStorage.getItem("room-code")}`);
    }
    fetchUserDetails();
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
          <Button color="primary" to="/join" component={Link}>
            Join a Room
          </Button>
          <Button color="default" to="/info" component={Link}>
            Info
          </Button>
          <Button color="secondary" to="/create" component={Link}>
            Create a Room
          </Button>
          <Button color="error" onClick={logout}>
            LogOut
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
}

export default LoggedIn;
