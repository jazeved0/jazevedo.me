import styled from "@emotion/styled";
import { lighten, parseToRgb } from "polished";
import React from "react";
import ReactSwitch from "react-switch";

import { useColorMode, useInitialRender } from "../hooks";
import { defaultMode, hybridColor } from "../theme/color";
import { gap } from "../theme/spacing";

const Styled = {
  Wrapper: styled.div`
    line-height: 0;
  `,
  Switch: styled(ReactSwitch)`
    /* Needs nudge */
    vertical-align: -6px;
    line-height: 24px;
    svg {
      position: relative;
      /* Nudges */
      top: 3px;
      left: 8px;
    }
  `,
  SwitchLabel: styled.span`
    margin-left: ${gap.nano};
  `,
};

export type SwitchProps = {
  onChange: (checked: boolean) => void;
  checked: boolean;
  label?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
} & Partial<React.ComponentProps<typeof ReactSwitch>>;

export default function Switch({
  onChange,
  checked,
  label,
  className,
  style,
  ...rest
}: SwitchProps): React.ReactElement {
  // Always re-render once upon first mounting,
  // to ensure that the server-side theme
  // is consistent with the user-selected theme.
  const initialRender = useInitialRender();
  const currentColorMode = useColorMode();
  const colorMode = initialRender ? defaultMode : currentColorMode;

  // react-switch expects colors to be hex strings
  const toHex = (color: string): string => {
    const { red, green, blue } = parseToRgb(color);
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");
    return `#${redHex}${greenHex}${blueHex}`;
  };
  const primaryColor = hybridColor("primary", colorMode);
  const lightColor = hybridColor("light", colorMode);

  return (
    <Styled.Wrapper className={className} style={style}>
      <Styled.Switch
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        offHandleColor={toHex(lightColor)}
        onHandleColor={toHex(lightColor)}
        offColor={toHex(lighten(0.05, primaryColor))}
        onColor={toHex(lighten(0.2, primaryColor))}
        uncheckedIcon={false}
        checkedIcon={false}
        aria-label={label != null ? label.toString() : undefined}
        aria-checked={checked}
        height={24}
        width={48}
        onChange={onChange}
        checked={checked}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {label != null && (
        <Styled.SwitchLabel className="label">{label}</Styled.SwitchLabel>
      )}
    </Styled.Wrapper>
  );
}
