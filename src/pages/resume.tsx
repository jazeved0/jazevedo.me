import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { chromePdfBackground } from "../theme/color";
import Button, { buttonSizeStyles } from "../components/Button";
import Meta from "../components/Meta";
import { down, up } from "../theme/media";

const Styled = {
  PageLayout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  `,
  HeaderBar: styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: wrap;
    gap: ${gap.nano};

    ${down("md")} {
      padding-top: ${gap.femto};
      gap: ${gap.pico};
    }
  `,
  HeaderPageTitle: styled.h1`
    font-size: 1.5rem;
    align-self: center;

    ${down("md")} {
      font-size: 1.25rem;
    }
  `,
  PdfWrapper: styled.div`
    background-color: ${chromePdfBackground};
    overflow-y: hidden;
    height: 100%;
    position: relative;
  `,
  HeaderBarButton: styled(Button)`
    flex-shrink: 0;

    ${down("md")} {
      ${css(buttonSizeStyles["small"])}

      /* Make the button icons larger */
      & svg {
        transform: scale(1.4);
      }
    }

    /* Hide the text download button
    and show the icon download button on medium screens. */
    ${up("lg")} {
      &.download-icon-button {
        display: none;
      }
    }
    ${down("lg")} {
      &.download-text-button {
        display: none;
      }
    }
  `,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  file: {
    childMdx: {
      frontmatter: {
        pdf: string;
      };
    };
  };
};

export const pageQuery = graphql`
  query {
    file(
      name: { eq: "resume" }
      extension: { eq: "md" }
      sourceInstanceName: { eq: "data" }
    ) {
      childMdx {
        frontmatter {
          pdf
        }
      }
    }
  }
`;

export type ResumePageProps = {
  data: PageQueryResult;
};

export default function ResumePage({
  data,
}: ResumePageProps): React.ReactElement {
  const { pdf } = data.file.childMdx.frontmatter;
  return (
    <Layout
      title="Resume"
      headerSpacing="compact"
      hideFooter
      overrideHeaderLinks={
        <Styled.HeaderBar>
          <Styled.HeaderPageTitle>Resume</Styled.HeaderPageTitle>
          {/* One of the following buttons will be hidden,
            depending on the screen size: */}
          <Styled.HeaderBarButton
            href={pdf}
            download
            icon="download"
            ariaLabel="Download"
            className="download-icon-button"
          />
          <Styled.HeaderBarButton
            href={pdf}
            download
            icon="download"
            text="Download"
            className="download-text-button"
          />

          <Styled.HeaderBarButton
            href="/resume/source"
            icon="file-code"
            text="View source"
          />
        </Styled.HeaderBar>
      }
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
