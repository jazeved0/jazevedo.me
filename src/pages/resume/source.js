import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'
import { transform } from 'components/LinkButtonAuto/util'

import '../scss/source.scss'

const ResumeSourcePage = ({ data }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  let buttons
  let title
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
    buttons = transform(
      get(file, 'node.childMarkdownRemark.frontmatter.buttons')
    )
    title = get(file, 'node.childMarkdownRemark.frontmatter.title')
  }

  return (
    <Layout
      title={title}
      nav={<Toolbar buttons={buttons} background="dark" />}
      transparentFooter={true}
      className="bg-one-dark"
    >
      <main>
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container pt-4 pb-5 source-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : null}
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
              buttons {
                ...Buttons
              }
            }
          }
        }
      }
    }
  }
`
