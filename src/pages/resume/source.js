import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'

import '../scss/source.scss'

const ResumeSourcePage = ({ data, location }) => {
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
      <main className="bg-one-dark">
        <Toolbar buttons={buttons} background="dark" fixed="top" />
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container py-4 py-lg-5 source-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          ''
        )}
      </main>
    </Layout>
  )
}

export default ResumeSourcePage

export const pageQuery = graphql`
  query ResumeSourceQuery {
    file: allFile(
      filter: {
        extension: { regex: "/md/" }
        sourceInstanceName: { eq: "data" }
        name: { eq: "source" }
      }
    ) {
      edges {
        node {
          childMarkdownRemark {
            html
            frontmatter {
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
