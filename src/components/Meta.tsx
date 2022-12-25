import { useStaticQuery, graphql } from "gatsby";
import React from "react";

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
 * Gatsby 4.19+ Head-style component used to display SEO/meta-related tags in
 * the page's `<head>`.
 *
 * https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
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
    <>
      <meta charSet="utf-8" />
      <meta
        name="color-scheme"
        content={colorMode === ColorMode.Light ? "light" : "dark"}
      />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta
        httpEquiv="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="msapplication-TileColor" content={msTileColor} />
      <meta property="og:image" content="/img/meta/thumbnail.png" />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content={derivedTitle} />
      <link
        href="/img/meta/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link href="/img/meta/favicon.ico" rel="icon" type="image/x-icon" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/img/meta/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/img/meta/favicon-16x16.png"
      />
      <link
        rel="mask-icon"
        color={maskIconColor}
        href="/img/meta/safari-pinned-tab.svg"
      />
      <title>{derivedTitle}</title>
    </>
  );
}
