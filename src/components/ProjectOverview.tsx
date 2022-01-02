import React from "react";
import styled from "@emotion/styled";

import { ButtonFragment } from "./LinkButton/schema";
import Button from "./Button";
import Article from "./Article";
import ProjectFields from "./ProjectFields";
import ProjectTopics from "./ProjectTopics";
import { color } from "../theme/color";
import { gap } from "../theme/spacing";

const Styled = {
  Type: styled.h2`
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.95rem;
    font-weight: 400;
    margin-bottom: ${gap.atto};
  `,
  Title: styled.h1`
    font-weight: 700;
    font-size: 2.7rem;
    line-height: 0.95em;
    color: ${color("text-strong")};
    margin-bottom: ${gap.micro};
  `,
  Fields: styled(ProjectFields)`
    margin-bottom: ${gap.micro};
  `,
  Lead: styled(Article)`
    margin-bottom: calc(${gap.micro} + ${gap.pico});
  `,
  Topics: styled(ProjectTopics)`
    margin-bottom: ${gap.milli};
  `,
  ButtonBar: styled.div`
    display: flex;
    flex-direction: row;
    gap: ${gap.nano};
    flex-wrap: wrap;
  `,
};

export type ProjectOverviewProps = {
  type: string;
  title: string;
  start: string;
  end: string | null;
  lead: string;
  mainTopics: string[];
  secondaryTopics: string[];
  buttons: ButtonFragment[];
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Project overview that appears at the top of main project pages
 */
export default function ProjectOverview({
  type,
  title,
  start,
  end,
  lead,
  mainTopics,
  secondaryTopics,
  buttons,
  className,
  style,
}: ProjectOverviewProps): React.ReactElement {
  const fields = [{ label: "Start", value: start }];
  if (end != null) {
    fields.push({ label: "End", value: end });
  }

  return (
    <div className={className} style={style}>
      <Styled.Type>{type}</Styled.Type>
      <Styled.Title>{title}</Styled.Title>
      <Styled.Fields fields={fields} />
      <Styled.Lead>
        {/* `lead` comes from local markdown files,
        and is designed to be able to contain HTML */}
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: lead }} />
      </Styled.Lead>
      <Styled.Topics main={mainTopics} secondary={secondaryTopics} />
      <Styled.ButtonBar>
        {buttons.map((button, i) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Button key={i} {...button} />
        ))}
      </Styled.ButtonBar>
    </div>
  );
}
