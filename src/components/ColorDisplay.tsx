import React from "react";
import styled from "@emotion/styled";
import { meetsContrastGuidelines, parseToRgb } from "polished";
import type {
  ContrastScores,
  HslColor,
  RgbaColor,
  RgbColor,
} from "polished/lib/types/color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import { gap } from "../theme/spacing";
import { shadow } from "../theme/shadows";
import { color } from "../theme/color";
import { down } from "../theme/media";

const Styled = {
  ColorDisplay: styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex-wrap: wrap;
    --gap: ${gap.micro};
    gap: var(--gap);

    ${down("sm")} {
      gap: var(--site-padding);
    }
  `,
  Color: styled.div`
    width: calc(33.333% - (var(--gap) * (2 / 3)));
    background-color: ${color("bg+15")};
    border-radius: 8px;
    box-shadow: ${shadow("z2")};

    ${down("lg")} {
      width: calc(50% - (var(--gap) * (1 / 2)));
    }

    ${down("sm")} {
      width: 100%;
    }

    /* When forced-colors are enabled, manually add a border
    (the color is ignored) */
    @media (forced-colors: active) {
      border: 1px solid white;
    }
  `,
  Swatch: styled.div`
    width: 100%;
    height: 120px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: ${gap.nano};
    gap: ${gap.pico};
    position: relative;

    /* When forced-colors are enabled, manually add a border
    (the color is ignored) */
    @media (forced-colors: active) {
      border-bottom: 1px solid white;
    }
  `,
  // HACK: use an inner <svg> tag to get the background color to show up
  // in the color swatch, even when forced-colors are enabled. This is bypassing
  // the accessibility overrides, so be careful to ensure all text elements
  // appear above forced-color backgrounds.
  SwatchColor: styled.svg`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  `,
  AccessibilityRating: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-end;
    width: 65px;
    gap: ${gap.atto};
    position: relative;
    z-index: 1;

    /* When forced-colors are enabled, add a fake background-color section
    that will get overridden by the forced-colors background color.
    This ensures that contrast is maintained for the text despite the svg hack */
    @media (forced-colors: active) {
      background-color: white;
    }
  `,
  AccessibilityRatingLabel: styled.div`
    align-self: center;
    font-weight: 600;
    line-height: 1;
    text-align: center;
    &[data-size="small"] {
      font-size: 0.75rem;
    }
    &[data-size="large"] {
      font-size: 0.9rem;
    }
  `,
  AccessibilityRatingResult: styled.div`
    font-size: 0.9rem;
    padding: 0 0 1px;
    color: white;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  `,
  AccessibilityRatingIcon: styled(FontAwesomeIcon)`
    margin-right: ${gap.femto};
    font-size: 90%;
    transform: translateY(1px);
  `,
  Properties: styled.div`
    --gap: ${gap.nano};
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(108px, 1fr));
    gap: var(--gap);
    padding: var(--gap);
  `,
  Property: styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: ${gap.atto};
  `,
  PropertyLabel: styled.div`
    text-transform: uppercase;
    color: ${color("text-faint")};
    font-size: 0.75rem;
    line-height: 1;
  `,
  PropertyValue: styled.div`
    font-size: 1rem;
    line-height: 1;
  `,
};

export type ColorDisplayProps = {
  children: React.ReactNode;
};

/**
 * Container for multiple `<ColorDisplay.Color />` components.
 */
function ColorDisplay({ children }: ColorDisplayProps): React.ReactElement {
  return <Styled.ColorDisplay>{children}</Styled.ColorDisplay>;
}

// Set up and export the aggregate (parent & sub-components):
type ColorDisplayAggregateType = typeof ColorDisplay & {
  Color: typeof Color;
};
const ColorDisplayAggregate: ColorDisplayAggregateType =
  ColorDisplay as ColorDisplayAggregateType;
ColorDisplayAggregate.Color = Color;
export default ColorDisplayAggregate;

// ? --------------
// ? Sub Components
// ? --------------

export type ColorProps = {
  /**
   * Must be a valid CSS color string, and be parse-able by `polished`'s
   * `parseToRgb` function.
   */
  color: string;
  name: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Displays a color swatch with a name. Also includes the accessibility
 * scores for the color as a background color for white/black foregrounds.
 *
 * Based on https://specimens.lekoarts.de/#color-swatch
 */
function Color({
  color: colorProp,
  name,
  className,
  style,
}: ColorProps): React.ReactElement {
  const maybeRgbColor: RgbColor | RgbaColor = parseToRgb(colorProp);
  if ("alpha" in maybeRgbColor) {
    throw new Error("Alpha values are not supported.");
  }
  const rgbColor: RgbColor = maybeRgbColor;
  type ColorProperty = {
    label: string;
    value: string;
  };
  const properties: ColorProperty[] = [
    { label: "Name", value: name },
    { label: "Hex", value: formatRgbHex(rgbColor) },
    { label: "RGB", value: formatRgb(rgbColor) },
    { label: "CMYK", value: formatCmyk(rgbToCmyk(rgbColor)) },
    { label: "HSL", value: formatHsl(rgbToHsl(rgbColor)) },
  ];

  const white = "#ffffff";
  const black = "#000000";
  const whiteContrast: ContrastScores = meetsContrastGuidelines(
    colorProp,
    white
  );
  const blackContrast: ContrastScores = meetsContrastGuidelines(
    colorProp,
    black
  );
  type AccessibilityRating = {
    passes: boolean;
    color: string;
    size: "small" | "large";
    label: string;
  };
  const accessibilityRatings: AccessibilityRating[] = [
    {
      passes: whiteContrast.AA,
      color: white,
      size: "small",
      label: "AA",
    },
    {
      passes: whiteContrast.AALarge,
      color: white,
      size: "large",
      label: "AA Large",
    },
    {
      passes: blackContrast.AA,
      color: black,
      size: "small",
      label: "AA",
    },
    {
      passes: blackContrast.AALarge,
      color: black,
      size: "large",
      label: "AA Large",
    },
  ];
  return (
    <Styled.Color className={className} style={style}>
      <Styled.Swatch>
        <Styled.SwatchColor style={{ backgroundColor: colorProp }} />
        {accessibilityRatings.map(
          ({ passes, color: fgColor, size, label }, i) => (
            <Styled.AccessibilityRating key={i}>
              <Styled.AccessibilityRatingLabel
                data-size={size}
                style={{ color: fgColor }}
              >
                {label}
              </Styled.AccessibilityRatingLabel>
              <Styled.AccessibilityRatingResult data-passes={passes}>
                <Styled.AccessibilityRatingIcon
                  icon={passes ? faCheck : faTimes}
                />
                {passes ? "Pass" : "Fail"}
              </Styled.AccessibilityRatingResult>
            </Styled.AccessibilityRating>
          )
        )}
      </Styled.Swatch>
      <Styled.Properties>
        {properties.map(({ label, value }) => (
          <Styled.Property key={label}>
            <Styled.PropertyLabel>{label}</Styled.PropertyLabel>
            <Styled.PropertyValue>{value}</Styled.PropertyValue>
          </Styled.Property>
        ))}
      </Styled.Properties>
    </Styled.Color>
  );
}

function formatRgbHex(rgbColor: RgbColor): string {
  /* eslint-disable prefer-template */
  return (
    "#" +
    [rgbColor.red, rgbColor.green, rgbColor.blue]
      .map((c) => {
        const hex = c.toString(16).toUpperCase();
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function formatRgb(rgbColor: RgbColor): string {
  return [rgbColor.red, rgbColor.green, rgbColor.blue].join(", ");
}

type CmykColor = {
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
};

function rgbToCmyk(rgbColor: RgbColor): CmykColor {
  const c = 1 - rgbColor.red / 255;
  const m = 1 - rgbColor.green / 255;
  const y = 1 - rgbColor.blue / 255;
  const k = Math.min(c, m, y);
  return {
    cyan: (c - k) / (1 - k),
    magenta: (m - k) / (1 - k),
    yellow: (y - k) / (1 - k),
    black: k,
  };
}

function formatCmyk(cmykColor: CmykColor): string {
  return [
    Math.round(cmykColor.cyan * 100),
    Math.round(cmykColor.magenta * 100),
    Math.round(cmykColor.yellow * 100),
    Math.round(cmykColor.black * 100),
  ].join(", ");
}

function rgbToHsl(rgbColor: RgbColor): HslColor {
  const r = rgbColor.red / 255;
  const g = rgbColor.green / 255;
  const b = rgbColor.blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { hue: 0, saturation: 0, lightness: l };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
    default:
      throw new Error("Unexpected max value");
  }
  return { hue: h / 6, saturation: s, lightness: l };
}

function formatHsl(hslColor: HslColor): string {
  return [
    Math.round(hslColor.hue * 360),
    Math.round(hslColor.saturation * 100),
    Math.round(hslColor.lightness * 100),
  ].join(", ");
}
