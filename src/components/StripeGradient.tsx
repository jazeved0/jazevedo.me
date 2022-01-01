import React, { useLayoutEffect, useRef, useState } from "react";

import { Gradient } from "../vendor/stripe-gradient";
import { useInitialRender } from "../hooks";

let nextID = 0;
function uniqueId(): string {
  const id = String(nextID);
  nextID += 1;
  return id;
}

export type StripeGradientProps = {
  colors: string[];
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Displays an animated wavy background,
 * using a Canvas and Stripe's Gradient class
 * to render the background using WebGL:
 * https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/
 *
 * `colors` should be stable between renders
 * when its elements don't change,
 * otherwise the canvas will be unnecessarily re-initialized.
 */
export default function StripeGradient({
  colors,
  className,
  style,
}: StripeGradientProps): React.ReactElement | null {
  // We want to skip rendering this upon first render,
  // since the unique ID created in the state
  // might otherwise be different between server-side-rendering
  // and initial client render;
  const initialRender = useInitialRender();
  const gradientRef = useRef<Gradient | null>(null);

  const [id] = useState(() => uniqueId());
  const canvasId = `gradient-canvas-${id}`;

  useLayoutEffect(() => {
    // Skip effects on the initial render
    if (initialRender) return;

    // If the second layout effect hasn't yet run, skip this
    if (gradientRef.current == null) return;

    // Otherwise, update the colors
    gradientRef.current.setGradientColors(colors);
  }, [initialRender, colors]);

  useLayoutEffect(() => {
    // Skip effects on the initial render
    if (initialRender) return;

    const gradient = new Gradient();
    gradient.setGradientColors(colors);
    gradient.initGradient(`#${canvasId}`);

    gradientRef.current = gradient;
    // This hook should only run once upon mounting:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRender]);

  if (initialRender) return null;
  return <canvas id={canvasId} className={className} style={style} />;
}
