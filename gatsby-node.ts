import type { GatsbyNode } from "gatsby";

import { createGraphQLTypes } from "./src/build/graphql-types";
import { createProjectPages } from "./src/build/create-project-pages";
import { createProjectImageResolvers } from "./src/build/resolve-project-images";
import {
  onFileCreated,
  postCopyProjectFiles,
} from "./src/build/copy-project-files";
import {
  createResumeMetadataNode,
  createResumeMetadataSchema,
  loadResumeMetadata,
} from "./src/build/resume-metadata";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    // Define custom graphql schema to enforce rigid type structures
    createGraphQLTypes(actions);
    createResumeMetadataSchema(actions);
  };

export const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers: createResolversHelper,
}) => {
  // Create resolvers on project MDX nodes
  // that get the appropriate logo/card image.
  createProjectImageResolvers(createResolversHelper);
};

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  reporter,
}) => {
  // Copy additional static project files to the public directory
  if (node.internal.type === "File") {
    onFileCreated({ node, reporter });
  }
};

export const sourceNodes: GatsbyNode["sourceNodes"] = async (args) => {
  // Source resume metadata, if GitHub integration is enabled
  const metadata = await loadResumeMetadata(args);
  if (metadata != null) {
    await createResumeMetadataNode(args, metadata);
  } else {
    // eslint-disable-next-line no-lonely-if
    if (process.env.CI === "true" && process.env.NODE_ENV === "production") {
      args.reporter.error(
        "GitHub integration must succeed in CI. Aborting build."
      );
      process.exit(1);
    }
  }
};

export const onPostBootstrap: GatsbyNode["onPostBootstrap"] = ({
  reporter,
}) => {
  // Print results of the above function
  postCopyProjectFiles(reporter);
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  // Dynamically create project pages
  const activity = reporter.activityTimer(`generating project pages`);
  activity.start();
  await createProjectPages({ actions, graphql, reporter });
  activity.end();
};
