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
import headerSVG from '../../static/img/header-background.svg'
import footerSVG from '../../static/img/footer-background.svg'

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
        <div className="featured container">
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

const imgUrlFormat = img => `url(${img})`
function Background({ className, ...rest }) {
  return (
    <div className={classNames('background-wrapper', className)} {...rest}>
      <div
        className="background-top"
        style={{
          backgroundImage: imgUrlFormat(headerSVG),
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
          zIndex: 0,
          flexGrow: 0,
          width: '100%',
          height: '750px',
          backgroundPositionY: '-32px',
          backgroundSize: '2100px 620px',
          height: '620px',
          position: 'absolute',
          top: 0,
        }}
      />
      <div
        className="background-bottom"
        style={{
          backgroundImage: imgUrlFormat(footerSVG),
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
          zIndex: 0,
          flexGrow: 0,
          width: '100%',
          height: '750px',
          backgroundPositionY: 'top',
          backgroundSize: 'cover',
          position: 'relative',
          marginTop: '350px',
        }}
      />
      <div
        className="background-bottom-fill"
        style={{
          backgroundColor: '#252E44',
          width: '100%',
          flexGrow: 1,
        }}
      />
    </div>
  )
}
