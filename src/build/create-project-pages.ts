import { Actions, CreatePagesArgs, Reporter } from "gatsby";
import * as pathLib from "path";

import { ProjectPageContext } from "../templates/Project";

const ProjectPageTemplate = pathLib.resolve(
  pathLib.join(__dirname, "../templates/Project.tsx")
);

/**
 * Called during createPages,
 * where this function will get all project markdown files
 * (both the main project pages at /projects/<slug>
 * and any other "auxillary" project pages at sub-paths)
 * and generate pages for them,
 * using the page template in src/templates/Project.tsx page.
 */
export async function createProjectPages({
  graphql,
  actions,
  reporter,
}: {
  graphql: CreatePagesArgs["graphql"];
  actions: Actions;
  reporter: Reporter;
}): Promise<void> {
  const { createPage } = actions;

  // Must stay in sync with below query
  type LoadPagesQueryResult = {
    projectPages: {
      nodes: Array<{
        relativePath: string;
        name: string;
        childMdx: {
          id: string;
          internal: {
            contentFilePath: string;
          };
        };
      }>;
    };
  };

  const loadPagesQuery = `
    query ($limit: Int!) {
      projectPages: allFile(
        limit: $limit
        filter: {
          sourceInstanceName: { eq: "projects" }
          extension: { regex: "/^(?:md)|(?:mdx)$/" }
        }
      ) {
        nodes {
          relativePath
          name
          childMdx {
            id
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `;

  const result = await graphql<LoadPagesQueryResult>(loadPagesQuery, {
    limit: 1000,
  });
  const { data } = result;
  // eslint-disable-next-line prefer-destructuring
  const errors: unknown = result.errors;
  if (errors) {
    throw errors;
  } else if (data == null) {
    throw new Error("graphql result is nil");
  }

  // Trims a path to be the proper local path
  const trimPath = (p: string): string =>
    p.replace("index", "").replace(".md", "").replace(/\/$/, "");

  // Create projects pages
  data.projectPages.nodes.forEach(({ childMdx, relativePath, name }) => {
    // Create final URL as trimmed filepath
    const trimmedPath = trimPath(relativePath);

    // Determine whether the page is a main project page or auxillary page
    const isMain = trimmedPath.indexOf("/") === -1 && name === "index";
    const context: ProjectPageContext = {
      id: childMdx.id,
      isAuxillary: !isMain,
    };
    createPage({
      path: `projects/${trimmedPath}`,
      // This is incredibly cursed:
      // https://www.gatsbyjs.com/docs/how-to/routing/mdx/#make-a-layout-template-for-your-posts
      component: `${ProjectPageTemplate}?__contentFilePath=${childMdx.internal.contentFilePath}`,
      context,
    });

    const pageType = isMain ? "main" : "aux ";
    reporter.info(`created ${pageType} page at /projects/${trimmedPath}`);
  });
}
