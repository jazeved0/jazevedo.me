import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'
import ButtonBar from 'components/ButtonBar'

import './scss/404.scss'

const NotFoundPage = ({ data, location }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  let buttons
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
    buttons = get(file, 'node.childMarkdownRemark.frontmatter.buttons')
  }

  return (
    <Layout location={location}>
      <Meta site={get(data, 'site.meta')} />
      <main>
        <div className="container py-5">
          {!isNil(contentHtml) && contentHtml.trim() != '' ? (
            <div
              className="error-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            ''
          )}
          <ButtonBar className="mt-5" buttons={buttons} />
        </div>
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
            frontmatter {
              pdf
              buttons {
                href
                icon
                image
                text
                class
                action
              }
            }
          }
        }
      }
    }
  }
`
