import { GatsbyNode } from "gatsby";
import VueLoaderPlugin from "vue-loader/lib/plugin";

import { createGraphQLTypes } from "./src/build/graphql-types";
import { createProjectPages } from "./src/build/create-project-pages";
import { createProjectImageResolvers } from "./src/build/resolve-project-images";
import {
  onFileCreated,
  postCopyProjectFiles,
} from "./src/build/copy-project-files";

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    // Add .vue to list of resolved extensions
    resolve: {
      extensions: [".vue"],
    },
    // Vue in React support
    // Note: this includes the Vue runtime in each page,
    // but it should be pretty much idle on most of them.
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
  });
};

// Define custom graphql schema to enforce rigid type structures
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
  ({ actions, reporter }) => {
    const activity = reporter.activityTimer("creating custom graphql schema");
    activity.start();
    createGraphQLTypes(actions);
    activity.end();
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

// Print results of the above function
export const onPostBootstrap: GatsbyNode["onPostBootstrap"] = ({
  reporter,
}) => {
  postCopyProjectFiles(reporter);
};
