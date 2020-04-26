import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Timer } from "./components/Timer";
import { Profile } from "./components/Profile";
import { GoogleApiProvider, GoogleAuthProvider } from "./shared/hooks";

function App() {
  return (
    <GoogleApiProvider>
      <GoogleAuthProvider>
        <div className="App">
          <header className="App-header">
            <Profile />
            <Timer />
          </header>
        </div>
      </GoogleAuthProvider>
    </GoogleApiProvider>
  );
}

export default App;
