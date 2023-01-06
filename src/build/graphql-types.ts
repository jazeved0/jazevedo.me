import { Actions } from "gatsby";

import { schema as buttonSchema } from "../components/LinkButton/schema";

/**
 * Creates GraphQL types for MDX frontmatter and Data YAML nodes
 * in order to not rely on type inference in case files
 * happen not to contain the expected data at some point.
 */
export function createGraphQLTypes({ createTypes }: Actions): void {
  createTypes(buttonSchema);
  createTypes(`
  type Mdx implements Node {
    frontmatter: Frontmatter
    logo: File
    card: File
  }

  type DataYaml implements Node {
    links: [Button!]
  }

  type Frontmatter {
    title: String!
    # Used for SEO:
    description: String!

    # All following fields are ignored for non-main pages
    # (and must be nullable in the schema):

    importance: Int
    buttons: [Button!]
    # Required for main pages:
    type: String
    # Required for main pages:
    start: String
    end: String
    # Required for main pages:
    lead: String
    topics: Topics
  }

  type Topics {
    main: [String!]
    secondary: [String!]
  }
`);
}
