import React, { useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { useStaticQuery, graphql, Link } from "gatsby";
import { darken, lighten } from "polished";

import type { ButtonFragment } from "./LinkButton/schema";
import LinkButton from "./LinkButton/LinkButton";
import {
  color,
  ColorMode,
  ColorModeContext,
  hybridColor,
  mode,
} from "../theme/color";
import BrandSvg from "../images/brand.inline.svg";
import { useInitialRender } from "../hooks";
import { container } from "../theme/layout";
import { gap } from "../theme/spacing";
import Switch from "./Switch";
import Icon from "./Icon";
import { down } from "../theme/media";

const linkCommonStyle = `
  text-decoration: none;
  color: ${color("text-strong")};
  white-space: nowrap;

  &:hover,
  &:active {
    ${mode(ColorMode.Dark)} {
      color: ${lighten(0.3, hybridColor("primary", ColorMode.Dark))};
    }

    ${mode(ColorMode.Light)} {
      color: ${darken(0.1, hybridColor("primary", ColorMode.Light))};
    }
  }
`;

const Styled = {
  HeaderOuter: styled.div`
    &:not([data-no-container="true"]) {
      ${container}
    }
    &[data-no-container="true"] {
      padding-left: var(--site-padding);
      padding-right: var(--site-padding);
    }

    &[data-spacing="sparse"] {
      padding-top: ${gap.milli};
      padding-bottom: ${gap.milli};
    }

    &[data-spacing="compact"] {
      padding-top: ${gap.nano};
      padding-bottom: ${gap.nano};
    }
  `,
  Header: styled.nav`
    flex-shrink: 1;

    display: grid;
    --column-gap: ${gap.kilo};
    grid-template-columns: auto var(--column-gap) auto var(--column-gap) auto 1fr;
    grid-template-rows: minmax(35px, auto);
    grid-template-areas: "brand . links . switch .";
    align-items: center;

    ${down("lg")} {
      --column-gap: ${gap.centi};
    }

    ${down("md")} {
      grid-template-columns: auto 1fr auto;
      grid-template-rows: minmax(35px, auto) auto;
      grid-template-areas:
        "brand . switch"
        "links links links";
      --column-gap: 0;
    }
  `,
  LinksOuter: styled.div`
    grid-area: links;
  `,
  Links: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: ${gap.nano};

    ${down("lg")} {
      gap: ${gap.femto};
    }

    --link-x-padding: ${gap.pico};
    --link-y-padding: ${gap.femto};
    padding-top: var(--link-y-padding);

    ${down("md")} {
      --link-y-padding: ${gap.femto};

      flex-wrap: wrap;

      /* Visually correct for left padding */
      margin-left: calc(-1 * var(--link-x-padding));
    }
  `,
  HeaderPageLink: styled(LinkButton)`
    ${linkCommonStyle}

    padding: var(--link-y-padding) var(--link-x-padding);

    &.active-link {
      border-bottom: 2px solid ${color("text-strong")};
    }

    /* When forced-colors are enabled, restore the default link
    underline-on-hover behavior */
    @media (forced-colors: active) {
      text-decoration: initial;

      &:hover,
      &:active {
        text-decoration: underline;
      }
    }
  `,
  BrandLink: styled(Link)`
    ${linkCommonStyle}

    transform: translateY(3px);
    grid-area: brand;
    align-self: stretch;
    --brand-x-padding: ${gap.nano};
    padding: 0 var(--brand-x-padding);

    display: flex;
    flex-direction: row;
    align-items: center;

    /* Visually correct for left padding */
    margin-left: calc(-1 * var(--brand-x-padding));

    /* When forced-colors are enabled, manually add a bottom-border
    to the brand link on hover to make it more visible */
    @media (forced-colors: active) {
      &:hover,
      &:active {
        --brand-forced-color-border-width: 3px;

        border-bottom: var(--brand-forced-color-border-width) solid white;
        /* Compensate for the border width to avoid a visual shift */
        padding-top: var(--brand-forced-color-border-width);
      }
    }
  `,
  ThemeSwitcherWrapper: styled.div`
    grid-area: switch;
  `,
  Switch: styled(Switch)`
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      transform: translateY(-1px);
    }
  `,
  UncheckedIcon: styled(Icon)`
    color: ${color("light")};
  `,
  CheckedIcon: styled(Icon)`
    color: ${color("light")};
  `,
  BrandLinkTitle: styled.div`
    --brand-link-title-spacing: ${gap.nano};
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    & > h1 {
      font-size: 1.3rem;
      font-weight: 400;

      /* Vertically align with brand */
      margin-top: -3px;
    }
  `,
  TitleSeparator: styled.div`
    /* Don't use gap on the flex parent, and instead manually set
    margin/padding for each element. This allows the tap target for the brand
    link to be maximal. */
    margin-right: calc(var(--brand-link-title-spacing) - 2px);
    align-self: stretch;

    width: 2px;

    /* Vertically nudge slightly */
    top: -2px;
    bottom: 0;
    position: relative;
    background-color: ${color("text-faint")};
  `,
};

// Must stay synchronized with below staticQuery
type StaticQueryResult = {
  file: {
    childDataYaml: {
      brandText: string;
      links: ButtonFragment[];
    };
  };
};

function useData(): StaticQueryResult {
  return useStaticQuery<StaticQueryResult>(
    graphql`
      query {
        file(
          name: { eq: "header" }
          extension: { eq: "yaml" }
          sourceInstanceName: { eq: "data" }
        ) {
          childDataYaml {
            brandText
            links {
              ...Buttons
            }
          }
        }
      }
    `
  );
}

export type HeaderProps = {
  spacing?: "compact" | "sparse";
  customContent?: React.ReactNode;
  noContainer?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Top-level site navigation component,
 * with hard-coded links to other pages
 * and data-provided social links.
 */
export default function Header({
  spacing = "compact",
  customContent,
  noContainer = false,
  className,
  style,
}: HeaderProps): React.ReactElement {
  const { links: socialLinks } = useData().file.childDataYaml;
  const links: ButtonFragment[] = [
    { href: "/resume", text: "Resume" },
    { href: "/projects", text: "Projects" },
    ...socialLinks,
  ];

  return (
    <Styled.HeaderOuter
      className={className}
      style={style}
      data-spacing={spacing}
      data-no-container={noContainer}
    >
      {customContent != null ? (
        customContent
      ) : (
        <Styled.Header>
          <BrandLink />
          <Styled.LinksOuter>
            <Styled.Links>
              {links.map((link, i) => (
                <Styled.HeaderPageLink
                  key={i}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...link}
                  iconClassName="header-link-icon"
                  activeLinkClassName="active-link"
                />
              ))}
            </Styled.Links>
          </Styled.LinksOuter>
          <Styled.ThemeSwitcherWrapper>
            <ThemeSwitcher />
          </Styled.ThemeSwitcherWrapper>
        </Styled.Header>
      )}
    </Styled.HeaderOuter>
  );
}

// ? -----------------
// ? Helper Components
// ? -----------------

function ThemeSwitcher(): React.ReactElement | null {
  const { mode: currentMode, setMode } = useContext(ColorModeContext);
  const toggleWrapper = useCallback(
    (checked: boolean) => {
      const targetMode = checked ? ColorMode.Dark : ColorMode.Light;
      setMode(targetMode);
    },
    [setMode]
  );

  // Skip rendering when server-rendering,
  // but include a div that takes up the same space
  // to prevent layout shift.
  const initialRender = useInitialRender();
  if (initialRender) {
    return <div style={{ width: 56, height: 28 }} />;
  }

  return (
    <Styled.Switch
      onChange={toggleWrapper}
      checked={currentMode === ColorMode.Dark}
      aria-label="Dark mode switch"
      uncheckedIcon={<Styled.UncheckedIcon name="sun" />}
      checkedIcon={<Styled.CheckedIcon name="moon" />}
      height={28}
      width={56}
    />
  );
}

export type BrandLinkProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function BrandLink({
  className,
  style,
}: BrandLinkProps): React.ReactElement {
  const { brandText } = useData().file.childDataYaml;
  return (
    <Styled.BrandLink
      to="/"
      aria-label={brandText}
      className={className}
      style={style}
    >
      {/* Brand text is written in Dubai font, Bold:
        https://dubaifont.com/
        https://www.fontsquirrel.com/fonts/dubai */}
      <BrandSvg style={{ height: 22 }} />
    </Styled.BrandLink>
  );
}

export type BrandLinkTitleProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const StyledBrandLinkTitleLink = styled(BrandLink)`
  /* Remove excessive right padding */
  padding-right: var(--brand-link-title-spacing);

  /* Remove vertical nudging */
  transform: none;
`;

/**
 * Draws the brand link next to a title, separated by a vertical bar.
 */
export function BrandLinkTitle({
  children,
  className,
  style,
}: BrandLinkTitleProps): React.ReactElement {
  return (
    <Styled.BrandLinkTitle className={className} style={style}>
      <StyledBrandLinkTitleLink />
      <Styled.TitleSeparator />
      <h1>{children}</h1>
    </Styled.BrandLinkTitle>
  );
}
