import { graphql } from 'gatsby'
import React from 'react'
import { get, map, isNil } from 'lodash'
import { parseProject } from 'components/ProjectCardList/data-hook'

import Layout from 'components/Layout'
import ProjectCardList from 'components/ProjectCardList'

import './scss/projects.scss'

const ProjectsPage = ({ data }) => {
  let files = get(data, 'file.edges')
  let titleHtml
  let title
  if (!isNil(files)) {
    const file = files[0]
    titleHtml = get(file, 'node.childMarkdownRemark.html')
    title = get(file, 'node.childMarkdownRemark.frontmatter.title')
  }
  const projects = map(get(data, 'remark.projects'), parseProject)

  return (
    <Layout title={title}>
      <main>
        <div className="container py-5">
          <div
            className="title-content"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          <ProjectCardList projects={projects} />
        </div>
      </main>
    </Layout>
  )
}

export default ProjectsPage

export const pageQuery = graphql`
  query ProjectsQuery {
    remark: allMdx(
      sort: { fields: [frontmatter___importance], order: DESC }
      filter: { frontmatter: { importance: { ne: null } } }
    ) {
      projects: edges {
        project: node {
          ...ProjectCard
        }
      }
    }
    file: allFile(
      filter: {
        extension: { regex: "/md/" }
        sourceInstanceName: { eq: "data" }
        name: { eq: "projects" }
      }
    ) {
      edges {
        node {
          childMarkdownRemark {
            html
            frontmatter {
              title
            }
          }
        }
      }
    }
  }
`
