import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Timer } from "./components/Timer";
import { Profile } from "./components/Profile";
import { GoogleApiProvider, GoogleAuthProvider } from "./shared/hooks";
import { Logo } from "./components/Logo";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  box-sizing: border-box;
  padding: 10px 15px;
  background-color: #01062a;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
`;

function App() {
  return (
    <GoogleApiProvider>
      <GoogleAuthProvider>
        <Header>
          <Logo />
          <Profile />
        </Header>
        <br />
        <br />
        <div style={{ padding: "0 20px" }}>
          <Timer />
        </div>
        <div className="App">
          <header className="App-header">
            <br />
            <br />
            <br />
          </header>
        </div>
      </GoogleAuthProvider>
    </GoogleApiProvider>
  );
}

export default App;
