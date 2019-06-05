import { graphql } from 'gatsby'
import React from 'react'
import get from 'lodash/get'

import Meta from 'components/Meta'
import Layout from 'components/Layout'

const IndexPage = ({ data, location }) => {
  return (
    <Layout location={location}>
      <Meta site={get(data, 'site.meta')} />
      <div className="background-wrapper">
        <div className="background-top" />
        <div className="background-bottom" />
        <div className="background-bottom-fill" />
      </div>
      <main>
        <div className="lead-wrapper">
          <div className="lead">
            <h1>Joseph Azevedo</h1>
            <h2>CS Student, Georgia Tech</h2>
            <h3>
              Concentration in
              <span className="font-weight-bold">
                Information Internetworks
              </span>
              &amp; <span className="font-weight-bold">Media</span>
            </h3>
          </div>
        </div>
        <div className="featured container light-text">
          <h1>
            Featured Projects
            <a className="btn btn-primary ml-2 mb-1" href="/projects">
              View All
            </a>
          </h1>
          <div className="row project-container px-3 px-md-0">
            {/* {% assign sorted = site.projects | sort: 'importance' | reverse %}
            {% for project in sorted limit: 3 %}
                <div className="col-12 col-md-6 col-xl-4 position-relative">
                    {% include project-card.html project=project %}
                </div>
            {% endfor %} */}
          </div>
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
    ) {
      projects: edges {
        projects: node {
          frontmatter {
            slug
          }
        }
      }
    }
  }
`
