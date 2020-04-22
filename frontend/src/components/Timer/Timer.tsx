import React, { useState } from "react";
import styled from "styled-components";
import format from "date-fns/format";

let timer: number;

enum State {
  Initial = "initial",
  Running = "running",
  Finished = "finished",
}

export const Timer = () => {
  const [state, setState] = useState(State.Initial);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const startTimer = () => {
    setState(State.Running);
    const startTime = Date.now();
    timer = window.setInterval(() => {
      setTimeElapsed(Date.now() - startTime);
    }, 1);
  };

  const stopTimer = () => {
    setState(State.Finished);
    clearInterval(timer);
  };

  const submitResult = () => {
    alert("new result: " + timeElapsed);
  };

  return (
    <div>
      {state === State.Initial && (
        <>
          <p>{format(timeElapsed, "mm:ss")}</p>
          <button onClick={startTimer}>start</button>
        </>
      )}
      {state === State.Running && (
        <>
          <p>{format(timeElapsed, "mm:ss")}</p>
          <button onClick={stopTimer}>stop</button>
        </>
      )}
      {state === State.Finished && (
        <>
          <p>{format(timeElapsed, "mm:ss")}</p>
          <button onClick={submitResult}>submit</button>
        </>
      )}
    </div>
  );
};
