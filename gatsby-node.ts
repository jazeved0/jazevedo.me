import type { GatsbyNode } from "gatsby";

import { createGraphQLTypes } from "./src/build/graphql-types";
import { createProjectPages } from "./src/build/create-project-pages";
import { createProjectImageResolvers } from "./src/build/resolve-project-images";
import {
  onFileCreated,
  postCopyProjectFiles,
} from "./src/build/copy-project-files";

// Define custom graphql schema to enforce rigid type structures
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions }) => {
    createGraphQLTypes(actions);
  };

// Create resolvers on project MDX nodes
// that get the appropriate logo/card image
export const createResolvers: GatsbyNode["createResolvers"] = ({
  createResolvers: createResolversHelper,
}) => {
  createProjectImageResolvers(createResolversHelper);
};

// Copy additional static project files to the public directory
export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  reporter,
}) => {
  if (node.internal.type === "File") {
    onFileCreated({ node, reporter });
  }
};

// Print results of the above function
export const onPostBootstrap: GatsbyNode["onPostBootstrap"] = ({
  reporter,
}) => {
  postCopyProjectFiles(reporter);
};

// Dynamically create project pages
export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const activity = reporter.activityTimer(`generating project pages`);
  activity.start();
  await createProjectPages({ actions, graphql, reporter });
  activity.end();
};
