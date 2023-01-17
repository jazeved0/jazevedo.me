/* eslint-disable import/no-duplicates */
/* eslint-disable max-len */

declare module "*.inline.svg" {
  const Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  export default Component;
}

declare module "*.svg" {
  const url: string;
  export default url;
}

type GatsbyPlugin<P extends string, O> = {
  resolve: P;
  options: O;
};

declare module "gatsby-plugin-google-gtag" {
  // Types based on:
  // https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-google-gtag
  export type PluginOptions = {
    /** You can add multiple tracking ids and a pageview event will be fired for all of them. */
    trackingIds: string[];
    /**
     * This object gets passed directly to the gtag config command.
     * This config will be shared across all trackingIds
     */
    gtagConfig?: {
      anonymize_ip?: boolean;
      optimize_id?: string;
      cookie_expires?: number;
    };
    /** This object is used for configuration specific to this plugin */
    pluginConfig?: {
      /** Puts tracking script in the head instead of the body */
      head?: boolean;
      /** Setting this parameter is also optional */
      respectDNT?: boolean;
      /** Avoids sending pageview hits from custom paths */
      exclude?: string[];
      /** Defaults to https://www.googletagmanager.com */
      origin?: string;
      /** Delays processing pageview events on route update (in milliseconds) */
      delayOnRouteUpdate?: number;
    };
  };
}

declare module "gatsby-plugin-react-svg" {
  // Add additional types from:
  // https://github.com/jacobmischka/gatsby-plugin-react-svg
  // if needed.
  export interface PluginOptions {
    rule: { include: RegExp };
  }
}

declare module "gatsby-plugin-mdx" {
  import type { CompileOptions } from "@mdx-js/mdx";

  // Types taken from:
  // https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-mdx
  export type PluginOptions = {
    /** Configure the file extensions that gatsby-plugin-mdx will process */
    extensions?: string[];
    /** Use Gatsby-specific remark plugins */
    gatsbyRemarkPlugins?: (GatsbyPlugin<string, object> | string)[];
    /** Options directly passed to `compile()` of `@mdx-js/mdx` */
    mdxOptions?: CompileOptions;
  };
}
