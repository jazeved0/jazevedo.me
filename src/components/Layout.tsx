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
  headerProps?: React.ComponentProps<typeof Header>;
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
  headerProps = {},
  children,
  className,
  style,
  hideFooter = false,
}: LayoutProps): React.ReactElement {
  return (
    <ColorModeProvider>
      <Styled.Layout>
        <GlobalCss />
        <Header {...headerProps} />
        <div style={{ flexGrow: 1, ...style }} className={className}>
          {children}
        </div>
        {!hideFooter && <Footer />}
      </Styled.Layout>
    </ColorModeProvider>
  );
}
