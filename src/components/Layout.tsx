import React from "react";
import styled from "@emotion/styled";

import GlobalCss from "./GlobalCss";
import ColorModeProvider from "./ColorModeProvider";
import Header from "./Header";
import Footer from "./Footer";

const Styled = {
  ScrollContainer: styled.div`
    overflow: auto;
    height: 100vh;
  `,
  OverlayContainer: styled.div`
    /* Create a grid that stacks all elements on top of each other */
    display: grid;
    grid-template-columns: 1fr;

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
    min-height: 100vh;

    & > * {
      flex-shrink: 0;
    }
  `,
};

export type LayoutProps = {
  headerProps?: React.ComponentProps<typeof Header>;
  overlayChildren?: React.ReactNode;
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
  overlayChildren,
  children,
  className,
  style,
  hideFooter = false,
}: LayoutProps): React.ReactElement {
  return (
    <ColorModeProvider>
      <Styled.ScrollContainer>
        <Styled.OverlayContainer>
          {overlayChildren}
          <Styled.Layout>
            <GlobalCss />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Header {...headerProps} />
            <div style={{ flexGrow: 1, ...style }} className={className}>
              {children}
            </div>
            {!hideFooter && <Footer />}
          </Styled.Layout>
        </Styled.OverlayContainer>
      </Styled.ScrollContainer>
    </ColorModeProvider>
  );
}
