import styled from "@emotion/styled";
import React from "react";

export type IncludeFontsProps = {
  /** Maps font family name to `src` URL */
  fonts: Record<string, string>;
};

const IncludeFontsInner = styled.div`
  ${({ fonts }: IncludeFontsProps): string[] =>
    Object.entries(fonts).map(
      ([family, src]) => `
      @font-face {
        font-family: ${family};
        src: url(${src});
      }
    `
    )}
`;

export default function IncludeFonts({
  fonts,
}: IncludeFontsProps): React.ReactElement {
  return <IncludeFontsInner fonts={fonts} />;
}
