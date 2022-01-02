import React from "react";
import styled from "@emotion/styled";

import { gap } from "../theme/spacing";
import { color } from "../theme/color";

const Styled = {
  ProjectFields: styled.div`
    display: flex;
    flex-direction: row;
    gap: ${gap.milli};
    flex-wrap: wrap;
  `,
  FieldLabel: styled.p`
    opacity: 0.65;
    margin-bottom: -4px;
  `,
  FieldValue: styled.p`
    font-size: 1.1rem;
    color: ${color("text-strong")};
  `,
};

export type Field = {
  label: string;
  value: string;
};

export type ProjectFieldsProps = {
  fields: Field[];
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Row of fields in a project overview,
 * each consisting of a label and value.
 * Used for start/end dates.
 */
export default function ProjectFields({
  fields,
  className,
  style,
}: ProjectFieldsProps): React.ReactElement {
  return (
    <Styled.ProjectFields className={className} style={style}>
      {fields.map(({ label, value }, i) => (
        <div key={i}>
          <Styled.FieldLabel>{label}</Styled.FieldLabel>
          <Styled.FieldValue>{value}</Styled.FieldValue>
        </div>
      ))}
    </Styled.ProjectFields>
  );
}
