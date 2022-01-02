import { MDXRenderer } from "gatsby-plugin-mdx";
import { MDXProvider } from "@mdx-js/react";
import React, { useMemo } from "react";

import Figure from "./Figure";
import Icon from "./Icon";
import LinkButton from "./LinkButton/LinkButton";
import CodeBlock from "./CodeBlock";

// Shortcodes available to MDX content
export const shortcodes = {
  Figure,
  Icon,
} as const;

// React components that replace HTML components in the markdown
export const overrides = {
  a: LinkButton,
  pre: CodeBlock,
} as const;

export type MdxProps = {
  content: string;
  components?: Record<string, React.ComponentType<unknown>>;
  passthroughProps?: Record<string, unknown>;
};

/**
 * MDX Renderer, including shortcodes used when writing MDX
 */
export default function Mdx({
  content,
  components,
  passthroughProps,
}: MdxProps): React.ReactElement {
  return (
    <MDXProvider
      components={useMemo(
        () => ({ ...shortcodes, ...overrides, ...components }),
        [components]
      )}
    >
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <MDXRenderer {...passthroughProps}>{content}</MDXRenderer>
    </MDXProvider>
  );
}
