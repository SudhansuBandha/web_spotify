import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { useRouteMatch, useHistory } from "react-router-dom";
import axiosInstance from "../axios";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room() {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [song, setSong] = useState({});
  const match = useRouteMatch().params.roomCode;
  const history = useHistory();

  const leaveButtonPressed = () => {
    sessionStorage.removeItem("room-code");
    history.push("/");
  };

  const updateShowSettings = () => {
    setShowSettings(!showSettings);
  };

  const fetchRoomDetails = () => {
    axiosInstance.get("/api/get-room" + "?code=" + match).then((res) => {
      setVotesToSkip(res.data.vote_to_skip);
      setGuestCanPause(res.data.guest_can_pause);
      if (sessionStorage.getItem("token") === res.data.host) setIsHost(true);
    });
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={match}
            updateCallback={fetchRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => updateShowSettings()}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  };

  const getCurrentSong = () => {
    axiosInstance(
      "/spotify/current-song?room-code=" + sessionStorage.getItem("room-code")
    ).then((response) => {
      setSong(response.data);
      //console.log(response.data);
    });
  };

  useEffect(() => {
    fetchRoomDetails();
  }, []);
  useEffect(() => {
    getCurrentSong();
  });

  if (showSettings) {
    return renderSettings();
  } else
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {match}
          </Typography>
        </Grid>
        {/* <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {isHost.toString()}
          </Typography>
    </Grid>*/}
        <MusicPlayer song={song} />
        {isHost && (
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateShowSettings()}
            >
              Settings
            </Button>
          </Grid>
        )}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
}

export default Room;
