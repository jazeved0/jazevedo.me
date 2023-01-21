import React, { useContext } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { useInitialRender } from "../hooks";
import { down, up } from "../theme/media";
import { transition } from "../theme/motion";
import { gap } from "../theme/spacing";
import { HashLocationContext } from "./HashLocationProvider";
import { ColorMode, hybridColor, mode } from "../theme/color";
import { noLinkStylesClass } from "./Article";

// eslint-disable-next-line import/no-webpack-loader-syntax, import/order, import/no-unresolved
import linkIconRawSvg from "!!raw-loader!../images/link-icon.raw.svg";

const rightLink = "right";
const rightMixin = `
  margin-left: 0.5em;
  display: inline-block;
`;
const leftMixin = `
  position: absolute;
  margin-left: -1em;
  padding-right: 0.5em;
  transform: translateX(-8px);

  span {
      vertical-align: -0.4em;
  }
`;
const rightActiveMixin = `transform: translateX(0.25em);`;
const leftActiveMixin = `margin-left: -1.125em !important;`;
const moveBreakpoint = "xxl";

const IconWrapper = styled.span`
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  font-stretch: normal;
  font-size: 1em;
  line-height: inherit;
  border: none !important;
  font-size: 70%;
  left: 0;
  transform: none;

  ${transition(["opacity", "transform"], { important: true })};
  opacity: 0;

  &:not(.${rightLink}) {
    ${down(moveBreakpoint)} {
      ${rightMixin}
    }
    ${up(moveBreakpoint)} {
      ${leftMixin}
    }
  }

  &.${rightLink} {
    ${rightMixin}
  }
`;

function svgDataUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}");`;
}

const activeClass = "active";
const Styled = {
  LinkIcon: styled.span`
    ${mode(ColorMode.Dark)} {
      background-image: ${svgDataUrl(
        linkIconRawSvg.replace(
          "fill:currentColor;",
          `fill:${hybridColor("primary+30", ColorMode.Dark)};`
        )
      )};
    }
    ${mode(ColorMode.Light)} {
      background-image: ${svgDataUrl(
        linkIconRawSvg.replace(
          "fill:currentColor;",
          `fill:${hybridColor("primary+20", ColorMode.Light)};`
        )
      )};
    }

    height: 1em;
    width: 1em;
    display: inline-block;
    background-repeat: no-repeat;
  `,
  IconWrapper,
  AnchorWrapper: styled.a`
    display: block;
    position: relative;
    text-decoration: none;
    color: currentColor;

    &:active,
    &.${activeClass} {
      & ${IconWrapper} {
        opacity: 0.9 !important;
      }
    }

    &:hover,
    &:focus,
    &.${activeClass} {
      & ${IconWrapper} {
        opacity: 0.5;

        &:not(.${rightLink}) {
          ${down(moveBreakpoint)} {
            ${rightActiveMixin}
          }
          ${up(moveBreakpoint)} {
            ${leftActiveMixin}
          }
        }

        &.${rightLink} {
          ${rightActiveMixin}
        }
      }
    }
  `,
  Anchor: styled.div`
    position: absolute;
    left: 0;
    top: -${gap.micro};
  `,
};

export type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type BaseComponent = React.ComponentType<HeadingProps> | HeadingType;
export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

/**
 * Component factory to create a LinkableHeading component, which shows a
 * heading with a clickable link and a corresponding anchor (generated based
 * on the heading's text content).
 *
 * The ID generation is done in the `rehype-slug` plugin.
 */
export function createLinkableHeading({
  component: Component,
  right,
}: {
  component: BaseComponent;
  right?: boolean;
}): React.ComponentType<HeadingProps> {
  function HeadingComponent({
    children,
    id,
    className,
    style,
    ...rest
  }: HeadingProps): React.ReactElement {
    const hash = useContext(HashLocationContext);
    const firstRender = useInitialRender();

    if (id == null) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Component {...rest}>{children}</Component>;
    }

    const active = !firstRender && hash === `#${id ?? ""}`;
    return (
      <Styled.AnchorWrapper
        className={classNames(
          className,
          active && activeClass,
          noLinkStylesClass
        )}
        style={style}
        href={`#${id}`}
      >
        <Styled.Anchor id={id}> </Styled.Anchor>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...rest}>
          {children}
          <Styled.IconWrapper data-placement={right ? "right" : "left"}>
            <Styled.LinkIcon />
          </Styled.IconWrapper>
        </Component>
      </Styled.AnchorWrapper>
    );
  }
  const displayName = `Heading-${String(Component)}`;
  HeadingComponent.displayName = displayName;
  Object.defineProperty(HeadingComponent, "name", { value: displayName });
  return HeadingComponent;
}
