import styled from "@emotion/styled";
import React, { useState } from "react";

import { highlight, strongHighlight } from "../theme/mixins";

const Styled = {
  SpoilerWrapper: styled.span``,
  SpoilerLabel: styled.span`
    ${highlight}
    &:hover,
    &:active {
      ${strongHighlight}
    }

    background-color: var(--highlight-color);
  `,
  SpoilerText: styled.span``,
};

export type EmailSpoilerProps = {
  email: string;
};

/**
 * Shows the email upon hover in a wrapper div,
 * in hopes of preventing spam crawlers.
 */
export default function EmailSpoiler({
  email,
}: EmailSpoilerProps): React.ReactElement {
  const [mouseOver, setMouseOver] = useState(false);
  return (
    <Styled.SpoilerWrapper
      onMouseEnter={(): void => setMouseOver(true)}
      onMouseLeave={(): void => setMouseOver(false)}
      onFocus={(): void => setMouseOver(true)}
      tabIndex={0}
    >
      {!mouseOver && (
        <Styled.SpoilerLabel>Hover to show email</Styled.SpoilerLabel>
      )}
      {mouseOver && <Styled.SpoilerText>{email}</Styled.SpoilerText>}
    </Styled.SpoilerWrapper>
  );
}
