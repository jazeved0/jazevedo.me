import { graphql } from "gatsby";
import { IGatsbyImageData } from "gatsby-plugin-image";

export const fragment = graphql`
  fragment ProjectCard on Mdx {
    frontmatter {
      title
      description
      topics {
        main
      }
    }
    logo {
      publicURL
    }
    card {
      publicURL
      childImageSharp {
        gatsbyImageData(
          width: 526
          placeholder: BLURRED
          transformOptions: { fit: COVER, cropFocus: CENTER }
          formats: [AUTO, WEBP, AVIF]
          quality: 60
        )
      }
    }
    parent {
      ... on File {
        relativeDirectory
      }
    }
  }
`;

export type ProjectCardFragment = {
  frontmatter: {
    type?: string | null;
    title?: string | null;
    description?: string | null;
    topics: {
      main?: string[];
    };
  };
  logo?: {
    publicURL: string;
  } | null;
  card?: {
    publicURL: string;
    childImageSharp?: {
      gatsbyImageData: IGatsbyImageData;
    } | null;
  } | null;
  parent: {
    relativeDirectory: string;
  };
};
