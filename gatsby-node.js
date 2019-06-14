const path = require('path')
const ProjectPageTemplate = path.resolve('./src/templates/Project/main.js')
const _ = require('lodash')
const buttonSchema = require('./src/components/LinkButtonAuto/schema.js')

// Whether or not to print verbose debug messages to stdout
const verbose = false
const ifVerbose = func => (verbose ? func() : void 0)
const output = (text = '') => ifVerbose(() => console.log(text))
const debug = (reporter, text, mode = 'info') =>
  ifVerbose(() =>
    ({
      info: content => reporter.info(content),
      success: content => reporter.success(content),
    }[mode](text))
  )

// Define custom graphql schema to enforce rigid type structures
exports.sourceNodes = ({ actions, reporter }) => {
  activity = reporter.activityTimer('implementing custom graphql schema')
  activity.start()
  const { createTypes } = actions
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: Frontmatter
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }

    type Frontmatter {
      title: String
      buttons: [Button]
      shortTitle: String
      type: String
      start: String
      end: String
      lead: String
      topics: Topics
    }

    type Topics {
      main: [String]
      secondary: [String]
    }
  `
  createTypes(buttonSchema)
  createTypes(typeDefs)
  activity.end()
}

// Dynamically create project pages
exports.createPages = ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  let activity = reporter.activityTimer(`loading project pages via graphql`)
  activity.start()

  return graphql(
    `
      query loadPagesQuery($limit: Int!) {
        allFile(
          limit: $limit
          filter: {
            sourceInstanceName: { eq: "projects" }
            extension: { regex: "/^(?:md)|(?:mdx)$/" }
          }
        ) {
          edges {
            node {
              relativeDirectory
              relativePath
              name
              childMarkdownRemark {
                id
              }
              childMdx {
                id
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

    activity.end()
    activity = reporter.activityTimer(`dynamically generating project pages`)
    activity.start()

    // Flatmap function that tags whether a node is md or mdx while validating
    // that it has content at all
    const tagOrCull = ({ childMarkdownRemark: md, childMdx: mdx, ...rest }) => {
      const isMd = !_.isNil(md)
      const isMdx = !_.isNil(mdx)
      if (isMd || isMdx) return { ...rest, isMdx, id: isMdx ? mdx.id : md.id }
      else {
        // Log error and cull by returning emoty array
        reporter.error(`node ${rest.name} has no valid md or mdx content`)
        return []
      }
    }
    // Trims a path to be the proper local path
    const trimPath = path =>
      path
        .replace('index', '')
        .replace('.mdx', '')
        .replace('.md', '')
        .replace(/\/$/, '')

    output()

    // Create projects pages from both md and mdx
    result.data.allFile.edges
      .flatMap(({ node }) => tagOrCull(node))
      .forEach(({ id, relativeDirectory: dir, relativePath, name, isMdx }) => {
        // Create final URL as trimmed filepath
        const trimmedPath = trimPath(relativePath)
        // Determine whether the page is a main project page or auxillary page
        const isMain = trimmedPath.indexOf('/') === -1 && name === 'index'
        createPage({
          path: `projects/${trimmedPath}`,
          component: ProjectPageTemplate,
          context: { id, isMdx, isAuxillary: !isMain },
        })
        // Log debug message
        const pageType = isMain ? 'main' : 'aux '
        debug(reporter, `${pageType} page @ 'projects/${dir}' => ${id}`)
      })
    activity.end()
  })
}

// Allow relative imports like "import foo from 'components/Foo'"
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}
