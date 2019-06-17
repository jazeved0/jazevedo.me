import { useStaticQuery, graphql } from 'gatsby'
import { transform } from 'components/LinkButtonAuto/util'

export const dataHook = () => {
  const { file } = useStaticQuery(
    graphql`
      {
        file(
          extension: { eq: "md" }
          sourceInstanceName: { eq: "data" }
          name: { eq: "footer" }
        ) {
          childMarkdownRemark {
            html
            frontmatter {
              buttons {
                ...Buttons
              }
              left
              right
            }
          }
        }
      }
    `
  )
  const markdown = file.childMarkdownRemark
  const { left, right, buttons } = markdown.frontmatter
  return {
    html: markdown.html,
    // Transform 'class' to 'className' to be react-compliant
    buttons: transform(buttons),
    left,
    right,
  }
}
