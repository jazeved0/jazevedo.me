import React from "react";
import styled from "@emotion/styled";

import GlobalCss from "./GlobalCss";
import ColorModeProvider from "./ColorModeProvider";
import Header from "./Header";
import Footer from "./Footer";
import HashLocationProvider from "./HashLocationProvider";

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-height: 100%;
  grid-area: content;

  & > * {
    flex-shrink: 0;
  }
`;

const StyledHeader = styled(Header)`
  grid-area: header;
`;

const StyledFooter = styled(Footer)`
  grid-area: footer;
`;

const Styled = {
  Layout: styled.div`
    display: grid;
    min-height: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header"
      "content"
      "footer";

    & > *:not(${StyledHeader}):not(${StyledFooter}):not(${StyledContent}) {
      grid-area: 1 / 1 / 4 / 2;
    }
  `,
  Content: StyledContent,
  Header: StyledHeader,
  Footer: StyledFooter,
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
      <HashLocationProvider>
        <GlobalCss />
        <Styled.Layout>
          {overlayChildren}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {!hideHeader && <Styled.Header {...headerProps} />}
          <Styled.Content style={style} className={className}>
            {children}
          </Styled.Content>
          {!hideFooter && <Styled.Footer />}
        </Styled.Layout>
      </HashLocationProvider>
    </ColorModeProvider>
  );
}
