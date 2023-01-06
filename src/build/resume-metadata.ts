import type { CreateSchemaCustomizationArgs, SourceNodesArgs } from "gatsby";
import { graphql } from "@octokit/graphql";

import { siteMetadata } from "../../gatsby-config";

const resumePath = "src/resume/main.tex";

export type GitHubMetadata = {
  owner: string;
  name: string;
  siteRoot?: string;
  branch: string;
};

export type ResumeMetadata = {
  // Date in ISO 8601 format "YYYY-MM-DDTHH:MM:SSZ":
  lastModified: string;
};

/**
 * Attempts to load the commited date for the resume from the GitHub API,
 * returning `null` if the data couldn't be loaded for any reason.
 */
export async function loadResumeMetadata(
  args: SourceNodesArgs
): Promise<null | ResumeMetadata> {
  const { reporter } = args;

  // Make sure token was passed in
  if (process.env.GITHUB_TOKEN == null) {
    [
      "Could not find GitHub token. Skipping resume modification date sourcing.",
      `To enable sourcing resume metadata, set the "GITHUB_TOKEN" environment variable.`,
    ].forEach((line) => {
      reporter.warn(line);
    });
    return null;
  }

  // Re-use activity variable
  const activity = reporter.activityTimer(
    "loading resume modification date via GitHub integration"
  );
  activity.start();

  // Make sure all fields were given
  const { owner, name, siteRoot, branch } =
    siteMetadata.github as GitHubMetadata;

  // Trim leading and trailing slashes from siteRoot, if present
  let siteRootCleaned = siteRoot ?? "";
  if (siteRootCleaned.startsWith("/")) {
    siteRootCleaned = siteRootCleaned.slice(1);
  }
  if (siteRootCleaned.endsWith("/")) {
    siteRootCleaned = siteRootCleaned.slice(0, -1);
  }

  let resumeFileFullPath: string;
  if (siteRootCleaned === "") {
    resumeFileFullPath = resumePath;
  } else {
    resumeFileFullPath = `${siteRootCleaned}/${resumePath}`;
  }

  try {
    // This type must stay in sync with the query below
    type QueryResult = {
      repository: {
        object: {
          history: {
            nodes: Array<{
              committedDate: string;
            }>;
          };
        };
      };
    };

    const data = await graphql<QueryResult>(
      `
        query githubMetadataQuery(
          $owner: String!
          $name: String!
          $branch: String!
          $path: String!
        ) {
          repository(owner: $owner, name: $name) {
            object(expression: $branch) {
              ... on Commit {
                history(first: 1, path: $path) {
                  nodes {
                    committedDate
                  }
                }
              }
            }
          }
        }
      `,
      {
        owner,
        name,
        branch,
        path: resumeFileFullPath,
        headers: {
          authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );

    if (data == null || data.repository.object.history.nodes.length === 0) {
      [
        "No data was returned from the GitHub API for resume modification date sourcing.",
        `Check that the branch name is correct and that the resume exists at the expected path ("<siteRoot>/${resumePath}").`,
      ].forEach((line) => {
        reporter.warn(line);
      });
      if (data != null) {
        reporter.warn(`data: \n${JSON.stringify(data)}`);
      }
      activity.end();
      return null;
    }

    activity.end();
    return {
      lastModified: data.repository.object.history.nodes[0].committedDate,
    };
  } catch (error) {
    reporter.warn(
      "An error ocurred while querying the GitHub API for resume modification date sourcing."
    );
    reporter.warn(String(error));
    activity.end();
    return null;
  }
}

export const schema = `
  type ResumeMetadata implements Node {
    lastModified: Date
  }
`;

export function createResumeMetadataSchema(
  actions: CreateSchemaCustomizationArgs["actions"]
): void {
  const { createTypes } = actions;
  createTypes(schema);
}

export async function createResumeMetadataNode(
  args: SourceNodesArgs,
  metadata: ResumeMetadata
): Promise<void> {
  const { actions, createContentDigest } = args;
  const { createNode } = actions;
  await createNode<ResumeMetadata>({
    ...metadata,
    id: "resume-metadata",
    parent: null,
    children: [],
    internal: {
      type: "ResumeMetadata",
      contentDigest: createContentDigest(JSON.stringify(metadata)),
    },
  });
}
