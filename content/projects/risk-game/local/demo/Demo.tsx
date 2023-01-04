import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

import Figure from "../../../../../src/components/Figure";
import { color, riskOceanColor } from "../../../../../src/theme/color";

const Styled = {
  Figure: styled(Figure)`
    position: relative;
    table-layout: fixed;
    width: 100%;
    max-width: none !important;
  `,
  Wrapper: styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 0;
    box-shadow: 0 0 12px 4px ${color("shadowMedium")};
  `,
  Embed: styled.iframe`
    position: relative;
    width: 100%;
    min-height: 100%;
    min-width: 100%;
    background-color: ${riskOceanColor};
    border: none;
  `,
  Fallback: styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.5s ease-in-out;

    /* Fade the fallback out once the iframe is loaded */
    &[data-loaded="true"] {
      opacity: 0;
    }
  `,
};

type ImageData = { previewBase64: string };

function getImageData(): ImageData {
  // We can't place static queries outside of components/,
  // so instead this is the base64 fallback for preview.png,
  // retrieved through a GraphQL query and then cached here.
  return {
    previewBase64: `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`,
  };
}

export type DemoProps = {
  label: string;
  height: number;
  embedSrc: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Renders the risk game demo canvas as an iframe.
 * The inner page is a Vue app that renders the game canvas.
 */
export default function Demo({
  label,
  height,
  embedSrc,
  className,
  style,
}: DemoProps): React.ReactElement {
  const { previewBase64 } = getImageData();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect((): void | (() => void) => {
    const iframe = iframeRef.current;
    if (iframe == null) {
      return;
    }

    const onLoad = (): void => {
      setIsLoaded(true);
    };

    iframe.addEventListener("load", onLoad);
    return (): void => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [iframeRef]);

  return (
    <Styled.Figure
      caption={label}
      style={{ width: "100%", maxWidth: "none", ...style }}
      className={className}
    >
      <Styled.Wrapper style={{ height: `${height}px` }}>
        <Styled.Embed src={embedSrc} ref={iframeRef} />
        <Styled.Fallback
          data-loaded={isLoaded}
          style={{
            backgroundImage: `url('data:image/png;base64,${previewBase64}')`,
          }}
        />
      </Styled.Wrapper>
    </Styled.Figure>
  );
}
