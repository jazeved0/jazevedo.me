import React, { useState } from "react";
import styled from "@emotion/styled";

import { useInitialRender, useMediaQuery } from "../hooks";
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

    @media (hover: hover) {
      & > span.tap-label {
        display: none;
      }
    }
    @media (hover: none) {
      & > span.hover-label {
        display: none;
      }
    }
  `,
  SpoilerText: styled.span``,
};

export type EmailSpoilerProps = {
  email: React.ReactNode;
};

/**
 * Shows the email upon hover in a wrapper div,
 * in hopes of preventing spam crawlers.
 */
export default function EmailSpoiler({
  email,
}: EmailSpoilerProps): React.ReactElement {
  const [mouseOver, setMouseOver] = useState(false);
  const hasHover = useMediaQuery("(hover: hover)");

  // Prevent hydration mismatch
  const initialRender = useInitialRender();
  const derivedHasHover = initialRender ? true : hasHover;

  return (
    <Styled.SpoilerWrapper
      tabIndex={0}
      onMouseEnter={(): void => {
        if (derivedHasHover) setMouseOver(true);
      }}
      onMouseLeave={(): void => {
        if (derivedHasHover) setMouseOver(false);
      }}
      onClick={(): void => {
        if (!derivedHasHover) setMouseOver(true);
      }}
      onFocus={(): void => setMouseOver(true)}
      onBlur={(): void => setMouseOver(false)}
    >
      {!mouseOver && (
        <Styled.SpoilerLabel>
          <span className="hover-label" aria-hidden={!derivedHasHover}>
            Hover
          </span>
          <span className="tap-label" aria-hidden={derivedHasHover}>
            Tap
          </span>{" "}
          to show email
          <noscript>
            {/* Use an inner <span> element to work around bug in React:
                https://github.com/facebook/react/issues/25969 */}
            <span> (this won&apos;t work without JavaScript)</span>
          </noscript>
        </Styled.SpoilerLabel>
      )}
      {mouseOver && <Styled.SpoilerText>{email}</Styled.SpoilerText>}
    </Styled.SpoilerWrapper>
  );
}
