import React from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import type { PageProps } from "gatsby";

import Layout from "../../components/Layout";
import { gap } from "../../theme/spacing";
import { container } from "../../theme/layout";
import Button from "../../components/Button";
import Mdx from "../../components/Mdx";
import Meta from "../../components/Meta";

const Styled = {
  SourceContent: styled.article`
    ${container}
    padding-top: ${gap.micro};
    padding-bottom: ${gap.kilo};
  `,
  Title: styled.h1`
    font-weight: 900;
    font-size: 2rem;
    margin-bottom: ${gap.micro};
    line-height: 0.9;
  `,
  ButtonBar: styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;

    & > :not(:last-child) {
      margin-right: ${gap.nano};
      margin-bottom: ${gap.nano};
    }
  `,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  file: {
    childMdx: {
      frontmatter: {
        overleaf: string;
        github: string;
      };
      body: string;
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
          overleaf
          github
        }
        body
      }
    }
  }
`;

export type ResumePageProps = PageProps<PageQueryResult>;

export default function ResumePage({
  data,
}: ResumePageProps): React.ReactElement {
  const { body, frontmatter } = data.file.childMdx;
  const { overleaf, github } = frontmatter;
  return (
    <Layout headerSpacing="compact">
      <Styled.SourceContent>
        <Styled.Title>Resume Source</Styled.Title>
        <Styled.ButtonBar>
          <Button href="/resume" icon="chevron-left" text="Back" />
          <Button href={github} icon="github" text="View on GitHub" />
          <Button href={overleaf} icon="overleaf" text="View on Overleaf" />
        </Styled.ButtonBar>
        <div style={{ height: gap.milli }} />
        <Mdx content={body} />
      </Styled.SourceContent>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Resume Source" />;
}
