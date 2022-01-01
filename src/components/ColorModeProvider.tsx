import { ThemeToggler } from "gatsby-plugin-dark-mode";
import React, { useMemo } from "react";

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
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }): React.ReactNode => (
        <MemoizedContextProvider
          // This relies on "dark" and "light" both being valid `ColorMode`s
          mode={(theme as ColorMode | null | undefined) ?? defaultMode}
          setMode={toggleTheme}
        >
          {children}
        </MemoizedContextProvider>
      )}
    </ThemeToggler>
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
 */
function MemoizedContextProvider({
  children,
  mode,
  setMode,
}: MemoizedContextProviderProps): React.ReactElement {
  return (
    <ColorModeContext.Provider
      value={useMemo(
        () => ({
          mode,
          setMode,
        }),
        [mode, setMode]
      )}
    >
      {children}
    </ColorModeContext.Provider>
  );
}
