import { useStaticQuery, graphql } from "gatsby";
import React from "react";
import Helmet from "react-helmet";

import { useColorMode, useInitialRender } from "../hooks";
import {
  msTileColor,
  maskIconColor,
  ColorMode,
  defaultMode,
} from "../theme/color";

// Must stay synchronized with below staticQuery
type StaticQueryResult = {
  site: {
    meta: {
      title: string;
      description: string;
    };
  };
};

function useData(): StaticQueryResult {
  return useStaticQuery<StaticQueryResult>(
    graphql`
      query {
        site {
          meta: siteMetadata {
            title
            description
          }
        }
      }
    `
  );
}

export type MetaProps = {
  title?: string;
};

/**
 * Uses react-helmet to add elements to the <meta> HTML element
 * at the root of the HTML page.
 * Useful for adding SEO metadata/titles
 */
export default function Meta({ title }: MetaProps): React.ReactElement {
  const data = useData();
  const { description, title: siteTitle } = data.site.meta;

  // If the page title is given, add it to the site title
  const derivedTitle = title != null ? `${title} | ${siteTitle}` : siteTitle;

  // Always re-render once upon first mounting,
  // to ensure that the server-side theme
  // is consistent with the user-selected theme.
  const initialRender = useInitialRender();
  const currentColorMode = useColorMode();
  const colorMode = initialRender ? defaultMode : currentColorMode;

  return (
    <Helmet
      htmlAttributes={{ lang: "en" }}
      meta={[
        { charSet: "utf-8" },
        {
          name: "color-scheme",
          content: colorMode === ColorMode.Light ? "light" : "dark",
        },
        {
          httpEquiv: "x-ua-compatible",
          content: "ie=edge",
        },
        {
          httpEquiv: "viewport",
          content: "width=device-width, initial-scale=1, shrink-to-fit=no",
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          httpEquiv: "Content-Type",
          content: "text/html; charset=UTF-8",
        },
        {
          name: "msapplication-TileColor",
          content: msTileColor,
        },
        {
          property: "og:image",
          content: "/img/meta/thumbnail.png",
        },
        {
          property: "og:description",
          content: description,
        },
        {
          name: "description",
          content: description,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary",
        },
        {
          property: "og:title",
          content: derivedTitle,
        },
      ]}
      link={[
        {
          href: "/img/meta/apple-touch-icon.png",
          rel: "apple-touch-icon",
          sizes: "180x180",
        },
        {
          href: "/img/meta/favicon.ico",
          rel: "icon",
          type: "image/x-icon",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/img/meta/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/img/meta/favicon-16x16.png",
        },
        {
          rel: "mask-icon",
          color: maskIconColor,
          href: "/img/meta/safari-pinned-tab.svg",
        },
      ]}
      title={derivedTitle}
    />
  );
}
