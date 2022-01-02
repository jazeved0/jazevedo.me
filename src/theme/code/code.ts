import { mode, ColorMode } from "../color";
import { oneDark } from "./onedark";
import { oneLight } from "./onelight";

/**
 * Gets the css for use in the global CSS root
 */
export function injectCodeGlobals(): string {
  return `
    ${mode(ColorMode.Light)} {
      ${oneLight}
    }

    ${mode(ColorMode.Dark)} {
      ${oneDark}
    }
  `;
}
