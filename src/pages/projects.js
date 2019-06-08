import { graphql } from 'gatsby'
import React from 'react'
import { get, map, isNil } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'
import ProjectCardList from 'components/ProjectCardList'

import './scss/projects.scss'

const ProjectsPage = ({ data, location }) => {
  let titleHtml = get(data, 'file.edges')
  if (!isNil(titleHtml))
    titleHtml = get(titleHtml[0], 'node.childMarkdownRemark.html')
  const projects = map(get(data, 'remark.projects'), 'project.frontmatter')

  return (
    <Layout location={location}>
      <Meta site={get(data, 'site.meta')} />
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
    remark: allMarkdownRemark(
      sort: { fields: [frontmatter___importance], order: DESC }
      filter: { frontmatter: { importance: { ne: null } } }
    ) {
      projects: edges {
        project: node {
          frontmatter {
            slug
            type
            title
            description
            topics {
              main
            }
          }
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
          }
        }
      }
    }
  }
`
