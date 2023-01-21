import { MDXProvider } from "@mdx-js/react";
import React, { useMemo } from "react";
import type { MDXComponents } from "mdx/types";

import Figure from "./Figure";
import Icon from "./Icon";
import LinkButton from "./LinkButton/LinkButton";
import CodeBlock from "./CodeBlock";
import Iframe from "./Iframe";
import { createLinkableHeading } from "./LinkableHeading";

// Shortcodes available to MDX content
export const shortcodes: MDXComponents = {
  Figure,
  Icon,
  Iframe,
} as const;

// React components that replace HTML components in the markdown
export const overrides: MDXComponents = {
  a: LinkButton as React.ComponentType<JSX.IntrinsicElements["a"]>,
  pre: CodeBlock as React.ComponentType<JSX.IntrinsicElements["pre"]>,
};

const linkableHeadingShortcodes: MDXComponents = {
  h1: createLinkableHeading({ component: "h1" }),
  h2: createLinkableHeading({ component: "h2" }),
  h3: createLinkableHeading({ component: "h3" }),
  h4: createLinkableHeading({ component: "h4" }),
  h5: createLinkableHeading({ component: "h5" }),
  h6: createLinkableHeading({ component: "h6" }),
};

export type MdxProps = {
  children: React.ReactNode;
  components?: MDXComponents;
  linkableHeadings?: boolean;
};

/**
 * MDX component provider, including shortcodes used when writing MDX
 */
export default function Mdx({
  children,
  components,
  linkableHeadings = false,
}: MdxProps): React.ReactElement {
  const componentsMemo = useMemo<MDXComponents>(
    () => ({
      ...shortcodes,
      ...overrides,
      ...components,
      ...(linkableHeadings ? linkableHeadingShortcodes : {}),
    }),
    [components, linkableHeadings]
  );
  return <MDXProvider components={componentsMemo}>{children}</MDXProvider>;
}
