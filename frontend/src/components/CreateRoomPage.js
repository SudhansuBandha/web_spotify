import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import axiosInstance from "../axios";
import tokenGenerator from "./tokenGenerator";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function CreateRoomPage(props) {
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || 2);

  const [guestCanPause, setGuestCanPause] = useState(true);
  const [update, setUpdate] = useState(props.update || false);
  const [roomCode, setRoomCode] = useState(props.roomCode || null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  let history = useHistory();

  //if (props.guestCanPause !== null) setGuestCanPause(props.guestCanPause);
  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true" ? true : false);
  };
  const handleGuestCanPause = () => {
    if (update) {
      setGuestCanPause(props.guestCanPause);
      console.log(props.guestCanPause);
    }
  };
  const handleRoomButtonPressed = (e) => {
    e.preventDefault();
    const body = {
      guest_can_pause: guestCanPause,
      vote_to_skip: votesToSkip,
      host: sessionStorage.getItem("token"),
    };

    axiosInstance.post("api/create-room", body).then((res) => {
      sessionStorage.setItem("room-code", res.data.code);
      history.push("/room/" + res.data.code);
    });
  };

  const handleUpdateButtonPressed = (e) => {
    e.preventDefault();
    const body = {
      guest_can_pause: guestCanPause,
      vote_to_skip: votesToSkip,
      code: roomCode,
    };
    axiosInstance
      .patch("api/update-room", body)
      .then((res) => {
        if (res.status === 200) {
          setSuccessMsg("Room updated successfully");
          props.updateCallback();
        } else setErrorMsg("Room not found");
      })
      .catch(() => {
        setErrorMsg("Error in updating the room");
      });
  };

  const title = update ? "Update Room" : "Create Room";

  const renderUpdateButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={(e) => {
            handleUpdateButtonPressed(e);
          }}
        >
          Update A Room
        </Button>
      </Grid>
    );
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={1}>
        {" "}
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={(e) => {
              handleRoomButtonPressed(e);
            }}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>{" "}
      </Grid>
    );
  };
  useEffect(() => {
    /*if (sessionStorage.getItem("token") === null) {
      const token = tokenGenerator();
      sessionStorage.setItem("token", token);
    }*/
    handleGuestCanPause();
  }, []);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={errorMsg !== "" || successMsg !== ""}>
          {successMsg !== "" ? (
            <Alert
              severity="success"
              onClose={() => {
                setSuccessMsg("");
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity="error"
              onClose={() => {
                setErrorMsg("");
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>

        <Typography component="h4" variant="h4">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={(e) => {
              handleGuestCanPauseChange(e);
            }}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={(e) => {
              handleVotesChange(e);
            }}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? renderUpdateButton() : renderCreateButtons()}
    </Grid>
  );
}

export default CreateRoomPage;
