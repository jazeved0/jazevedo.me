import React from "react";
import type { MouseEvent } from "react";
import { Link } from "gatsby";
import styled from "@emotion/styled";

import Icon from "../Icon";
import type { ButtonFragment } from "./schema";
import { gap } from "../../theme/spacing";

const Styled = {
  LinkText: styled.span``,
  Icon: styled(Icon)`
    &:not(:last-child) {
      margin-right: ${gap.pico};
      font-size: 1.1em;
    }
  `,
};

const externalRegex =
  /^(?:http|https):\/\/(?!(?:www\.)?jazevedo.me)[\w./=?#-_]+$/;
export const isExternal = (href: string): boolean => externalRegex.test(href);

const fileRegex = /^[\w./=:?#-]+[.]\w+$/;
export const isFile = (href: string): boolean => fileRegex.test(href);

export type LinkButtonProps = Omit<ButtonFragment, "variant"> & {
  onClick?: (e: MouseEvent) => void | null;
  download?: boolean | null;
  className?: string;
  style?: React.CSSProperties;
  activeLinkClassName?: string;
  children?: React.ReactNode;
  iconClassName?: string;
  draggable?: boolean;
};

/**
 * Renders a link, automatically using an anchor element if the link is external
 * or a Gatsby router <Link> component if the link is internal.
 * Supports rendering `Button` items
 * once they have been stripped of the `variant` property.
 */
export default function LinkButton({
  href,
  text,
  icon,
  onClick,
  download,
  className,
  style,
  activeLinkClassName,
  children,
  iconClassName,
  draggable,
  ariaLabel,
}: LinkButtonProps): React.ReactElement {
  const useAnchor = isExternal(href) || isFile(href) || onClick != null;
  const content = (
    <>
      {icon != null && icon.trim() !== "" && (
        <Styled.Icon key="icon" name={icon} className={iconClassName} />
      )}
      {text != null && text.trim() !== "" && (
        <Styled.LinkText>{text}</Styled.LinkText>
      )}
      {children}
    </>
  );

  if (useAnchor) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        download={download}
        style={style}
        draggable={draggable}
        aria-label={ariaLabel ?? undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={href}
      partiallyActive
      className={className}
      style={style}
      activeClassName={activeLinkClassName}
      onClick={onClick}
      draggable={draggable}
      aria-label={ariaLabel ?? undefined}
    >
      {content}
    </Link>
  );
}
