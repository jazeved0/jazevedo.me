import React from "react";
import styled from "@emotion/styled";

import GlobalCss from "./GlobalCss";
import ColorModeProvider from "./ColorModeProvider";
import Header from "./Header";
import Footer from "./Footer";

const Styled = {
  OverlayContainer: styled.div`
    /* Create a grid that stacks all elements on top of each other */
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;

    & > * {
      grid-row-start: 1;
      grid-column-start: 1;
    }
  `,
  Layout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-height: 100%;

    & > * {
      flex-shrink: 0;
    }
  `,
};

export type LayoutProps = {
  headerProps?: React.ComponentProps<typeof Header>;
  overlayChildren?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hideFooter?: boolean;
  hideHeader?: boolean;
};

/**
 * Outer component for each page,
 * rendering context providers and the header/footer (if applicable)
 */
export default function Layout({
  headerProps = {},
  overlayChildren,
  children,
  className,
  style,
  hideFooter = false,
  hideHeader = false,
}: LayoutProps): React.ReactElement {
  return (
    <ColorModeProvider>
      <Styled.OverlayContainer>
        {overlayChildren}
        <Styled.Layout>
          <GlobalCss />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {!hideHeader && <Header {...headerProps} />}
          <div style={{ flexGrow: 1, ...style }} className={className}>
            {children}
          </div>
          {!hideFooter && <Footer />}
        </Styled.Layout>
      </Styled.OverlayContainer>
    </ColorModeProvider>
  );
}
