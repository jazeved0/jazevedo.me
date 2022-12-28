import React from "react";
import styled from "@emotion/styled";
import { graphql } from "gatsby";
import type { PageProps } from "gatsby";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { container } from "../theme/layout";
import { ProjectCardFragment } from "../components/ProjectCard/types";
import ProjectCard from "../components/ProjectCard";
import Meta from "../components/Meta";

const Styled = {
  Content: styled.article`
    ${container}
    padding-top: ${gap.milli};
    padding-bottom: ${gap.kilo};
  `,
  Title: styled.h1`
    font-weight: 900;
    font-size: 2rem;
    margin-bottom: ${gap.micro};
    line-height: 0.9;
  `,
  CardLayout: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    grid-template-rows: repeat(auto-fill, auto);
    grid-row-gap: ${gap.micro};
    grid-column-gap: ${gap.micro};
    grid-auto-flow: row;
    align-items: start;
  `,
  ProjectCard: styled(ProjectCard)``,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  allFile: {
    projectFiles: Array<{
      childMdx: ProjectCardFragment;
    }>;
  };
};

export const pageQuery = graphql`
  query {
    allFile(
      sort: { childMdx: { frontmatter: { importance: DESC } } }
      limit: 1000
      filter: {
        relativePath: { regex: "/^[^/]+/index.mdx$/" }
        sourceInstanceName: { eq: "projects" }
      }
    ) {
      projectFiles: nodes {
        childMdx {
          ...ProjectCard
        }
      }
    }
  }
`;

export type ProjectsPageProps = PageProps<PageQueryResult>;

export default function ProjectsPage({
  data,
}: ProjectsPageProps): React.ReactElement {
  const projects = data.allFile.projectFiles.map(({ childMdx }) => childMdx);
  return (
    <Layout headerProps={{ spacing: "compact" }}>
      <Styled.Content>
        <Styled.Title>Past Projects</Styled.Title>
        <Styled.CardLayout>
          {projects.map((project, i) => (
            <Styled.ProjectCard project={project} key={i} />
          ))}
        </Styled.CardLayout>
      </Styled.Content>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Projects" />;
}
