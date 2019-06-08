import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Meta from 'components/Meta'
import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'

import './scss/resume.scss'

const ResumePage = ({ data, location }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  let buttons
  let pdf
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
    buttons = get(file, 'node.childMarkdownRemark.frontmatter.buttons')
    pdf = get(file, 'node.childMarkdownRemark.frontmatter.pdf')
  }

  return (
    <Layout location={location} fixed={false} className="layout-outer">
      <Meta site={get(data, 'site.meta')} />
      <main>
        <Toolbar buttons={buttons} background="dark" />
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container py-5"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          ''
        )}
        <div class="pdf-wrapper">
          <embed
            src={pdf}
            type="application/pdf"
            height="100%"
            width="100%"
            frameborder="0"
          />
        </div>
      </main>
    </Layout>
  )
}

export default ResumePage

export const pageQuery = graphql`
  query ResumeQuery {
    file: allFile(
      filter: {
        extension: { regex: "/md/" }
        sourceInstanceName: { eq: "data" }
        name: { eq: "resume" }
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
              }
            }
          }
        }
      }
    }
  }
`
