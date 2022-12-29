import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { graphql } from "gatsby";
import type { PageProps } from "gatsby";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { chromePdfBackground } from "../theme/color";
import Button, { buttonSizeStyles } from "../components/Button";
import Meta from "../components/Meta";
import { down, up } from "../theme/media";
import { BrandLinkTitle } from "../components/Header";

const Styled = {
  PageLayout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  `,
  HeaderContent: styled.nav`
    flex-shrink: 1;
    display: grid;
    --column-gap: ${gap.milli};
    grid-template-columns: auto var(--column-gap) auto 1fr;
    grid-template-rows: minmax(35px, auto);
    grid-template-areas: "brand . buttons .";
    align-items: center;

    ${down("md")} {
      grid-template-columns: auto 1fr auto;
      grid-template-rows: minmax(35px, auto);
      grid-template-areas: "brand . buttons";
    }

    ${down("sm")} {
      grid-template-columns: auto;
      grid-template-rows: auto auto;
      grid-template-areas:
        "brand"
        "buttons";
    }
  `,
  HeaderButtonBar: styled.div`
    grid-area: buttons;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
    gap: ${gap.nano};

    ${down("md")} {
      gap: ${gap.pico};
    }

    ${down("sm")} {
      padding-top: ${gap.nano};
    }
  `,
  PdfWrapper: styled.div`
    background-color: ${chromePdfBackground};
    overflow-y: hidden;
    height: 100%;
    position: relative;
  `,
  HeaderButton: styled(Button)`
    flex-shrink: 0;

    ${down("md")} {
      ${css(buttonSizeStyles.small)}

      /* Make the button icons larger */
      & svg {
        transform: scale(1.4);
      }
    }

    /* Hide the text download button
    and show the icon download button on small screens. */
    ${up("md")} {
      &.download-icon-button {
        display: none;
      }
    }
    ${down("md")} {
      &.download-text-button {
        display: none;
      }
    }
  `,
  BrandLinkTitle: styled(BrandLinkTitle)`
    /* Vertically nudge the brand title down a bit, to visually align it with
    the text in the buttons */
    margin-top: 3px;
  `,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  file: {
    childDataYaml: {
      pdf: string;
      hostedSource: string;
      github: string;
    };
  };

  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
};

export const pageQuery = graphql`
  query {
    file(
      name: { eq: "resume" }
      extension: { eq: "yaml" }
      sourceInstanceName: { eq: "data" }
    ) {
      childDataYaml {
        pdf
        hostedSource
        github
      }
    }

    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

export type ResumePageProps = PageProps<PageQueryResult>;

export default function ResumePage({
  data,
}: ResumePageProps): React.ReactElement {
  const { pdf, hostedSource, github } = data.file.childDataYaml;

  let { siteUrl } = data.site.siteMetadata;
  if (siteUrl.endsWith("/")) {
    siteUrl = siteUrl.slice(0, -1);
  }
  const hostedSourceUrl = `${siteUrl}${hostedSource}`;

  return (
    <Layout
      hideFooter
      headerProps={{
        spacing: "compact",
        noContainer: true,
        customContent: (
          <Styled.HeaderContent>
            <Styled.BrandLinkTitle>Resume</Styled.BrandLinkTitle>
            <Styled.HeaderButtonBar>
              {/* One of the following buttons will be hidden,
            depending on the screen size: */}
              <Styled.HeaderButton
                href={pdf}
                download
                icon="download"
                ariaLabel="Download"
                className="download-icon-button"
              />
              <Styled.HeaderButton
                href={pdf}
                download
                icon="download"
                text="Download"
                className="download-text-button"
              />

              <Styled.HeaderButton
                href={github}
                icon="github"
                text="View source"
              />
              <Styled.HeaderButton
                // Construct the Overleaf URL from the hosted source URL.
                // See https://www.overleaf.com/devs
                href={`https://www.overleaf.com/docs?snip_uri=${hostedSourceUrl}`}
                icon="overleaf"
                text="Edit on Overleaf"
              />
            </Styled.HeaderButtonBar>
          </Styled.HeaderContent>
        ),
      }}
    >
      <Styled.PageLayout>
        <Styled.PdfWrapper>
          <embed
            src={pdf}
            type="application/pdf"
            height="100%"
            width="100%"
            style={{ border: "none" }}
          />
        </Styled.PdfWrapper>
      </Styled.PageLayout>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Resume" />;
}
