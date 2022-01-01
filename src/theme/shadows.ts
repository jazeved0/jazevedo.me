import { color } from "./color";

const shadows = {
  z0: [
    `0 3px  6px  ${color("shadowLight")}`,
    `0 3px  6px  ${color("shadowMedium")}`,
  ].join(","),
  z1: [
    `0 6px  12px ${color("shadowLight")}`,
    `0 4px   5px ${color("shadowMedium")}`,
  ].join(","),
  z2: [
    `0 10px 20px ${color("shadowMedium")}`,
    `0 6px  6px  ${color("shadowMedium")}`,
  ].join(","),
  z3: [
    `0 14px 28px ${color("shadowBold")}`,
    `0 10px 10px ${color("shadowMedium")}`,
  ].join(","),
  z4: [
    `0 20px 38px ${color("shadowBold")}`,
    `0 15px 15px ${color("shadowBold")}`,
  ].join(","),
  z5: [
    `0 35px 52px ${color("shadowBold")}`,
    `0 25px 25px ${color("shadowBold")}`,
  ].join(","),
  innerTop: `inset 0 11px 8px -10px ${color("shadowMedium")}`,
  contrast: [
    `0 5px 20px ${color("shadowContrast")}`,
    `0 3px  6px  ${color("shadowContrast")}`,
  ].join(","),
} as const;

/**
 * Shadow type
 */
export type ShadowKey = keyof typeof shadows;

/**
 * Extracts a CSS expression for a shadow
 * @param key - Shadow type
 */
export function shadow<K extends ShadowKey>(key: K): typeof shadows[K] {
  return shadows[key];
}
