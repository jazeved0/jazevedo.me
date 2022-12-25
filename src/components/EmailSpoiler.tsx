import styled from "@emotion/styled";
import React, { useState } from "react";

import { highlight, strongHighlight } from "../theme/mixins";

const Styled = {
  SpoilerWrapper: styled.span`
    /* When forced-colors are enabled, add a border to improve the contrast
    of the hit target (the color is ignored) */
    @media (forced-colors: active) {
      border: 2px solid white;
      padding: 2px 6px 3px;
      border-radius: 4px;
    }
  `,
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
