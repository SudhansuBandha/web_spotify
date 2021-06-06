import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import JoinRoomPage from "./components/JoinRoomPage";
import CreateRoomPage from "./components/CreateRoomPage";
import Room from "./components/Room";
import HomePage from "./components/HomePage";
import Info from "./components/Info";
import LoggedIn from "./components/LoggedIn";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/loggedin" component={LoggedIn} />
          <Route path="/info" component={Info} />
          <Route path="/join" component={JoinRoomPage} />
          <Route path="/create" component={CreateRoomPage} />
          <Route path="/room/:roomCode" component={Room} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
