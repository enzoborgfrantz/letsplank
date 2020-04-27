import React, { useState } from "react";
import styled from "styled-components";
import format from "date-fns/format";
import { useGoogleAuth } from "../../shared/hooks";
import { secondary } from "../../shared/colous";
import { Record } from "../Record";

let timer: number;

enum State {
  Initial = "initial",
  Running = "running",
  Finished = "finished",
}

const Button = styled.button`
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  color: white;
  font-family: Questrial;
  background-color: ${secondary};
  font-size: 20px;
  border: none;
`;

const Wrapper = styled.div`
  width: 100%;
`;

const Duration = styled.div`
  border-radius: 100px;
  bodrder: 2px solid;
  text-align: center;
  font-size: 70px;
  font-family: Questrial;
  margin: 0;
  margin-bottom: 10px;
`;

const Records = styled.div`
  > * {
    margin-bottom: 8px;
  }
`;

export const Timer = () => {
  const { isUserAuthenticated, userProfile } = useGoogleAuth();
  const [state, setState] = useState(State.Initial);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startTimer = () => {
    setState(State.Running);
    const startTime = Date.now();
    timer = window.setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 10);
  };

  const stopTimer = () => {
    setState(State.Finished);
    clearInterval(timer);
  };

  const submitResult = () => {
    if (!userProfile) {
      return;
    }

    fetch("/plank", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ userId: userProfile.id, durationMS: timeElapsed }),
    }).then(console.log);
  };

  const formattedTimeElapsed = format(timeElapsed, "mm:ss:SS");

  return (
    <Wrapper>
      <Records>
        <Record
          title="Personal Best"
          currentRecord={format(5000, "mm:ss:SS")}
        />
        <Record
          title="Weekly Leaderboard Best"
          currentRecord={format(10000, "mm:ss:SS")}
        />
        <Record
          title="All Time Leaderboard Best"
          currentRecord={format(30000, "mm:ss:SS")}
        />
      </Records>
      <br />
      {state === State.Initial && (
        <>
          <Duration>{formattedTimeElapsed}</Duration>
          <Button onClick={startTimer}>Start</Button>
        </>
      )}
      {state === State.Running && (
        <>
          <Duration>{formattedTimeElapsed}</Duration>
          <Button onClick={stopTimer}>Stop</Button>
        </>
      )}
      {state === State.Finished && (
        <>
          <Duration>{formattedTimeElapsed}</Duration>
          {isUserAuthenticated ? (
            <Button onClick={submitResult}>Submit</Button>
          ) : (
            <span>Please authenticate to submit score</span>
          )}
        </>
      )}
    </Wrapper>
  );
};
