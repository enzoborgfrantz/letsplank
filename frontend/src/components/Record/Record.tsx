import React from "react";
import styled from "styled-components";
import { Trophy } from "@styled-icons/entypo/Trophy";

import { primary, secondary } from "../../shared/colous";

const Row = styled.div`
  background-color: #f3f3f3;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${primary};
  border-radius: 4px;
`;

const Title = styled.span`
  margin-bottom: 5px;
  font-family: Questrial;
  color: ${primary};
  font-size: 13px;
`;

interface RecordProps {
  title: string;
  currentRecord: string;
}

const SuccessIcon = styled(Trophy)`
  color: ${secondary};
  width: 25px;
  height: 25px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-right: 5px;
`;

export const Record = ({ title, currentRecord }: RecordProps) => (
  <Row>
    <Column>
      <Title>
        {title}
        <b>{" " + currentRecord}</b>
      </Title>
      <ProgressBar />
    </Column>
    <SuccessIcon />
  </Row>
);
