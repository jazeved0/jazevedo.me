import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Modal } from "react-overlays";
import { CSSTransition } from "react-transition-group";
import useResizeObserver from "@react-hook/resize-observer";

import { color } from "../theme/color";
import { down } from "../theme/media";
import {
  TransitionSpeed,
  transition,
  ease,
  easeOutBack,
} from "../theme/motion";
import { ZIndex } from "../theme/order";
import { shadow } from "../theme/shadows";
import { usePreviousValue } from "../hooks";
import { gap } from "../theme/spacing";

export type LightboxImage = {
  src: string;
  aspectRatio: number;
};

const fade = "lightbox-fade";
const fadeZoom = "lightbox-fadeZoom";
const speed = TransitionSpeed.Normal;
const Styled = {
  Backdrop: styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: ${ZIndex.ModalOverlay};
    background-color: ${color("modalOverlay")};
    backdrop-filter: blur(4px);

    &.${fade}-appear {
      opacity: 0;
    }
    &.${fade}-exit {
      opacity: 1;
    }
    &.${fade}-appear-active {
      opacity: 1;
    }
    &.${fade}-exit-active {
      opacity: 0;
    }

    &.${fade}-appear-active, &.${fade}-exit-active {
      ${transition(["opacity"])}
    }
  `,
  LightboxModal: styled(Modal)`
    position: fixed;
    top: 0;
    left: 0;
    z-index: ${ZIndex.Modal};
    display: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    &.${fadeZoom}-appear {
      opacity: 0;
      transform: scale(0.25);
    }
    &.${fadeZoom}-exit {
      opacity: 1;
      transform: none;
    }
    &.${fadeZoom}-appear-active {
      opacity: 1;
      transform: none;
    }
    &.${fadeZoom}-exit-active {
      opacity: 0;
      transform: scale(0.25);
    }

    &.${fadeZoom}-exit-active {
      ${transition(["opacity", "transform"], { speed })}
    }

    &.${fadeZoom}-appear-active {
      transition: opacity ${speed}ms ${ease},
        transform ${speed}ms ${easeOutBack};
    }
  `,
  ImageWrapper: styled.div`
    position: relative;

    --base-percent: 95%;
    width: calc(var(--base-percent) - (2 * var(--site-padding)));
    height: calc(var(--base-percent) - (2 * var(--site-padding)));

    ${down("md")} {
      --base-percent: 100%;
    }
  `,
  ImagePlacer: styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  `,
  ImageFigure: styled.figure`
    display: table;
    max-width: 100%;
    max-height: 100%;
  `,
  Image: styled.img`
    /* See https://stackoverflow.com/a/9994936 */
    /* Background-images or object-fit don't work because we need:
       - border radiuses
       - clickable overlay with image being non-clickable */
    border-radius: 8px;
    box-shadow: ${shadow("z1")};
    user-select: none;
    pointer-events: auto;
    display: block;

    &[data-has-caption="true"] {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  `,
  Caption: styled.figcaption`
    padding: ${gap.nano};
    pointer-events: auto;
    background-color: ${color("bg+20")};
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    box-shadow: ${shadow("z1")};
    display: table-caption;
    caption-side: bottom;
  `,
};

export type LightboxProps = {
  image: LightboxImage | null;
  captionChildren?: React.ReactNode;
  onClose: () => void;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Used to show a full screen preview of an image
 */
export default function Lightbox({
  image,
  captionChildren,
  onClose,
  className,
  style,
}: LightboxProps): React.ReactElement {
  // Use the previous value of 'image' as a fallback to show when transitioning out
  const prevImage = usePreviousValue(image);
  const prevImageValue = prevImage.render === "first" ? null : prevImage.value;
  const latentImage: LightboxImage | null = image ?? prevImageValue;

  return (
    <Styled.LightboxModal
      show={image !== null}
      onHide={onClose}
      onBackdropClick={onClose}
      className={className}
      style={style}
      transition={FadeZoomTransition}
      backdropTransition={FadeTransition}
      restoreFocus={false}
      renderBackdrop={(props): React.ReactNode => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Styled.Backdrop {...props} />
      )}
    >
      {latentImage === null ? (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <></>
      ) : (
        <LightboxContent
          image={latentImage}
          captionChildren={captionChildren}
        />
      )}
    </Styled.LightboxModal>
  );
}

