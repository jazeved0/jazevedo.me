import { useStaticQuery, graphql } from "gatsby";
import React, { useEffect, useState } from "react";

import { useInitialRender } from "../hooks";
import { maskIconColor, ColorMode, defaultMode } from "../theme/color";

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
  description?: string;
  noIndex?: boolean;
};

/**
 * Gatsby 4.19+ Head-style component used to display SEO/meta-related tags in
 * the page's `<head>`.
 *
 * https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export default function Meta({
  title,
  description,
  noIndex = false,
}: MetaProps): React.ReactElement {
  const data = useData();
  const { description: siteDescription, title: siteTitle } = data.site.meta;

  let derivedDescription: string;
  if (description == null) {
    derivedDescription = siteDescription;
  } else {
    derivedDescription = description;
  }

  // If the page title is given, add it to the site title
  const derivedTitle = title != null ? `${title} | ${siteTitle}` : siteTitle;

  // Always re-render once upon first mounting,
  // to ensure that the server-side theme
  // is consistent with the user-selected theme.
  const initialRender = useInitialRender();
  // const currentColorMode = useColorMode();
  // TODO(jazeved0): This currently does not work due to the color mode provider
  //   being rendered in the Layout component, which is rendered separately from
  //   this Gatsby Head component. However, even if the color mode provider was
  //   moved to the `wrapPageElement` API (as it probably should be), this would
  //   still not work, since React Context's are currently not propagated
  //   correctly to the Gatsby Head component:
  //   https://github.com/gatsbyjs/gatsby/discussions/35841#discussioncomment-3256204
  // HACK: workaround for the above issue, by manually binding to the CSS class
  //   of the body element, which will be set by the color mode provider.
  const getColorModeFromBodyClass = (): ColorMode => {
    if (typeof document === "undefined") {
      return defaultMode;
    }
    return document.body.classList.contains("light")
      ? ColorMode.Light
      : ColorMode.Dark;
  };
  const [currentColorMode, setCurrentColorMode] = useState(() =>
    getColorModeFromBodyClass()
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setCurrentColorMode(getColorModeFromBodyClass());
    });
    observer.observe(document.body, { attributes: true });
    return () => {
      observer.disconnect();
    };
  }, [setCurrentColorMode]);

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
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta property="og:image" content="/img/meta/thumbnail.png" />
      <meta property="og:description" content={derivedDescription} />
      <meta name="description" content={derivedDescription} />
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
      {noIndex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
    </>
  );
}
