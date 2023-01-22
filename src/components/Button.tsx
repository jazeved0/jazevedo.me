import React from "react";
import styled from "@emotion/styled";
import { rgba } from "polished";
import classNames from "classnames";

import { color } from "../theme/color";
import { shadow } from "../theme/shadows";
import LinkButton from "./LinkButton";
import type { LinkButtonProps } from "./LinkButton/LinkButton";

const Styled = {
  Button: styled(LinkButton)`
    position: relative;
    text-decoration: none;
    border-radius: 4px;

    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    svg {
      display: block !important;
    }

    box-shadow: ${shadow("z1")};
    --highlight-bg: transparent;
    --border-size: 0px;

    &.variant-solid {
      background-color: ${color("primary")};
      color: ${color("light")};

      &:hover {
        --highlight-bg: ${color("primary+10")};
      }

      &:active {
        --highlight-bg: ${color("primary-10")};
      }
    }

    &.variant-hollow {
      background-color: ${rgba(color("light"), 0.1)};
      color: ${color("text-strong")};
      --border-size: 2px;

      &:hover {
        --highlight-bg: ${rgba(color("light"), 0.1)};
      }

      &:active {
        --highlight-bg: ${rgba(color("light"), 0.2)};
      }
    }

    padding-top: calc(var(--y-padding) - calc(var(--border-size) * 2));
    padding-bottom: calc(var(--y-padding) - calc(var(--border-size) * 2));
    padding-left: calc(var(--x-padding) - calc(var(--border-size) * 2));
    padding-right: calc(var(--x-padding) - calc(var(--border-size) * 2));
    border: var(--border-size) solid ${color("primary")};

    &:hover {
      box-shadow: ${shadow("z2")};
    }

    &:active {
      box-shadow: ${shadow("z0")};
    }

    /* Use an absolutely positioned pseudo-element
    that animates between transparent and opaque
    to simulate the <Button> having a background color transition
    without creating an ugly transition upon changing themes */
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      content: " ";
      transition: 0.1s background-color linear;
      background-color: var(--highlight-bg);
      border-radius: 4px;
      z-index: 0;
    }

    & > * {
      /* Ensure the pseudo-element is positioned below the content
      by creating a new stacking context for the content.
      This relies on always wrapping children in a span.
      We do this manually in <Button> for direct children,
      and for <LinkButton>, the text and icon props
      automatically get wrapped */
      position: relative;
    }

    /* When forced-colors are enabled, add a border to improve the contrast
    of the hit target (the color is ignored). Additionally, add an underline on
    hover to improve the readability of the states. */
    @media (forced-colors: active) {
      border: 2px solid white;

      &:hover,
      &:active {
        text-decoration: underline;
      }
    }
  `,
};

export type ButtonSize = "small" | "regular";

/**
 * Style to apply to a <Button> based on its size.
 *
 * This is applied automatically by <Button> based on the `size` prop.
 * These are also exported so that they can be used by other components
 * in advanced selectors.
 */
export const buttonSizeStyles: Record<
  ButtonSize,
  // Use `Record<string, CSSProperties[keyof CSSProperties]>` instead of
  // `CSSProperties` because the latter doesn't allow for CSS custom variable
  // properties (`--*`):
  Record<string, React.CSSProperties[keyof React.CSSProperties]>
> = {
  small: {
    "--x-padding": "10px",
    "--y-padding": "6px",
    fontSize: "0.75rem",
  },
  regular: {
    "--x-padding": "15px",
    "--y-padding": "8px",
  },
};

export type ButtonProps = LinkButtonProps & {
  variant?: "solid" | "hollow" | null;
  size?: "small" | "regular";
};

/**
 * Styled `<LinkButton>` component that looks like a traditional button
 */
export default function Button({
  variant,
  className,
  children,
  style,
  ...rest
}: ButtonProps): React.ReactElement {
  // Manually wrap any text nodes with a <span> element
  // to ensure that the pseudo-element stacking order works.
  const derivedChildren = React.Children.map(
    children,
    (child): React.ReactNode => {
      if (typeof child === "string") return <span>{child}</span>;
      return child;
    }
  );

  return (
    <Styled.Button
      className={classNames(className, `variant-${variant ?? "solid"}`)}
      style={{
        ...buttonSizeStyles[rest.size ?? "regular"],
        ...style,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      {derivedChildren}
    </Styled.Button>
  );
}
