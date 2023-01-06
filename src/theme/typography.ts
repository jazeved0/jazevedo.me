/* eslint-disable import/order */

// Font files (copied to site upon build)
// https://www.gatsbyjs.org/docs/importing-assets-into-files/
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";

// Based off Bootstrap 4's body font stack
const baseFontStack =
  `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ` +
  `'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', ` +
  `'Segoe UI Emoji', 'Segoe UI Symbol'`;

const fonts = {
  body: `Lato, ${baseFontStack}`,
  headings: `Lato, ${baseFontStack}`,
  monospace:
    `Lato, SFMono-Regular, Menlo, Monaco, Consolas, ` +
    `'Liberation Mono', 'Courier New', monospace`,
} as const;

export type FontKey = keyof typeof fonts;

/**
 * Extracts a CSS expression to use a design system font
 * @param key - color key to use
 */
export function font(key: FontKey): string {
  return fonts[key];
}

/**
 * Gets the css for use in the global CSS root
 */
export function injectTypographyGlobals(): string {
  return `
    :root {
      font-size: 100%;
    }
    body {
      font-family: ${font("body")};
      font-weight: 400;
      font-size: 1rem;

      h1, h2, h3, h4, h5, h6 {
        font-family: ${font("headings")};
        font-weight: 700;
        line-height: 1.1;
        color: inherit;
      }

      h1 {
        font-size: 2.5rem;
      }

      h2 {
        font-size: 2.1rem;
      }

      h3 {
        font-size: 1.5rem;
      }
    }
  `;
}
