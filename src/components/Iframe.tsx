import styled from "@emotion/styled";
import classNames from "classnames";
import React from "react";

const Styled = {
  Wrapper: styled.div`
    position: relative;
    height: 0;
    overflow: hidden;
  `,
  Iframe: styled.iframe`
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  `,
};

/**
 * CSS Class to target iframe wrapper elements in `<Article />` components.
 */
export const iframeClass = "iframe-article-block";

export type IframeProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  allowFullScreen?: boolean;
};

/**
 * Responsive iframe wrapper.
 */
export default function Iframe({
  src,
  className,
  style,
  width,
  height,
  allowFullScreen = false,
}: IframeProps): React.ReactElement {
  return (
    <Styled.Wrapper
      style={{
        width: "100%",
        maxWidth: "none",
        paddingBottom: `${(height / width) * 100}%`,
        ...style,
      }}
      className={classNames("iframe-article-block", className)}
    >
      <Styled.Iframe
        src={src}
        width={width}
        height={height}
        allowFullScreen={allowFullScreen}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...({
          mozallowfullscreen: allowFullScreen,
          webkitallowfullscreen: allowFullScreen,
        } as React.IframeHTMLAttributes<HTMLIFrameElement>)}
      />
    </Styled.Wrapper>
  );
}
