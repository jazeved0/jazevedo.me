import styled from "@emotion/styled";
import React from "react";
import ReactSwitch from "react-switch";

import { useColorMode, useInitialRender } from "../hooks";
import { Color, defaultMode, hybridColor } from "../theme/color";
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
      top: 4px;
      left: 6px;
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
  const primaryColor = Color(hybridColor("primary", colorMode));
  const lightHex = Color(hybridColor("light", colorMode)).toString("hex");

  return (
    <Styled.Wrapper className={className} style={style}>
      <Styled.Switch
        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        offHandleColor={lightHex}
        onHandleColor={lightHex}
        offColor={primaryColor.clone().lighten(5).toString("hex")}
        onColor={primaryColor.clone().lighten(20).toString("hex")}
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
