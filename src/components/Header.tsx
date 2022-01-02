import React, { useCallback, useContext } from "react";
import styled from "@emotion/styled";
import { useStaticQuery, graphql, Link } from "gatsby";
import { darken, lighten } from "polished";

import { ButtonFragment } from "./LinkButton/schema";
import LinkButton from "./LinkButton/LinkButton";
import {
  color,
  ColorMode,
  ColorModeContext,
  hybridColor,
  mode,
} from "../theme/color";
import BrandSvg from "../images/brand.inline.svg";
import { useDown } from "../hooks";
import { container } from "../theme/layout";
import { gap } from "../theme/spacing";
import Switch from "./Switch";
import Icon from "./Icon";
import { between, down } from "../theme/media";

const Styled = {
  HeaderOuter: styled.div`
    ${container}

    a {
      text-decoration: none;
      color: ${color("text-strong")};
      white-space: nowrap;
      padding: ${gap.atto} ${gap.pico};

      &:hover,
      &:active {
        ${mode(ColorMode.Dark)} {
          color: ${lighten(0.3, hybridColor("primary", ColorMode.Dark))};
        }

        ${mode(ColorMode.Light)} {
          color: ${darken(0.1, hybridColor("primary", ColorMode.Light))};
        }
      }
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
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 1;

    ${down("md")} {
      justify-content: space-between;
    }
  `,
  Links: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    & > * {
      &:not(:last-child) {
        margin-right: ${gap.nano};

        ${down("lg")} {
          margin-right: ${gap.femto};
        }
      }
    }

    a {
      &.active-link {
        border-bottom: 2px solid ${color("text-strong")};
      }
    }

    ${between("md", "lg")} {
      .header-link-icon {
        display: none;
      }
    }
  `,
  BrandLink: styled(Link)`
    transform: translateY(3px);
    margin-right: ${gap.kilo} !important;

    /* Visually correct for left padding */
    margin-left: -${gap.pico};

    ${down("lg")} {
      margin-right: ${gap.centi} !important;
    }

    ${down("md")} {
      margin-right: 0 !important;
    }
  `,
  ThemeSwitcherWrapper: styled.div`
    margin-left: ${gap.kilo};

    ${down("lg")} {
      margin-left: ${gap.centi};
    }

    ${down("md")} {
      margin-left: 0;
    }
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
  MobileLinksWrapper: styled.div`
    flex-shrink: 1;
  `,
};

const MobileLinks = styled(Styled.Links)`
  flex-shrink: 1;
  flex-wrap: wrap;

  /* Visually correct for left padding */
  margin-left: -${gap.pico};
`;

// Must stay synchronized with below staticQuery
type StaticQueryResult = {
  file: {
    childDataYaml: {
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
  className,
  style,
}: HeaderProps): React.ReactElement {
  const { links: socialLinks } = useData().file.childDataYaml;
  const links: ButtonFragment[] = [
    { href: "/resume", text: "Resume" },
    { href: "/projects", text: "Projects" },
    ...socialLinks,
  ];

  const isMobile = useDown("md");

  return (
    <Styled.HeaderOuter
      className={className}
      style={style}
      data-spacing={spacing}
    >
      <Styled.Header>
        <Styled.BrandLink to="/">
          {/* Brand text is written in Dubai font, Bold:
              https://dubaifont.com/
              https://www.fontsquirrel.com/fonts/dubai */}
          <BrandSvg style={{ height: 22 }} />
        </Styled.BrandLink>
        {!isMobile && (
          <Styled.Links>
            {links.map((link, i) => (
              <LinkButton
                key={i}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...link}
                iconClassName="header-link-icon"
                activeLinkClassName="active-link"
              />
            ))}
          </Styled.Links>
        )}
        <Styled.ThemeSwitcherWrapper>
          <ThemeSwitcher />
        </Styled.ThemeSwitcherWrapper>
      </Styled.Header>
      {isMobile && (
        <Styled.MobileLinksWrapper>
          <MobileLinks>
            {links.map((link, i) => (
              <LinkButton
                key={i}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...link}
                iconClassName="header-link-icon"
                activeLinkClassName="active-link"
              />
            ))}
          </MobileLinks>
        </Styled.MobileLinksWrapper>
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

  // Skip rendering when server-rendering
  if (typeof window === "undefined") {
    return null;
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
