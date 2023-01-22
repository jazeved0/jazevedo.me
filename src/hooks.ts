import type React from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MouseEvent } from "react";
import shallowEqual from "shallow-equals";

import type { ColorMode } from "./theme/color";
import { ColorModeContext } from "./theme/color";
import type { BreakpointKey } from "./theme/media";
import { breakpoint, maxWidth, minWidth, betweenWidth } from "./theme/media";

/**
 * Gets the current active color mode.
 *
 * **Note**: care should be taken when using this to render on the server,
 * as there may be a flash upon initially rendering.
 * Additionally, if the initial render disagrees with the server-side render,
 * hydration may produce unexpected behavior.
 * When using this hook, consider also using `useInitialRender()`
 * to skip out on the server-side render.
 * In server side rendering, this returns `defaultMode`.
 *
 * **Note**: this hook always returns `defaultMode` when forced-colors are
 * enabled. This is to prevent bugs resulting from the appearance of the
 * page differing slightly between selected themes if the appropriate overrides
 * are not in place. This is implemented at the context root.
 */
export function useColorMode(): ColorMode {
  return useContext(ColorModeContext).mode;
}

/**
 * Attempts to stabilize a value by using its last-supplied value if
 * the current and previous values are shallowly equal
 * @param value - Current value
 */
export function useShallowStability<T>(value: T): T {
  const prevRef = useRef<{ prev: T }>({ prev: value });
  if (shallowEqual(prevRef.current.prev, value)) {
    return prevRef.current.prev;
  }

  return value;
}

/**
 * Executes media queries.
 * From https://usehooks.com/useMedia/
 * @param queries - Map of media queries to values when they match
 * @param defaultValue - Default value to use if none match
 */
export function useMedia<T>(queries: Record<string, T>, defaultValue: T): T {
  const memoizedQueries = useShallowStability(queries);

  // Convert the query map into two arrays for the media queries and values.
  // The array is sorted by the media queries (using lexicographical order).
  const [memoizedQueryLists, memoizedValues] = useMemo<
    [MediaQueryList[], T[]]
  >(() => {
    const sortedQueries = Object.keys(memoizedQueries).sort();
    const values = sortedQueries.map((q) => memoizedQueries[q]);
    const queryLists = sortedQueries.map<MediaQueryList>((q) =>
      typeof window === "undefined"
        ? // Create a shim for the MediaQueryList interface
          {
            matches: false,
            media: q,
            addListener: (): null => null,
            removeListener: (): null => null,
            addEventListener: (): null => null,
            removeEventListener: (): null => null,
            onchange: null,
            dispatchEvent: (): boolean => false,
          }
        : window.matchMedia(q)
    );
    return [queryLists, values];
  }, [memoizedQueries]);

  // Function that gets value based on matching media query
  const getValue = useCallback((): T => {
    // Get index of first media query that matches
    const index = memoizedQueryLists.findIndex((mql) => mql.matches);
    // Return related value or defaultValue if none
    return typeof memoizedValues[index] !== "undefined"
      ? memoizedValues[index]
      : defaultValue;
  }, [defaultValue, memoizedValues, memoizedQueryLists]);

  // State and setter for matched value
  const [value, setValue] = useState(getValue);

  useEffect(() => {
    // Event listener callback
    // Note: By defining getValue outside of useEffect we ensure that it has ...
    // ... current values of hook args
    // (as this hook callback is created once on mount).
    const handler = (): void => setValue(getValue);
    // Set a listener for each media query with above handler as callback.
    memoizedQueryLists.forEach((mql) => mql.addListener(handler));
    // Remove listeners on cleanup
    return (): void =>
      memoizedQueryLists.forEach((mql) => mql.removeListener(handler));
  }, [getValue, memoizedQueryLists]);

  return value;
}

/**
 * Simplified version of `useMedia` that only accepts a single media query
 * and determines whether it matches or not.
 * @param query - Media query to match
 * @returns Whether the media query matches or not
 */
export function useMediaQuery(query: string): boolean {
  const mediaQueries = useMemo(() => ({ [query]: true }), [query]);
  return useMedia<boolean>(mediaQueries, false);
}

/**
 * Determines if the current screen size is larger than the given breakpoint
 * @param b - breakpoint key
 */
export function useUp(b: BreakpointKey): boolean {
  return useMediaQuery(minWidth(breakpoint(b)));
}

/**
 * Determines if the current screen size is smaller than the given breakpoint
 * @param b - breakpoint key
 */
export function useDown(b: BreakpointKey): boolean {
  return useMediaQuery(maxWidth(breakpoint(b)));
}

/**
 * Determines if the current screen size is between the two given breakpoints
 * @param a - lower breakpoint key
 * @param b - upper breakpoint key
 */
export function useBetween(a: BreakpointKey, b: BreakpointKey): boolean {
  return useMediaQuery(betweenWidth(breakpoint(a), breakpoint(b)));
}

export type UseDragResult = {
  dragStart: (ev: MouseEvent) => void;
  dragStop: () => void;
  dragMove: (ev: MouseEvent, cb: (posDif: number) => void) => void;
  dragging: boolean;
  position: React.RefObject<number>;
  setDragging: (next: boolean) => void;
};

