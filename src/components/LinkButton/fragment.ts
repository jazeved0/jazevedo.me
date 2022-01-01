import { graphql } from "gatsby";

export const fragment = graphql`
  fragment Buttons on Button {
    href
    icon
    text
    variant
  }
`;
