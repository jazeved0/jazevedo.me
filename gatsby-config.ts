import type { GatsbyConfig } from "gatsby";
import type { PluginOptions as GoogleAnalyticsPluginOptions } from "gatsby-plugin-google-gtag";
import type { PluginOptions as MdxPluginOptions } from "gatsby-plugin-mdx";
import type { PluginOptions as ReactSvgPluginOptions } from "gatsby-plugin-react-svg";
import type { FileSystemConfig } from "gatsby-source-filesystem";
import RemarkGFM from "remark-gfm";

import type { GitHubMetadata } from "./src/build/resume-metadata";

const description = [
  "My name is Joseph, and I'm software engineer living in the Bay Area",
  "and currently working at Stripe.",
  "I'm interested in distributed systems, observability, and operating systems.",
].join(" ");

export const siteMetadata = {
  title: "Joseph Azevedo",
  description,
  name: "Joseph Azevedo",
  siteUrl: "https://jazevedo.me/",
  briefDescription: "Software Engineer at Stripe",
  // Used in /src/build/resume-metadata.ts:
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  github: {
    owner: "jazeved0",
    name: "jazevedo.me",
    branch: "main",
  } satisfies GitHubMetadata,
};

const pathPrefix = "/";

type GatsbyPlugin<P extends string, O> = {
  resolve: P;
  options: O;
};

type PluginDefs =
  | GatsbyPlugin<"gatsby-plugin-mdx", MdxPluginOptions>
  | GatsbyPlugin<"gatsby-plugin-google-gtag", GoogleAnalyticsPluginOptions>
  | GatsbyPlugin<"gatsby-plugin-react-svg", ReactSvgPluginOptions>
  | FileSystemConfig
  | string;

const plugins: PluginDefs[] = [
  "gatsby-transformer-yaml",
  {
    resolve: "gatsby-source-filesystem",
    options: {
      path: `${__dirname}/content/projects/`,
      name: "projects",
    },
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      path: `${__dirname}/content/data/`,
      name: "data",
    },
  },
  {
    resolve: "gatsby-source-filesystem",
    options: {
      path: `${__dirname}/src/pages`,
      name: "pages",
    },
  },
  {
    resolve: "gatsby-plugin-google-gtag",
    options: {
      trackingIds: ["UA-141036948-1"],
    },
  },
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      extensions: [".mdx"],
      mdxOptions: {
        remarkPlugins: [
          // Add support for GitHub-flavored Markdown (GFM), including tables
          RemarkGFM,
        ],
      },
      gatsbyRemarkPlugins: [
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 1260,
            showCaptions: false,
            quality: 85,
            backgroundColor: "none",
          },
        },
        {
          resolve: "gatsby-remark-smartypants",
          options: {},
        },
        "gatsby-remark-copy-linked-files",
      ],
    },
  },
  "gatsby-plugin-catch-links",
  "gatsby-plugin-remove-serviceworker",
  "gatsby-plugin-image",
  "gatsby-plugin-sharp",
  "gatsby-plugin-sitemap",
  "gatsby-transformer-sharp",
  "gatsby-plugin-emotion",
  "gatsby-plugin-dark-mode",
  {
    resolve: "gatsby-plugin-react-svg",
    options: {
      rule: {
        include: /\.inline\.svg$/,
      },
    },
  },
];

const config: GatsbyConfig = {
  siteMetadata,
  graphqlTypegen: true,
  plugins: plugins as GatsbyConfig["plugins"],
  pathPrefix,
  trailingSlash: "never",
};

export default config;
