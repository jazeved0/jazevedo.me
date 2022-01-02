import React from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { container } from "../theme/layout";
import { chromePdfBackground } from "../theme/color";
import Button from "../components/Button";

const Styled = {
  PageLayout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    height: 100%;
  `,
  Toolbar: styled.div`
    ${container}
    padding-bottom: ${gap.nano};
    flex-grow: 0;
    flex-shrink: 0;
    width: 100%;
  `,
  PdfWrapper: styled.div`
    background-color: ${chromePdfBackground};
    overflow-y: hidden;
    height: 100%;
    position: relative;
  `,
  ToolbarButtonBar: styled.div`
    display: flex;
    flex-direction: row;
  `,
  ToolbarButton: styled(Button)`
    &:not(:last-child) {
      margin-right: ${gap.nano};
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
    <Layout title="Resume" headerSpacing="compact" hideFooter>
      <Styled.PageLayout>
        <Styled.Toolbar>
          <Styled.ToolbarButtonBar>
            <Styled.ToolbarButton
              href={pdf}
              download
              icon="download"
              text="Download"
            />
            <Styled.ToolbarButton
              href="/resume/source"
              icon="file-code"
              text="View source"
            />
          </Styled.ToolbarButtonBar>
        </Styled.Toolbar>
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
