import { graphql } from 'gatsby'
import React from 'react'
import { get, isNil } from 'lodash'

import Layout from 'components/Layout'
import Toolbar from 'components/Toolbar'
import { transform } from 'components/LinkButtonAuto/util'

import './scss/resume.scss'

const ResumePage = ({ data }) => {
  let files = get(data, 'file.edges')
  let contentHtml
  let buttons
  let pdf
  let title
  if (!isNil(files)) {
    const file = files[0]
    contentHtml = get(file, 'node.childMarkdownRemark.html')
    buttons = transform(
      get(file, 'node.childMarkdownRemark.frontmatter.buttons')
    )
    pdf = get(file, 'node.childMarkdownRemark.frontmatter.pdf')
    title = get(file, 'node.childMarkdownRemark.frontmatter.title')
  }

  return (
    <Layout
      title={title}
      className="resume-layout"
      nav={<Toolbar buttons={buttons} background="dark" />}
    >
      <main>
        {!isNil(contentHtml) && contentHtml.trim() != '' ? (
          <div
            className="container py-5"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : null}
        <div className="pdf-wrapper">
          <embed
            src={pdf}
            type="application/pdf"
            height="100%"
            width="100%"
            frameBorder="0"
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
