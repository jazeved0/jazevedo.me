import { down, BreakpointKey } from "./media";
import { gap } from "./spacing";

export const sitePaddingVariable = `--site-padding`;
export const contentWidthVariable = `--content-width`;
export const sitePadding = `var(${sitePaddingVariable})`;
export const contentWidth = `var(${contentWidthVariable})`;
export const minimizeBreakpoint: BreakpointKey = "md";

/**
 * Gets the css for use in the global CSS root
 */
export function injectLayoutGlobals(): string {
  return `
    :root {
      ${sitePaddingVariable}: ${gap.milli};
      ${contentWidthVariable}: 1260px;
      ${down("xl")} {
        ${contentWidthVariable}: 960px;
      }
      ${down("lg")} {
        ${contentWidthVariable}: 640px;
      }
      ${down("md")} {
        ${sitePaddingVariable}: ${gap.micro};
      }
      ${down("vs")} {
        ${sitePaddingVariable}: ${gap.nano};
      }
    }
  `;
}

/**
 * Mixin that creates a responsive container
 */
export const container = `
  position: relative;
  z-index: 0;

  display: grid;
  grid-template-columns:
    ${sitePadding}
    1fr
    min(${contentWidth}, calc(100% - (2 * ${sitePadding})))
    1fr
    ${sitePadding};

  & > * {
    grid-column: 3;
  }
`;
