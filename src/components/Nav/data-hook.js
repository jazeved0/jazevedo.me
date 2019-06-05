import { useStaticQuery, graphql } from 'gatsby'

export const dataHook = () => {
  const { allNavYaml } = useStaticQuery(
    graphql`
      {
        allNavYaml {
          nodes {
            icon
            href
            text
          }
        }
      }
    `
  )
  return allNavYaml.nodes
}
