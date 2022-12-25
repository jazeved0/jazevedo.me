import styled from "@emotion/styled";

import { scrollBarAuto } from "../theme/mixins";

/**
 * Styled `<pre>` element that automatically styles Prism-highlighted content.
 */
const CodeBlock = styled.pre`
  position: relative;
  margin: 0;

  /* Important required to override one-{dark,light} theme files:
  (included in /src/components/GlobalCss.tsx) */
  padding: 0 !important;
  background-color: transparent !important;

  & > code {
    font-size: 1rem;
  }

  ${scrollBarAuto(0.125)}
  overflow: auto;

  /* When forced-colors are enabled, the pre element already has a border
  (due to the invisible 1px border added in the one-{dark,light} theme files).
  Add padding internal to the element to improve the aesthetics of the border. */
  @media (forced-colors: active) {
    /* Important required to override above important: */
    padding: 16px !important;
  }
`;

export default CodeBlock;
