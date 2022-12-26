import React from "react";
import styled from "@emotion/styled";

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
  headerSpacing?: "compact" | "sparse";
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideFooter?: boolean;
  overrideHeaderLinks?: React.ReactNode;
};

/**
 * Outer component for each page,
 * rendering context providers and the header/footer (if applicable)
 */
export default function Layout({
  headerSpacing,
  children,
  className,
  style,
  hideFooter = false,
  overrideHeaderLinks,
}: LayoutProps): React.ReactElement {
  return (
    <ColorModeProvider>
      <Styled.Layout>
        <GlobalCss />
        <Header spacing={headerSpacing} overrideLinks={overrideHeaderLinks} />
        <div style={{ flexGrow: 1, ...style }} className={className}>
          {children}
        </div>
        {!hideFooter && <Footer />}
      </Styled.Layout>
    </ColorModeProvider>
  );
}
