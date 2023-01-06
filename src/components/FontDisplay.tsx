import React from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { down, up } from "../theme/media";
import { color } from "../theme/color";
import { shadow } from "../theme/shadows";
import { gap } from "../theme/spacing";

const Styled = {
  FontDisplay: styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
    --gap: ${gap.milli};
    --padding: ${gap.micro};
    gap: var(--gap);
    padding: var(--padding);

    ${down("md")} {
      --padding: ${gap.nano};
    }

    background-color: ${color("bg+15")};
    border-radius: 8px;
    box-shadow: ${shadow("z2")};

    /* When forced-colors are enabled, manually add a border
    (the color is ignored) */
    @media (forced-colors: active) {
      border: 1px solid white;
    }
  `,
  Font: styled.div`
    width: 100%;
    ${up("md")} {
      &.desktop-half-width {
        width: calc(50% - var(--gap) / 2);
      }
    }
  `,
  FontName: styled.p`
    font-size: 2.5rem;
    font-weight: 400;
    /* HACK: increase specificity to override the Article styling */
    &:not(#__increase_specificity) {
      margin-bottom: -0.1rem;
    }
    /* Bump font name up, since fonts tend to have large upper space */
    margin-top: -0.8rem;
  `,
  Role: styled.p`
    font-size: 1.2rem;
    line-height: 1.2;
    color: ${color("text-strong")};
    /* HACK: increase specificity to override the Article styling */
    &:not(#__increase_specificity) {
      margin-bottom: ${gap.pico};
    }
  `,
  Example: styled.div`
    &,
    & h1,
    & h2,
    & h3,
    & h4,
    & h5,
    & h6,
    & p {
      font-family: var(--font-family);
    }

    & > :last-child {
      margin-bottom: 0;
    }
  `,
};

export type FontDisplayProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Container for multiple `<FontDisplay.Font />` components.
 */
function FontDisplay({
  children,
  className,
  style,
}: FontDisplayProps): React.ReactElement {
  return (
    <Styled.FontDisplay className={className} style={style}>
      {children}
    </Styled.FontDisplay>
  );
}

// Set up and export the aggregate (parent & sub-components):
type FontDisplayAggregateType = typeof FontDisplay & {
  Font: typeof Font;
};
const FontDisplayAggregate: FontDisplayAggregateType =
  FontDisplay as FontDisplayAggregateType;
FontDisplayAggregate.Font = Font;
export default FontDisplayAggregate;

// ? --------------
// ? Sub Components
// ? --------------

export type FontProps = {
  fontFamily: string;
  name: string;
  role: string;
  link: string;
  children: React.ReactNode;
  halfWidthOnDesktop?: boolean;
  className?: string;
  style?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
  exampleStyle?: React.CSSProperties;
};

/**
 * Component used to display a font, its name/role, and an example of it,
 * as an example of a font for a design system.
 */
function Font({
  fontFamily,
  name,
  role,
  link,
  children,
  halfWidthOnDesktop,
  className,
  style,
  nameStyle,
  exampleStyle,
}: FontProps): React.ReactElement {
  return (
    <Styled.Font
      className={classNames(className, {
        "desktop-half-width": halfWidthOnDesktop,
      })}
      style={style}
    >
      <Styled.Role>
        <a href={link} rel="noopener noreferrer">
          {name}
        </a>{" "}
        – {role}
      </Styled.Role>
      <Styled.FontName style={{ fontFamily, ...nameStyle }}>
        {name}
      </Styled.FontName>
      <Styled.Example
        style={
          {
            "--font-family": fontFamily,
            ...exampleStyle,
          } as React.CSSProperties
        }
      >
        {children}
      </Styled.Example>
    </Styled.Font>
  );
}
