import { useStaticQuery, graphql } from 'gatsby'

export const dataHook = () => {
  const { allFile } = useStaticQuery(
    graphql`
      {
        allFile(
          filter: {
            extension: { regex: "/md|mdx/" }
            sourceInstanceName: { eq: "data" }
            name: { eq: "contact" }
          }
        ) {
          edges {
            node {
              childMarkdownRemark {
                html
                frontmatter {
                  buttons {
                    text
                    image
                    icon
                    href
                    disabled
                    class
                    external
                  }
                }
              }
            }
          }
        }
      }
    `
  )
  const edges = allFile.edges.map(file => {
    const markdown = file.node.childMarkdownRemark
    return {
      content: markdown.html,
      // Transform 'class' to 'className' to be react-compliant
      buttons: markdown.frontmatter.buttons.map(
        ({ class: className, ...rest }) => {
          return { className: className, ...rest }
        }
      ),
    }
  })
  // Lift first element or return null
  if (edges.length >= 1) return edges[0]
  else return null
}
