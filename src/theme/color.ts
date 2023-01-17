import { parseToRgb } from "polished";
import React from "react";

/**
 * Page-wide color mode (light/dark)
 */
// eslint-disable-next-line no-shadow
export enum ColorMode {
  Dark = "dark",
  Light = "light",
}
const allColorModeKeys = Object.keys(ColorMode).filter(
  (x) => !(parseInt(x, 10) >= 0)
) as Array<keyof typeof ColorMode>;
export function getColorModeKey(
  toConvertMode: ColorMode
): keyof typeof ColorMode {
  // Reverse lookup into the ColorMode enum
  return allColorModeKeys.find((k) => ColorMode[k] === toConvertMode) ?? "Dark";
}

export const defaultMode: ColorMode = ColorMode.Dark;
const nonDefaultModes = Object.values(ColorMode).filter(
  (m) => m !== defaultMode
);

export type ColorModeContextType = {
  mode: ColorMode;
  setMode: (newMode: ColorMode) => void;
};

export const ColorModeContext = React.createContext<ColorModeContextType>({
  mode: defaultMode,
  setMode: () => null,
});

// Dynamic colors that change depending on the theme
const colors = {
  [ColorMode.Light]: {
    // Foreground colors
    text: "rgba(33, 33, 33, 0.8)",
    "text-strong": "rgb(33, 33, 33)",
    "text-faint": "rgba(33, 33, 33, 0.6)",
    "text-weak": "rgba(33, 33, 33, 0.4)",
    "text-ghost": "rgba(33, 33, 33, 0.03)",
    "text-ghost+1": "rgba(33, 33, 33, 0.05)",
    "text-ghost+2": "rgba(33, 33, 33, 0.08)",
    "text-ghost+3": "rgba(33, 33, 33, 0.12)",
    // Background colors
    "bg+20": "#ffffff",
    "bg+15": "#ffffff",
    "bg+10": "#f9fbfc",
    "bg+5": "#ECF3F7",
    bg: "#dfeaf2",
    "bg-5": "#CDDEEB",
    "bg-10": "#C4D6E5",
    // Other colors
    "primary+10": "#627dd3",
    primary: "#506FCE",
    "primary-10": "#4864b9",
    shadowLight: "rgba(0, 0, 0, 0.06)",
    shadowMedium: "rgba(0, 0, 0, 0.075)",
    shadowBold: "rgba(0, 0, 0, 0.09)",
    shadowHeavy: "rgba(0, 0, 0, 0.3)",
    shadowContrast: "rgba(255, 255, 255, 0.3)",
  },
  [ColorMode.Dark]: {
    // Foreground colors
    text: "rgba(231, 243, 249, 0.85)",
    "text-strong": "rgb(231, 243, 249)",
    "text-faint": "rgba(231, 243, 249, 0.6)",
    "text-weak": "rgba(231, 243, 249, 0.4)",
    "text-ghost": "rgba(231, 243, 249, 0.05)",
    "text-ghost+1": "rgba(231, 243, 249, 0.07)",
    "text-ghost+2": "rgba(231, 243, 249, 0.1)",
    "text-ghost+3": "rgba(231, 243, 249, 0.15)",
    // Background colors
    "bg+20": "#363D53",
    "bg+15": "#30374E",
    "bg+10": "#282F47",
    "bg+5": "#222942",
    bg: "#1b233c",
    "bg-5": "#171E33",
    "bg-10": "#13192a",
    // Other colors
    "primary+10": "#4760aa",
    primary: "#324ea1",
    "primary-10": "#2d4691",
    shadowLight: "rgba(0, 0, 0, 0.08)",
    shadowMedium: "rgba(0, 0, 0, 0.12)",
    shadowBold: "rgba(0, 0, 0, 0.18)",
    shadowHeavy: "rgba(0, 0, 0, 0.5)",
    shadowContrast: "rgba(0, 0, 0, 0.2)",
  },
};

// Static colors that don't change depending on the theme
const staticColors = {
  light: "rgb(232, 234, 235)",
  dark: "rgb(22, 24, 30)",
};

// Other colors
export const backgroundColor = "#21283B";
export const themeColor = "#2f3b56";
export const maskIconColor = "#9e6276";
export const chromePdfBackground = "#525659";
export const riskOceanColor = "#1d2951";

// Whenever changing these, make sure to re-generate the fallbacks
// in `src/images/hero` by taking 1080p screenshots of:
// https://codepen.io/jazeved0/pen/xxXpBEX
export const HeroBackgroundColors = {
  [ColorMode.Light]: ["#afc0f7", "#8ed3ee", "#5ea1ee", "#c9a5eb"],
  [ColorMode.Dark]: ["#122557", "#1a3063", "#011542", "#452f61"],
} as const;

