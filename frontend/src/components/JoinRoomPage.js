import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "../axios";
import tokenGenerator from "./tokenGenerator";

function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const history = useHistory();

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed = (e) => {
    e.preventDefault();
    const body = {
      code: roomCode,
    };
    axiosInstance
      .post("/api/join-room", body)
      .then((res) => {
        if (res.status === 200) {
          sessionStorage.setItem("room-code", roomCode);
          history.push(`/room/${roomCode}`);
        } else {
          setError("Room not found");
          setRoomCode("");
        }
      })
      .catch((err) => {
        console.log(err);
        setError("Connectivity Issue");
        setRoomCode("");
      });
  };

  useEffect(() => {
    const roomCode = sessionStorage.getItem("room-code");
    if (roomCode !== null) history.push(`/room/${roomCode}`);
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <TextField
          error={error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={(e) => {
            handleTextFieldChange(e);
          }}
        />
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            roomButtonPressed(e);
          }}
        >
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default JoinRoomPage;
