import React from "react";
import styled from "@emotion/styled";

import Meta from "./Meta";
import GlobalCss from "./GlobalCss";
import ColorModeProvider from "./ColorModeProvider";
import Header from "./Header";
import Footer from "./Footer";

const Styled = {
  Layout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    height: 100vh;

    & > * {
      flex-shrink: 0;
    }
  `,
};

export type LayoutProps = {
  title: string;
  headerSpacing?: "compact" | "sparse";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideFooter?: boolean;
};

/**
 * Outer component for each page,
 * rendering context providers and the header/footer (if applicable)
 */
export default function Layout({
  title,
  headerSpacing,
  children,
  className,
  style,
  hideFooter = false,
}: LayoutProps): React.ReactElement {
  return (
    <ColorModeProvider>
      <Styled.Layout>
        <GlobalCss />
        <Meta title={title} />
        <Header spacing={headerSpacing} />
        <div style={{ flexGrow: 1, ...style }} className={className}>
          {children}
        </div>
        {!hideFooter && <Footer />}
      </Styled.Layout>
    </ColorModeProvider>
  );
}
