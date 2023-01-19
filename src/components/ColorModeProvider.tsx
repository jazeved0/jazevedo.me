import React, { useContext, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useTheme } from "@skagami/gatsby-plugin-dark-mode";

import { useInitialRender, useMediaQuery } from "../hooks";
import { ColorModeContext, ColorMode, defaultMode } from "../theme/color";

export type ColorModeProviderProps = {
  children?: React.ReactNode;
};

/**
 * Context to wrap around the `gatsby-plugin-dark-mode` component,
 * allowing the current color mode to be re-used in multiple places
 */
export default function ColorModeProvider({
  children,
}: ColorModeProviderProps): React.ReactElement {
  const [theme, toggleTheme] = useTheme();
  return (
    <MemoizedContextProvider
      // This relies on "dark" and "light" both being valid `ColorMode`s
      mode={(theme as ColorMode | null) ?? defaultMode}
      setMode={toggleTheme}
    >
      <ThemeMetaInjector />
      {children}
    </MemoizedContextProvider>
  );
}

// ? -----------------
// ? Helper Components
// ? -----------------

type MemoizedContextProviderProps = {
  children?: React.ReactNode;
  mode: ColorMode;
  setMode: (next: ColorMode) => void;
};

/**
 * Wraps the `ColorModeContext.Provider` component to ensure that context values
 * get memoized between renders (since the context value is an object).
 *
 * This is also the location that the forced-colors override is applied.
 * See `useColorMode` for more details on the motivation for this.
 */
function MemoizedContextProvider({
  children,
  mode,
  setMode,
}: MemoizedContextProviderProps): React.ReactElement {
  let derivedMode = mode;
  const usingForcedColor = useMediaQuery("(forced-colors: active)");
  if (usingForcedColor) {
    derivedMode = defaultMode;
  }

  return (
    <ColorModeContext.Provider
      value={useMemo(
        () => ({
          mode: derivedMode,
          setMode,
        }),
        [derivedMode, setMode]
      )}
    >
      {children}
    </ColorModeContext.Provider>
  );
}

/**
 * Uses `react-helmet` to inject the theme color meta tag into the page.
 *
 * Needs to be in a separate component to always re-render after the initial
 * client render (to prevent hydration mismatch).
 */
function ThemeMetaInjector(): React.ReactElement | null {
  const { mode } = useContext(ColorModeContext);
  const initialRender = useInitialRender();
  const derivedMode: ColorMode = initialRender ? defaultMode : mode;

  return (
    <Helmet>
      <meta
        name="color-scheme"
        content={derivedMode === ColorMode.Light ? "light" : "dark"}
      />
    </Helmet>
  );
}
