import { useStaticQuery, graphql } from 'gatsby'
import { find, isNil } from 'lodash'

export const dataHook = () => {
  const { cards, logos } = useStaticQuery(
    graphql`
      {
        cards: allFile(
          filter: {
            name: { regex: "/^card$/" }
            extension: { regex: "/^(?:svg)|(?:png)|(?:jpg)$/" }
          }
        ) {
          edges {
            node {
              childImageSharp {
                fluid(
                  srcSetBreakpoints: [308, 362, 468]
                  maxHeight: 240
                  maxWidth: 526
                  cropFocus: CENTER
                  quality: 90
                  fit: COVER
                ) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
              relativeDirectory
              publicURL
            }
          }
        }
        logos: allFile(
          filter: {
            name: { regex: "/^logo$/" }
            extension: { regex: "/^(?:svg)|(?:png)|(?:jpg)$/" }
          }
        ) {
          edges {
            node {
              childImageSharp {
                fluid(
                  maxHeight: 100
                  maxWidth: 200
                  cropFocus: CENTER
                  quality: 90
                  fit: CONTAIN
                ) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
              relativeDirectory
              publicURL
            }
          }
        }
      }
    `
  )

  const processNode = (node, mode) => {
    if (isNil(node.childImageSharp)) {
      // Return direct image
      return {
        project: node.relativeDirectory,
        sharpImg: false,
        src: node.publicURL,
      }
    } else {
      // Return sharp optimized image data
      return {
        project: node.relativeDirectory,
        sharpImg: true,
        image: node.childImageSharp[mode],
      }
    }
  }

  return {
    cards: cards.edges.map(card => processNode(card.node, 'fluid')),
    logos: logos.edges.map(logo => processNode(logo.node, 'fluid')),
  }
}

export const getProjectData = (slug, data) => {
  return {
    card: find(data.cards, ['project', slug]),
    logo: find(data.logos, ['project', slug]),
  }
}
