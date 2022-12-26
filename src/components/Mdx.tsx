import { MDXProvider } from "@mdx-js/react";
import React, { useMemo } from "react";
import type { MDXComponents } from "mdx/types";

import Figure from "./Figure";
import Icon from "./Icon";
import LinkButton from "./LinkButton/LinkButton";
import CodeBlock from "./CodeBlock";

// Shortcodes available to MDX content
export const shortcodes: MDXComponents = {
  Figure,
  Icon,
} as const;

// React components that replace HTML components in the markdown
export const overrides: MDXComponents = {
  a: LinkButton as React.ComponentType<JSX.IntrinsicElements["a"]>,
  pre: CodeBlock as React.ComponentType<JSX.IntrinsicElements["pre"]>,
};

export type MdxProps = {
  children: React.ReactNode;
  components?: MDXComponents;
};

/**
 * MDX Renderer, including shortcodes used when writing MDX
 */
export default function Mdx({
  children,
  components,
}: MdxProps): React.ReactElement {
  const componentsMemo = useMemo<MDXComponents>(
    () => ({ ...shortcodes, ...overrides, ...components }),
    [components]
  );
  return <MDXProvider components={componentsMemo}>{children}</MDXProvider>;
}
