import React from "react";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import type { PageProps, HeadProps } from "gatsby";

import Layout from "../components/Layout";
import Mdx from "../components/Mdx";
import { ButtonFragment } from "../components/LinkButton/schema";
import ProjectOverview from "../components/ProjectOverview";
import ProjectBackground from "../components/ProjectBackground";
import { gap } from "../theme/spacing";
import Article from "../components/Article";
import { container } from "../theme/layout";
import { color } from "../theme/color";
import Meta from "../components/Meta";

const Styled = {
  PageLayout: styled.div`
    ${container}
    padding-top: ${gap.micro};
    padding-bottom: ${gap.kilo};
  `,
  ProjectOverview: styled(ProjectOverview)`
    max-width: 650px;
    position: relative;
    padding-top: ${gap.micro};
    padding-bottom: calc(${gap.milli} + 4px);
  `,
  ProjectContent: styled(Article)`
    & > :last-child {
      margin-bottom: ${gap.milli};
    }
  `,
  ProjectEndRule: styled.hr`
    max-width: 100px;
    margin: ${gap.nano} 0;
    border-top: 2px solid ${color("text")};
    margin: 0;
  `,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  mdx: {
    frontmatter: {
      shortTitle: string;
      type: string;
      title: string;
      start: string;
      end?: string | null;
      lead: string;
      topics?: {
        main?: string[] | null;
        secondary?: string[] | null;
      } | null;
      buttons?: ButtonFragment[] | null;
    };
  };
};

export const pageQuery = graphql`
  query ($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        shortTitle
        type
        title
        start
        end
        lead
        topics {
          main
          secondary
        }
        buttons {
          ...Buttons
        }
      }
    }
  }
`;

export type ProjectPageContext = {
  // Used in page query
  id: string;
  isAuxillary: boolean;
};

export type ProjectPageTemplateProps = PageProps<
  PageQueryResult,
  ProjectPageContext
>;

/**
 * Page template for any markdown-rendered pages in /projects/**.
 * Handles both main project pages (with the <ProjectOverview>)
 * as well as "auxillary" pages that are simple markdown pages.
 */
export default function ProjectPageTemplate({
  data,
  pageContext,
  children,
}: ProjectPageTemplateProps): React.ReactElement {
  const { isAuxillary } = pageContext;
  const { type, title, start, end, lead, topics, buttons } =
    data.mdx.frontmatter;

  return (
    <Layout>
      {!isAuxillary && <ProjectBackground />}
      <Styled.PageLayout>
        {!isAuxillary && (
          <Styled.ProjectOverview
            type={type}
            title={title}
            start={start}
            end={end ?? null}
            lead={lead}
            mainTopics={topics?.main ?? []}
            secondaryTopics={topics?.secondary ?? []}
            buttons={buttons ?? []}
          />
        )}
        <Styled.ProjectContent>
          <Mdx content={children} />
        </Styled.ProjectContent>
        <Styled.ProjectEndRule />
      </Styled.PageLayout>
    </Layout>
  );
}

export type ProjectHeadProps = HeadProps<PageQueryResult>;

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head({ data }: ProjectHeadProps): React.ReactElement {
  return <Meta title={data.mdx.frontmatter.shortTitle} />;
}
