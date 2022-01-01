import styled from "@emotion/styled";

import { scrollBarAuto } from "../theme/mixins";

/**
 * Styled `<pre>` element that automatically styles Prism-highlighted content.
 */
const CodeBlock = styled.pre`
  position: relative;
  margin: 0;
  padding: 0 !important;
  background-color: transparent !important;

  & > code {
    font-size: 1rem;
  }

  ${scrollBarAuto(0.125)}
  overflow: auto;
`;

export default CodeBlock;
