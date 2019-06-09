const path = require('path')
const ProjectTemplate = path.resolve('./src/templates/Project/main.js')
const ProjectAuxTemplate = path.resolve('./src/templates/Project/auxillary.js')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(
    `
      query loadPagesQuery($limit: Int!) {
        allMarkdownRemark(limit: $limit) {
          edges {
            node {
              id
              parent {
                ... on File {
                  sourceInstanceName
                  relativeDirectory
                  relativePath
                }
              }
            }
          }
        }
      }
    `,
    { limit: 1000 }
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    const extensionRegex = /\.md/
    const indexRegex = /index/

    // Create projects pages.
    result.data.allMarkdownRemark.edges
      .filter(edge => edge.node.parent.sourceInstanceName === 'projects')
      .forEach(edge => {
        if (edge.node.parent.relativeDirectory.indexOf('/') === -1) {
          // Main page
          createPage({
            path: `projects/${edge.node.parent.relativeDirectory}`,
            component: ProjectTemplate,
            context: { id: edge.node.id },
          })
        } else {
          // Auxillary page
          const relativePath = edge.node.parent.relativePath
            .replace(extensionRegex, '')
            .replace(indexRegex, '')
          createPage({
            path: `projects/${relativePath}`,
            component: ProjectAuxTemplate,
            context: { id: edge.node.id },
          })
        }
      })
  })
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}