/**
 * Handles mouse drag behavior for horizontal carousels.
 * From:
 * - https://codesandbox.io/s/react-horizontal-scrolling-menu-v2-drag-by-mouse-o3u2t
 * - https://www.npmjs.com/package/react-horizontal-scrolling-menu
 * - https://github.com/asmyshlyaev177/react-horizontal-scrolling-menu
 */
export function useDrag(): UseDragResult {
  const [clicked, setClicked] = useState(false);
  const [dragging, setDragging] = useState(false);
  const position = useRef(0);

  const dragStart = useCallback((ev: MouseEvent) => {
    position.current = ev.clientX;
    setClicked(true);
  }, []);

  const dragStop = useCallback(
    () =>
      // NOTE: need some delay so item under cursor won't be clicked
      window.requestAnimationFrame(() => {
        setDragging(false);
        setClicked(false);
      }),
    []
  );

  const dragMove = (ev: MouseEvent, cb: (posDif: number) => void): void => {
    const newDiff = position.current - ev.clientX;

    const movedEnough = Math.abs(newDiff) > 5;

    if (clicked && movedEnough) {
      setDragging(true);
    }

    if (dragging && movedEnough) {
      position.current = ev.clientX;
      cb(newDiff);
    }
  };

  return {
    dragStart,
    dragStop,
    dragMove,
    dragging,
    position,
    setDragging,
  };
}

/**
 * Always causes the component to render twice,
 * returning whether the render is the initial render or not.
 */
export function useInitialRender(): boolean {
  const [initialRender, setInitialRender] = useState(true);
  useEffect(() => setInitialRender(false), []);
  return initialRender;
}

/**
 * Handles capturing scrolling when the mouse is inside the ref.
 * From: https://stackoverflow.com/a/66687839/13192375
 * @author dorsta
 */
export function useHorizontalScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): void {
  useEffect((): (() => void) => {
    const el = ref.current;
    if (el) {
      const onWheel = (e: WheelEvent): void => {
        if (e.deltaY === 0) return;
        if (
          !(el.scrollLeft === 0 && e.deltaY < 0) &&
          !(
            el.scrollWidth - el.clientWidth - Math.round(el.scrollLeft) === 0 &&
            e.deltaY > 0
          )
        ) {
          e.preventDefault();
        }
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          // behavior: "smooth",
        });
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return (): void => el.removeEventListener("wheel", onWheel);
    }

    return (): void => undefined;
  }, [ref]);
}

type AugmentedWindow = {
  debug: Record<string, (...args: never[]) => unknown>;
  __global_debug_handles: Record<string, ((...args: never[]) => unknown)[]>;
};

type MaybeAugmentedWindow = Partial<AugmentedWindow>;

/**
 * Augments the global `window` object with a `debug` object that includes
 * the given callback functions.
 *
 * If multiple callbacks are registered for the same name, they will each
 * be called in the order they were registered.
 */
export function useGlobalDebugHandle<
  T extends Record<string, (...args: never[]) => unknown>
>(handles: T, dependencies: unknown[]): void {
  /* eslint-disable no-underscore-dangle */
  useEffect(() => {
    const globalWindow = window as unknown as MaybeAugmentedWindow;
    if (!globalWindow.debug) {
      globalWindow.debug = {};
    }
    if (!globalWindow.__global_debug_handles) {
      globalWindow.__global_debug_handles = {};
    }

    const augmentedGlobalWindow = globalWindow as AugmentedWindow;
    Object.entries(handles).forEach(([name, handle]) => {
      if (!augmentedGlobalWindow.__global_debug_handles[name]) {
        augmentedGlobalWindow.__global_debug_handles[name] = [];
      }
      augmentedGlobalWindow.__global_debug_handles[name].push(handle);
      augmentedGlobalWindow.debug[name] = (...args: never[]): void => {
        augmentedGlobalWindow.__global_debug_handles[name].forEach((h) =>
          h(...args)
        );
      };
    });

    return (): void => {
      Object.entries(handles).forEach(([name, handle]) => {
        // Remove the specific handle that was previously registered.
        augmentedGlobalWindow.__global_debug_handles[name] =
          augmentedGlobalWindow.__global_debug_handles[name].filter(
            (h) => h !== handle
          );

        // If there are no more handles for this name, remove the name from the debug object.
        if (augmentedGlobalWindow.__global_debug_handles[name].length === 0) {
          delete augmentedGlobalWindow.debug[name];
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  /* eslint-enable no-underscore-dangle */
}

export type PreviousValueOption<T> =
  | {
      render: "first";
    }
  | {
      render: "other";
      value: T;
    };

/**
 * Gets the previous value of some parameter.
 * Taken from https://usehooks.com/usePrevious/.
 */
export function usePreviousValue<T>(val: T): PreviousValueOption<T> {
  const ref = useRef<PreviousValueOption<T>>({ render: "first" });
  useEffect(() => {
    ref.current = { render: "other", value: val };
  }, [val]);

  return ref.current;
}
