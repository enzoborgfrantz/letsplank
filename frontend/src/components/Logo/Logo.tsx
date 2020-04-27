import React from "react";
import styled from "styled-components";
import { primary, secondary } from "../../shared/colous";

const Plank = styled.div`
  font-family: Questrial;
  color: white;
  border-bottom: 2px solid ${secondary};
  transform: rotate(-10deg);
  padding-right: 4px;
  padding-bottom: 4px;
  &::before {
    position: absolute;
    content: "";
    border-radius: 100px;
    width: 10px;
    height: 10px;
    background-color: ${secondary};
    right: -10px;
    bottom: -5px;
  }
  &::after {
    border: 2px solid #f51b28;
    content: "";
    position: absolute;
    bottom: -16px;
    width: 8px;
    height: 13px;
    border-top: none;
    border-right: none;
    transform: rotate(10deg);
    right: -7px;
  }
`;

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 11px 20px 17px 10px;
`;
// const Text = styled.span``;

export const Logo = () => (
  <Wrapper>
    <Plank>LetsPlank</Plank>
  </Wrapper>
);
