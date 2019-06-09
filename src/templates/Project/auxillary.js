import React from 'react'
import { graphql } from 'gatsby'

import Layout from 'components/Layout'

import './style.scss'

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        shortTitle
      }
    }
  }
`

const ProjectAuxTemplate = ({ data }) => {
  return (
    <Layout title={data.markdownRemark.frontmatter.shortTitle}>
      <div
        className="container py-4 pt-md-5 project-content"
        dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
      />
    </Layout>
  )
}

export default ProjectAuxTemplate
