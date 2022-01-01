import React from "react";
import styled from "@emotion/styled";
import { useStaticQuery, graphql } from "gatsby";

import { ButtonFragment } from "./LinkButton/schema";
import LinkButton from "./LinkButton/LinkButton";
import { container } from "../theme/layout";
import { gap } from "../theme/spacing";
import { shadow } from "../theme/shadows";
import { color } from "../theme/color";
import { highlight, highlightLinks, strongHighlight } from "../theme/mixins";
import Icon from "./Icon";
import { down } from "../theme/media";

const Styled = {
  Footer: styled.footer`
    box-shadow: ${shadow("innerTop")};

    padding-top: ${gap.micro};
    padding-bottom: ${gap.micro};

    ${container}

    background-color: ${color("bg-5")};
  `,
  FooterContent: styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    ${down("md")} {
      flex-direction: column;
    }
  `,
  TechLinks: styled.div`
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: ${gap.nano};

    & > * {
      font-size: 1.45rem;
      color: ${color("text")};
      padding: ${gap.pico} ${gap.pico};
      border-radius: 4px;
      border: none !important;
      --highlight-color: transparent;
      background-color: var(--highlight-color);

      &:hover {
        ${highlight}
      }

      &:active {
        ${strongHighlight}
      }

      &:hover {
        color: ${color("text")};
      }

      & > svg {
        vertical-align: -4px;
      }

      ${down("md")} {
        font-size: 1.6rem;
        padding: ${gap.nano} calc(${gap.pico} + 4px);
      }

      &:not(:last-child) {
        margin-right: ${gap.atto};
      }
    }
  `,
  FooterLink: styled.a`
    ${highlightLinks}
  `,
};

// Must stay synchronized with below staticQuery
type StaticQueryResult = {
  file: {
    childDataYaml: {
      links: ButtonFragment[];
      github: string;
    };
  };
};

function useData(): StaticQueryResult {
  return useStaticQuery<StaticQueryResult>(
    graphql`
      query {
        file(
          name: { eq: "footer" }
          extension: { eq: "yaml" }
          sourceInstanceName: { eq: "data" }
        ) {
          childDataYaml {
            links {
              ...Buttons
            }
            github
          }
        }
      }
    `
  );
}

export type FooterProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Simple footer at the bottom of most pages,
 * including a link to source code of website
 * and short list of important technologies.
 */
export default function Footer({
  className,
  style,
}: FooterProps): React.ReactElement {
  const { links, github } = useData().file.childDataYaml;
  return (
    <Styled.Footer className={className} style={style}>
      <Styled.FooterContent>
        <div>
          This site is{" "}
          <Styled.FooterLink href={github}>
            open source{" "}
            <Icon name="external-link-alt" style={{ marginLeft: gap.atto }} />
          </Styled.FooterLink>
        </div>
        <div>
          Built with
          <Styled.TechLinks>
            {links.map((link, i) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <LinkButton key={i} {...link} />
            ))}
          </Styled.TechLinks>
        </div>
      </Styled.FooterContent>
    </Styled.Footer>
  );
}
