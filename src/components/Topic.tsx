import styled from "@emotion/styled";
import { rgba } from "polished";

import { color, ColorMode, hybridColor, mode } from "../theme/color";

/**
 * Styled `<span>` component that looks like a pill
 */
const Topic = styled.span<{ variant?: "filled" | "hollow" }>`
  border-radius: 1000px;
  padding: 1px 8px;
  border: 2px solid ${color("primary")};
  display: inline-block;
  font-weight: 700;
  font-size: 0.8rem;
  color: ${({ variant }): string =>
    variant === "filled" ? color("light") : color("text-strong")};

  ${mode(ColorMode.Light)} {
    background-color: ${({ variant }): string =>
      variant === "filled"
        ? hybridColor("primary", ColorMode.Light)
        : rgba(hybridColor("primary", ColorMode.Light), 0.2)};
    text-shadow: ${({ variant }): string =>
      variant === "filled" ? "0 0 4px rgba(0, 0, 0, 0.3)" : "none"};
  }

  ${mode(ColorMode.Dark)} {
    background-color: ${({ variant }): string =>
      variant === "filled"
        ? hybridColor("primary", ColorMode.Dark)
        : rgba(hybridColor("primary", ColorMode.Dark), 0.4)};
    text-shadow: ${({ variant }): string =>
      variant === "filled" ? "0 0 4px rgba(0, 0, 0, 0.7)" : "none"};
  }
`;

export default Topic;
