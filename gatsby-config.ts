import type { GatsbyConfig } from "gatsby";
import type { PluginOptions as GoogleAnalyticsPluginOptions } from "gatsby-plugin-google-gtag";
import type { PluginOptions as MdxPluginOptions } from "gatsby-plugin-mdx";
import type { PluginOptions as ReactSvgPluginOptions } from "gatsby-plugin-react-svg";
import type { FileSystemConfig } from "gatsby-source-filesystem";

const description = [
  "My name is Joseph, and I'm an aspiring software engineer and researcher living in Atlanta",
  "with prior internships at MathWorks, Stripe, and Datadog.",
  "I'm interested in distributed systems, observability, and operating systems.",
].join(" ");

const siteMetadata = {
  title: "Joseph Azevedo",
  description,
  siteUrl: "https://jazevedo.me/",
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
      gatsbyRemarkPlugins: [
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 800,
            showCaptions: false,
          },
        },
        {
          resolve: "gatsby-remark-responsive-iframe",
          options: {},
        },
        {
          resolve: "gatsby-remark-prismjs",
          options: {
            noInlineHighlight: true,
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
