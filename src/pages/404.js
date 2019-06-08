import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'

import './scss/404.scss'

const NotFoundPage = ({ data, location }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
  }

  return (
    <Layout location={location} fixed={false}>
      <Meta site={get(data, 'site.meta')} />
      <main>
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container py-5 error-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          ''
        )}
      </main>
    </Layout>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query NotFoundQuery {
    file: allFile(
      filter: {
        extension: { regex: "/md/" }
        sourceInstanceName: { eq: "data" }
        name: { eq: "404" }
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
