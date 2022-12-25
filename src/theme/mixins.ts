import { rgba, lighten, saturate, transparentize } from "polished";

import { mode, ColorMode, hybridColor, staticColor } from "./color";

/**
 * Exposes `--highlight-color` as a CSS variable
 */
export const highlight = `
  ${mode(ColorMode.Light)} {
    --highlight-color: ${rgba(
      saturate(0.1, hybridColor("primary", ColorMode.Dark)),
      0.15
    )};
  }

  ${mode(ColorMode.Dark)} {
    --highlight-color: ${rgba(
      lighten(0.25, saturate(0.2, hybridColor("primary", ColorMode.Dark))),
      0.35
    )};
  }
`;

/**
 * Exposes `--highlight-color` as a CSS variable
 */
export const strongHighlight = `
  ${mode(ColorMode.Light)} {
    --highlight-color: ${rgba(
      lighten(0.1, saturate(0.15, hybridColor("primary", ColorMode.Dark))),
      0.3
    )};
  }

  ${mode(ColorMode.Dark)} {
    --highlight-color: ${rgba(
      lighten(0.25, saturate(0.35, hybridColor("primary", ColorMode.Dark))),
      0.5
    )};
  }
`;

export const highlightLinks = `
  text-decoration: none;
  color: currentColor;

  ${highlight}
  &:hover,
  &:active {
    ${strongHighlight}
  }

  background: linear-gradient(
    transparent 0%,
    transparent 10%,
    var(--highlight-color) 10%,
    var(--highlight-color) 90%,
    transparent 90%,
    transparent 100%
  );

  /* When forced-colors are enabled, restore the default link
  underline-on-hover behavior */
  @media (forced-colors: active) {
    text-decoration: initial;

    &:hover,
    &:active {
      text-decoration: underline;
    }
  }
`;

const scrollBase = `
  scrollbar-face-color: #646464;
  scrollbar-base-color: #646464;
  scrollbar-3dlight-color: #646464;
  scrollbar-highlight-color: #646464;
  scrollbar-track-color: #000;
  scrollbar-arrow-color: #000;
  scrollbar-shadow-color: #646464;
  scrollbar-dark-shadow-color: #646464;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--scroll-thumb);
    border-radius: 1000px;
    &:hover {
      background-color: var(--scroll-thumb-hover);
    }
    &:active {
      background-color: var(--scroll-thumb-active);
    }
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

/**
 * Utility mixin to add a nice-looking custom scroll-bar
 * that overlays well onto content.
 * @param colorMode - Color scheme for the scrollbar
 */
export function scrollBar(colorMode: ColorMode): string {
  const oppositeFg = staticColor(
    colorMode === ColorMode.Light ? "dark" : "light"
  );
  return `
    --scroll-thumb: ${transparentize(0.75, oppositeFg)};
    --scroll-thumb-hover: ${transparentize(0.65, oppositeFg)};
    --scroll-thumb-active ${transparentize(0.5, oppositeFg)};
    ${scrollBase}
  `;
}

/**
 * Utility mixin to add a nice-looking custom scroll-bar
 * that overlays well onto content.
 * Automatically displays depending on the current color mode.
 */
export function scrollBarAuto(opacity = 0.25): string {
  const lightFg = staticColor("dark");
  const darkFg = staticColor("light");
  const transparency = 1 - opacity;
  return `
    ${mode(ColorMode.Light)} {
      --scroll-thumb: ${transparentize(transparency, lightFg)};
      --scroll-thumb-hover: ${transparentize(transparency * 0.75, lightFg)};
      --scroll-thumb-active ${transparentize(transparency * 0.5, lightFg)};
    }
    ${mode(ColorMode.Dark)} {
      --scroll-thumb: ${transparentize(transparency, darkFg)};
      --scroll-thumb-hover: ${transparentize(transparency * 0.75, darkFg)};
      --scroll-thumb-active ${transparentize(transparency * 0.5, darkFg)};
    }
    ${scrollBase}
  `;
}

/**
 * Mixin to allow scrolling but have the scroll-bar be hidden
 */
export function hiddenScrollbar(): string {
  return `
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
        /* WebKit */
        width: 0;
        height: 0;
    }
  `;
}
