import React, { useEffect, useRef, useState } from "react";

// import { Gradient } from "../vendor/stripe-gradient";
import { useInitialRender } from "../hooks";

let nextID = 0;
function uniqueId(): string {
  const id = String(nextID);
  nextID += 1;
  return id;
}

export type StripeGradientProps = {
  colors: string[];
  onLoad?: () => void;
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
  onLoad,
  className,
  style,
}: StripeGradientProps): React.ReactElement | null {
  // We want to skip rendering this upon first render,
  // since the unique ID created in the state
  // might otherwise be different between server-side-rendering
  // and initial client render;
  const initialRender = useInitialRender();
  // const gradientRef = useRef<Gradient | null>(null);

  const [id] = useState(() => uniqueId());
  const canvasId = `gradient-canvas-${id}`;

  // useEffect(() => {
  //   // Skip effects on the initial render
  //   if (initialRender) return;

  //   // If the second layout effect hasn't yet run, skip this.
  //   // This code only should run when the color changes post-initialization
  //   // (the initial gradient initialization will handle the initial colors).
  //   if (gradientRef.current == null) return;

  //   // Otherwise, update the colors
  //   gradientRef.current.setGradientColors(colors);
  // }, [initialRender, colors]);

  // useEffect(() => {
  //   // Skip effects on the initial render
  //   if (initialRender) return;

  //   const gradient = new Gradient();
  //   gradient.setGradientColors(colors);
  //   if (onLoad != null) {
  //     gradient.setOnLoadCallback(() => {
  //       window.setTimeout(() => onLoad(), 0);
  //     });
  //   }
  //   gradientRef.current = gradient;

  //   // Make the gradient initialization (can be heavy) low-priority:
  //   if ("requestIdleCallback" in window) {
  //     window.requestIdleCallback(
  //       () => {
  //         gradient.initGradient(`#${canvasId}`);
  //       },
  //       { timeout: 1000 }
  //     );
  //   } else {
  //     // On Safari, requestIdleCallback is not supported:
  //     (window as Window).setTimeout(() => {
  //       gradient.initGradient(`#${canvasId}`);
  //     }, 200);
  //   }

  //   // This hook should only run once upon mounting:
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [initialRender]);

  if (initialRender) return null;
  return <canvas id={canvasId} className={className} style={style} />;
}