// ? =================
// ? Helper components
// ? =================

type LightboxContentProps = {
  image: LightboxImage;
  captionChildren: React.ReactNode;
};

function LightboxContent({
  image,
  captionChildren,
}: LightboxContentProps): React.ReactElement {
  const imagePlacerRef = React.useRef<HTMLDivElement>(null);
  const captionWrapperRef = React.useRef<HTMLDivElement>(null);

  // Use a resize observer to calculate the desired dimensions of the image.
  //
  // Note that this approach will break if there is not sufficient vertical
  // space to display both the image and the caption, subject to the constraint
  // that the caption is the same width as the image. In reality, this mostly
  // happens in edge cases with mobile devices in landscape mode, so it's not
  // a huge deal.

  const [imageIntrinsicHeight, setImageIntrinsicHeight] = useState<
    number | null
  >(null);

  // Use a high default height so that the height of the caption initially is
  // not large: This prevents a high initial "captionHeight" from skewing the
  // calculation of the initial image height.
  const [imageHeight, setImageHeight] = useState(10000);
  const imageWidth = imageHeight * image.aspectRatio;
  const reconsiderImageDimensions = useCallback(
    (newPlacerWidth: number, newPlacerHeight: number): void => {
      // Subtract the height of the caption from the height of the placer
      const captionHeight = captionWrapperRef.current?.offsetHeight ?? 0;
      const heightWithoutCaption = newPlacerHeight - captionHeight;
      const shouldConstrainHeight =
        newPlacerWidth / heightWithoutCaption > image.aspectRatio;

      let newHeight;
      if (shouldConstrainHeight) {
        newHeight = heightWithoutCaption;
      } else {
        newHeight = newPlacerWidth / image.aspectRatio;
      }

      if (imageIntrinsicHeight !== null) {
        newHeight = Math.min(newHeight, imageIntrinsicHeight);
      }

      setImageHeight(newHeight);
    },
    [imageIntrinsicHeight, image.aspectRatio]
  );

  useResizeObserver(imagePlacerRef, ({ contentRect }): void =>
    reconsiderImageDimensions(contentRect.width, contentRect.height)
  );
  // Reconsider the image dimensions when the intrinsic height of the image
  // gets loaded.
  useEffect((): void => {
    if (imagePlacerRef.current !== null && imageIntrinsicHeight !== null) {
      const placerWidth = imagePlacerRef.current.clientWidth;
      const placerHeight = imagePlacerRef.current.clientHeight;
      reconsiderImageDimensions(placerWidth, placerHeight);
    }
  }, [imageIntrinsicHeight, reconsiderImageDimensions]);

  return (
    <Styled.ImageWrapper>
      <Styled.ImagePlacer ref={imagePlacerRef}>
        <Styled.ImageFigure>
          <Styled.Image
            src={image.src}
            width={imageWidth}
            height={imageHeight}
            onLoad={(): void => {
              // Load the intrinsic height of the image after it has loaded
              // Based on https://stackoverflow.com/a/35605862:
              const img = new Image();
              img.src = image.src;
              img.onload = (): void => {
                setImageIntrinsicHeight(img.height);
              };
            }}
            data-has-caption={captionChildren !== undefined}
          />
          {captionChildren !== undefined && (
            <Styled.Caption
              ref={captionWrapperRef}
              // Hide the caption until the image has loaded
              aria-hidden={imageIntrinsicHeight === null}
              style={{
                display: imageIntrinsicHeight === null ? "none" : undefined,
              }}
            >
              {captionChildren}
            </Styled.Caption>
          )}
        </Styled.ImageFigure>
      </Styled.ImagePlacer>
    </Styled.ImageWrapper>
  );
}

type ModalTransitionProps = React.ComponentProps<
  NonNullable<React.ComponentProps<typeof Modal>["transition"]>
>;

function FadeTransition(props: ModalTransitionProps): React.ReactElement {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CSSTransition {...props} timeout={speed} classNames={fade} />
  );
}

function FadeZoomTransition(props: ModalTransitionProps): React.ReactElement {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CSSTransition {...props} timeout={speed} classNames={fadeZoom} />
  );
}
