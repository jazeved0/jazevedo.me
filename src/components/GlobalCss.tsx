import React from "react";
import { css, Global } from "@emotion/react";

import { color, injectColorGlobals } from "../theme/color";
import { injectTypographyGlobals } from "../theme/typography";
import { injectLayoutGlobals } from "../theme/layout";
import { injectCodeGlobals } from "../theme/code/code";

/**
 * Prepares the browser reset and other global styles.
 * Browser reset from:
 * https://hankchizljaw.com/wrote/a-modern-css-reset/
 */
export default function GlobalCss(): React.ReactElement {
  return (
    <Global
      styles={css`
        ${injectColorGlobals()}
        ${injectTypographyGlobals()}
        ${injectLayoutGlobals()}
        ${injectCodeGlobals()}

        /* Box sizing rules */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* Remove default margin */
        body,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        ul,
        ol,
        li,
        figure,
        figcaption,
        blockquote,
        dl,
        dd {
          margin: 0;
        }

        html,
        body {
          height: 100%;
          margin: 0;
        }

        /* Set core body defaults */
        body {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeSpeed;

          line-height: 1.5;
          color: ${color("text")};
          background-color: ${color("bg")};
        }

        /* Make the elements that appear above the layout in the DOM
        stretch to full-height */
        #___gatsby,
        #gatsby-focus-wrapper {
          height: 100%;
        }

        /* Remove list styles on ul, ol elements with a class attribute */
        ul[class],
        ol[class] {
          list-style: none;
        }

        /* Inherit fonts for inputs and buttons */
        input,
        button,
        textarea,
        select {
          font: inherit;
        }

        /* Remove all animations and transitions for people that prefer not to see them */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}
    />
  );
}
