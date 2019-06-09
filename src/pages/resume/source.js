import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'

import '../scss/source.scss'

const ResumeSourcePage = ({ data, location }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  let buttons
  let title
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
    buttons = get(file, 'node.childMarkdownRemark.frontmatter.buttons')
    title = get(file, 'node.childMarkdownRemark.frontmatter.title')
  }

  return (
    <Layout title={title} nav={<Toolbar buttons={buttons} background="dark" />}>
      <main className="bg-one-dark">
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container pt-4 pb-5 source-content"
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
              title
              ...Buttons
            }
          }
        }
      }
    }
  }
`
