import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil, map } from 'lodash'
import classNames from 'classnames'
import { renderIcons } from '../util'

import Meta from 'components/Meta'
import Layout from 'components/Layout'
import LinkButtonAuto from 'components/LinkButtonAuto'
import ProjectCardList from 'components/ProjectCardList'

import './index.scss'

const IndexPage = ({ data, location }) => {
  // Get lead html from query data
  let leadHtml = get(data, 'file.edges')
  if (!isNil(leadHtml))
    leadHtml = get(leadHtml[0], 'node.childMarkdownRemark.html')
  const projects = map(get(data, 'remark.projects'), 'project.frontmatter')

  return (
    <Layout location={location} custom={true} fixed={false}>
      <Meta site={get(data, 'site.meta')} />
      <Background />
      <main>
        <Lead content={leadHtml} />
        <div className="featured container light-text">
          <h1>
            Featured Projects
            <LinkButtonAuto
              className="btn btn-primary ml-3 mb-1"
              href="/projects"
              text="View All"
            />
          </h1>
          <ProjectCardList projects={projects} />
        </div>
      </main>
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    site {
      meta: siteMetadata {
        title
        description
        url: siteUrl
        author
      }
    }
    remark: allMarkdownRemark(
      sort: { fields: [frontmatter___importance], order: DESC }
      limit: 3
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
        name: { eq: "index" }
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

function Lead({ content, className, ...rest }) {
  return (
    <div className={classNames('lead-wrapper', className)} {...rest}>
      <div
        className="lead"
        dangerouslySetInnerHTML={{ __html: renderIcons(content) }}
      />
    </div>
  )
}

function Background({ className, ...rest }) {
  return (
    <div className={classNames('background-wrapper', className)} {...rest}>
      <div className="background-top" />
      <div className="background-bottom" />
      <div className="background-bottom-fill" />
    </div>
  )
}