/**
 * Bootstrap-like variant, using colors injected from the theme.
 * See https://getbootstrap.com/docs/4.0/content/tables/#contextual-classes
 *
 * Currently `never`, more can be added later.
 */
export type Variant = never;

type DynamicColorTable = typeof colors[keyof typeof colors];
export type DynamicColorKey = keyof DynamicColorTable;
export type StaticColorKey = keyof typeof staticColors;
export type ColorKey = DynamicColorKey | StaticColorKey;

// Assert: Themes must contain same keys.
// If there is a type error in this block, then check the theme definitions
type ThemeDifference<A extends ColorMode, B extends ColorMode> = Exclude<
  typeof colors[A],
  typeof colors[B]
>;
type MustBeEmpty1 = ThemeDifference<ColorMode.Light, ColorMode.Dark>;
type MustBeEmpty2 = ThemeDifference<ColorMode.Dark, ColorMode.Light>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const n1: never = null as MustBeEmpty1;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const n2: never = null as MustBeEmpty2;

// Assert: Variant should only contain keys from the theme
// If there is a type error in this block,
// then check the definition of `Variant`
type MustBeEmpty3 = Exclude<Variant, ColorKey>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const n3: never = null as MustBeEmpty3;

export function toVariable(key: string): string {
  return `--c-${key.replace("+", "_plus_")}`;
}

/**
 * Extracts a CSS expression to use a design system color
 * @param key - color key to use
 */
export function color(key: ColorKey): string {
  if (key in staticColors) {
    return staticColors[key as StaticColorKey];
  }
  return `var(${toVariable(key)})`;
}

/**
 * Creates variable definition statements for all dynamic colors in a color mode
 * @param map - source theme/color map
 * @param colorMode - desired color mode from which to use colors
 */
export function makeVariableDefinitions(
  map: Record<ColorMode, Record<string, string>>,
  colorMode: ColorMode
): string {
  return Object.entries(map[colorMode])
    .map(([key, value]) => `${toVariable(key as ColorKey)}: ${value};`)
    .join("");
}

/**
 * Gets the css for use in the global CSS root
 * @param map - source theme/color map
 */
export function makeRootDefinitions(
  map: Record<ColorMode, Record<string, string>>
): string {
  return (
    makeVariableDefinitions(map, defaultMode) +
    Object.values(ColorMode)
      .filter((colorMode) => defaultMode !== colorMode)
      .map(
        (colorMode) =>
          `&.${colorMode} { ${makeVariableDefinitions(map, colorMode)} }`
      )
      .join(" ")
  );
}

/**
 * Gets the css for use in the global CSS root
 */
export function injectColorGlobals(): string {
  return `body { ${makeRootDefinitions(colors)} }`;
}

/**
 * Gets the (unchanging) raw string value of the given static color key
 * @param key - static color key to get the color for
 */
export function staticColor(key: StaticColorKey): string {
  return staticColors[key];
}

/**
 * Gets the (unchanging) raw string value of the given dynamic color key
 * under the given color mode (uses `defaultMode` as a fallback).
 * **Will not be reactive to the app's theme**.
 * To use a reactive version, see `color` for CSS
 * and `useColorMode` + `hybridColor` for JavaScript
 * @param key - dynamic color key to get the color for
 * @param colorMode - color mode to use when looking up actual value
 */
export function dynamicColor(
  key: DynamicColorKey,
  colorMode: ColorMode = defaultMode
): string {
  return colors[colorMode][key];
}

/**
 * Creates a selector for the given color mode
 * @param colorMode - desired color mode
 */
export function mode(colorMode: ColorMode): string {
  // Make sure the default mode renders correctly on non-js browsers
  if (colorMode === defaultMode)
    return `body${nonDefaultModes.map((m) => `:not(.${m})`).join("")} &`;
  return `body.${colorMode} &`;
}

/**
 * Splits a color into a "r, g, b" string for use in opacity-enabled variables.
 * See https://blog.jim-nielsen.com/2019/generating-shades-of-color-using-css-variables/
 * @param baseColor - base color string
 */
export function splitColor(baseColor: string): string {
  const { red, green, blue } = parseToRgb(baseColor);
  return `${red}, ${green}, ${blue}`;
}

/**
 * Gets the (unchanging) raw string value of the given color key
 * under the given color mode (uses `defaultMode` as a fallback).
 * **Will not be reactive to the app's theme**.
 * To use a reactive version, see `color` for CSS
 * and include `useColorMode` for JavaScript
 * @param key - dynamic color key to get the color for
 * @param colorMode - color mode to use when looking up actual value
 */
export function hybridColor(
  key: ColorKey,
  colorMode: ColorMode = defaultMode
): string {
  if (key in staticColors) {
    return staticColors[key as StaticColorKey];
  }
  return (colors[colorMode] ?? colors[defaultMode])[key as DynamicColorKey];
}
