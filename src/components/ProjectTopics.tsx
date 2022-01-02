import React from "react";
import styled from "@emotion/styled";

import Topic from "./Topic";
import { gap } from "../theme/spacing";

const Styled = {
  ProjectTopics: styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${gap.femto};
  `,
};

export type ProjectTopicsProps = {
  main?: string[];
  secondary?: string[];
  className?: string;
  style?: React.CSSProperties;
};

/**
 * List of topics, split into "main" and "secondary",
 * each represented with a pill in a horizontal, wrapping flexbox.
 */
export default function ProjectTopics({
  main = [],
  secondary = [],
  className,
  style,
}: ProjectTopicsProps): React.ReactElement {
  return (
    <Styled.ProjectTopics className={className} style={style}>
      {main.map((mainTopic) => (
        <Topic variant="filled" key={mainTopic}>
          {mainTopic}
        </Topic>
      ))}
      {secondary.map((secondaryTopic) => (
        <Topic variant="hollow" key={secondaryTopic}>
          {secondaryTopic}
        </Topic>
      ))}
    </Styled.ProjectTopics>
  );
}
