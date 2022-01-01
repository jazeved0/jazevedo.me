import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
} from "react";
import shallowEqual from "shallow-equals";

import { ColorMode, ColorModeContext } from "./theme/color";
import {
  BreakpointKey,
  breakpoint,
  maxWidth,
  minWidth,
  betweenWidth,
} from "./theme/media";

/**
 * Gets the current active color mode.
 * **Note**: care should be taken when using this to render on the server,
 * as there may be a flash upon initially rendering.
 * Additionally, if the initial render disagrees with the server-side render,
 * hydration may produce unexpected behavior.
 * When using this hook, consider also using `useInitialRender()`
 * to skip out on the server-side render.
 * In server side rendering, this returns `defaultMode`.
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
 * @param queries - List of query strings
 * @param values - List of matching values
 * @param defaultValue - Default value to use if none match
 */
export function useMedia<T>(
  queries: string[],
  values: T[],
  defaultValue: T
): T {
  const memoizedQueries = useShallowStability(queries);
  const memoizedValues = useShallowStability(values);

  // Array containing a media query list for each query
  const mediaQueryLists = useMemo(
    () =>
      memoizedQueries.map((q) =>
        typeof window === "undefined"
          ? {
              matches: false,
              addListener: (): null => null,
              removeListener: (): null => null,
            }
          : window.matchMedia(q)
      ),
    [memoizedQueries]
  );

  // Function that gets value based on matching media query
  const getValue = useCallback((): T => {
    // Get index of first media query that matches
    const index = mediaQueryLists.findIndex((mql) => mql.matches);
    // Return related value or defaultValue if none
    return typeof memoizedValues[index] !== "undefined"
      ? memoizedValues[index]
      : defaultValue;
  }, [defaultValue, memoizedValues, mediaQueryLists]);

  // State and setter for matched value
  const [value, setValue] = useState(getValue);

  useEffect(() => {
    // Event listener callback
    // Note: By defining getValue outside of useEffect we ensure that it has ...
    // ... current values of hook args
    // (as this hook callback is created once on mount).
    const handler = (): void => setValue(getValue);
    // Set a listener for each media query with above handler as callback.
    mediaQueryLists.forEach((mql) => mql.addListener(handler));
    // Remove listeners on cleanup
    return (): void =>
      mediaQueryLists.forEach((mql) => mql.removeListener(handler));
  }, [getValue, mediaQueryLists]);

  return value;
}

/**
 * Determines if the current screen size is larger than the given breakpoint
 * @param b - breakpoint key
 */
export function useUp(b: BreakpointKey): boolean {
  const breakpoints = useMemo(() => [minWidth(breakpoint(b))], [b]);
  const values = useMemo(() => [true], []);
  return useMedia(breakpoints, values, false);
}

/**
 * Determines if the current screen size is smaller than the given breakpoint
 * @param b - breakpoint key
 */
export function useDown(b: BreakpointKey): boolean {
  const breakpoints = useMemo(() => [maxWidth(breakpoint(b))], [b]);
  const values = useMemo(() => [true], []);
  return useMedia(breakpoints, values, false);
}

/**
 * Determines if the current screen size is between the two given breakpoints
 * @param a - lower breakpoint key
 * @param b - upper breakpoint key
 */
export function useBetween(a: BreakpointKey, b: BreakpointKey): boolean {
  const breakpoints = useMemo(
    () => [betweenWidth(breakpoint(a), breakpoint(b))],
    [a, b]
  );
  const values = useMemo(() => [true], []);
  return useMedia(breakpoints, values, false);
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
