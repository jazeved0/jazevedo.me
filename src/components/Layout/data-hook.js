import { useStaticQuery, graphql } from 'gatsby'

export const dataHook = () => {
  const { site } = useStaticQuery(
    graphql`
      {
        site {
          meta: siteMetadata {
            title
            description
            msTileColor
            maskIconColor
          }
        }
      }
    `
  )
  return site.meta
}
