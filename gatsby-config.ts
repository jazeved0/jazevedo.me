import type { GatsbyConfig } from "gatsby";
// import type { PluginOptions as ManifestPluginOptions } from "gatsby-plugin-manifest";
import type { PluginOptions as GoogleAnalyticsPluginOptions } from "gatsby-plugin-google-gtag";
import type { PluginOptions as MdxPluginOptions } from "gatsby-plugin-mdx";
import type { PluginOptions as ReactSvgPluginOptions } from "gatsby-plugin-react-svg";
import type { FileSystemConfig } from "gatsby-source-filesystem";

// import { backgroundColor, themeColor } from "./src/theme/color";

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
  // | GatsbyPlugin<"gatsby-plugin-manifest", ManifestPluginOptions>
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
  // TODO figure out manifest plugin config
  // {
  //   resolve: `gatsby-plugin-manifest`,
  //   options: {
  //     name: "Personal Portfolio",
  //     short_name: "Portfolio",
  //     description: "Joseph Azevedo's personal portfolio",
  //     start_url: "/",
  //     background_color: backgroundColor,
  //     theme_color: themeColor,
  //     display: "standalone",
  //     icons: [
  //       {
  //         src: "/img/meta/android-chrome-192x192.png",
  //         sizes: "192x192",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/img/meta/android-chrome-256x256.png",
  //         sizes: "256x256",
  //         type: "image/png",
  //       },
  //       {
  //         src: "/img/meta/android-chrome-512x512.png",
  //         sizes: "512x512",
  //         type: "image/png",
  //       },
  //     ],
  //   },
  // },
  {
    resolve: "gatsby-plugin-google-gtag",
    options: {
      trackingIds: ["UA-141036948-1"],
    },
  },
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      extensions: [".md"],
      gatsbyRemarkPlugins: [
        {
          resolve: "gatsby-remark-images",
          options: {
            maxWidth: 800,
            showCaptions: false,
          },
        },
        // TODO get gatsby-remark-embed-snippet working
        // (or find an alternative)
        // "gatsby-remark-embed-snippet",
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
};

export default config;
