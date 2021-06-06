import React from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import axiosInstance from "../axios";

function MusicPlayer({ song }) {
  const songProgress = (song.time / song.duration) * 100;

  const pauseSong = () => {
    /*  const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/pause", requestOptions); */
    axiosInstance.put(
      "/spotify/pause?code=" + sessionStorage.getItem("room-code")
    );
  };

  const playSong = () => {
    /* const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/spotify/play", requestOptions); */
    axiosInstance.put(
      "/spotify/play?code=" + sessionStorage.getItem("room-code")
    );
  };
  return (
    <Card>
      <Grid container alignItems="center">
        <Grid item align="center" xs={4}>
          <img src={song.image_url} height="100%" width="100%" />
        </Grid>
        <Grid item align="center" xs={8}>
          <Typography component="h5" variant="h5">
            {song.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {song.artist}
          </Typography>
          <div>
            <IconButton
              onClick={() => {
                song.is_playing ? pauseSong() : playSong();
              }}
            >
              {song.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant="determinate" value={songProgress} />
    </Card>
  );
}

export default MusicPlayer;
