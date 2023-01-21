import React, { Suspense, useCallback, useEffect, useState } from "react";

// Must only `import type` from Lightbox, since it should be bundle-split:
import type { LightboxImage } from "./Lightbox";
import { noImageStylesClass } from "./Article";

/**
 * A class that can be added to a parent element to opt out of the default
 * behavior of adding lightbox functionality to all images under that element.
 */
export const noImageLightboxClass = "no-lightbox-descendent-imgs";

async function requestLowPriority(): Promise<void> {
  if ("requestIdleCallback" in window) {
    return new Promise((resolve) => {
      window.requestIdleCallback(() => resolve(), { timeout: 2000 });
    });
  } else {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

const LazyLightbox = React.lazy(async () => {
  // Load the Lightbox component asynchronously, at a low priority.
  await requestLowPriority();
  const Lightbox = await import("./Lightbox");
  return Lightbox;
});

export type ImageLightboxHandlerProps = {
  parentRef: React.RefObject<HTMLElement | null>;
  captionChildren?: React.ReactNode;
};

/**
 * A component that adds lightbox functionality to all images under the given
 * parent element, that pass a set of heuristics.
 *
 * This uses a jQuery-esque strategy that attaches onClick handlers to the
 * matching images or links in an effect (instead of using a component per
 * image). These will be attached on the initial render.
 *
 * It also defers loading the bundle for the lightbox to be low-priority.
 *
 * If another lightbox handler already attached to a given image/link element,
 * the element will be skipped.
 */
export default function ImageLightboxHandler({
  parentRef,
  captionChildren,
}: ImageLightboxHandlerProps): React.ReactElement {
  const [activeImage, setActiveImage] = useState<LightboxImage | null>(null);
  const openLightbox = useCallback(
    (src: string, aspectRatio: number): void => {
      setActiveImage({ src, aspectRatio });
    },
    [setActiveImage]
  );

  // Attach event listeners
  useEffect(() => {
    type AttachedHandler = [
      element: Element,
      event: string,
      handler: EventListener
    ];
    const attachedHandlers: AttachedHandler[] = [];
    const parent = parentRef.current;
    if (parent !== null) {
      // There are 2 types of images to handle:
      // 1. Gatsby responsive images
      // 2. Regular images
      //
      // Additionally, there are 2 types of nesting patterns to handle:
      // 1. The image is a descendant of a link (preferred, since it facilitates
      //    graceful degradation if JS is disabled). In this case, the link
      //    itself should be the target for the onClick handler.
      // 2. The image is not a descendant of a link.
      //
      // For Gatsby responsive images, Gatsby automatically wraps a link around
      // the image if it is not already wrapped in a link, so it's not possible
      // to have a Gatsby responsive image that is not a descendant of a link
      // (at least with the current config of the site).
      //
      // If an image is not a descendant of a link (meaning it is a regular
      // image), it will always have lightbox functionality attached, and the
      // `src` attribute of the image will be used as the full-scale URL.
      //
      // if an image is a descendant of a link, it will only have lightbox
      // functionality attached if the link has a `href` attribute, and the
      // `href` attribute points to an "image-like" URL (ending in an image
      // extension).

      // To start with, look for all images that are descendants of the parent
      // and:
      // - do not have a paragraph element (<p>) ancestor
      // - do not have an ancestor with the 'noImageStyleClass' class
      // - do not have an ancestor with the 'noImageLightboxClass' class

      const selector = `img:not(p img):not(.${noImageLightboxClass} img):not(.${noImageStylesClass} img)`;
      const candidates = Array.from(parent.querySelectorAll(selector)).filter(
        (elem): elem is HTMLImageElement => elem instanceof HTMLImageElement
      );

      type AttachmentProps = {
        targetElement: Element;
        fullScaleUrl: string;
      };
      const attachmentProps: AttachmentProps[] = candidates.flatMap(
        (imageElement): AttachmentProps[] => {
          // Determine if the image is a descendant of a link, and if it is
          // grab a reference to the closest link ancestor.
          let linkAncestor: HTMLAnchorElement | null =
            imageElement.closest("a");
          if (!parent.contains(linkAncestor)) {
            linkAncestor = null;
          }

          if (linkAncestor === null) {
            const { src } = imageElement;
            if (
              src !== "" &&
              imageElement.getAttribute("data-has-lightbox") !== "true"
            ) {
              return [
                {
                  targetElement: imageElement,
                  fullScaleUrl: src,
                },
              ];
            }
          } else {
            const { href } = linkAncestor;
            if (
              href !== "" &&
              isImageLikeUrl(href) &&
              linkAncestor.getAttribute("data-has-lightbox") !== "true"
            ) {
              return [
                {
                  targetElement: linkAncestor,
                  fullScaleUrl: href,
                },
              ];
            }
          }

          return [];
        }
      );

      attachmentProps.forEach(({ targetElement, fullScaleUrl }) => {
        const handler: EventListener = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const bounds = targetElement.getBoundingClientRect();
          openLightbox(fullScaleUrl, bounds.width / bounds.height);
        };

        targetElement.addEventListener("click", handler);
        targetElement.setAttribute("data-has-lightbox", "true");
        attachedHandlers.push([targetElement, "click", handler]);
      });
    }

    // Cleanup function
    return (): void => {
      attachedHandlers.forEach(([element, event, handler]) => {
        element.removeEventListener(event, handler);
        element.removeAttribute("data-has-lightbox");
      });
    };
  }, [openLightbox, parentRef]);

  return (
    <Suspense fallback={null}>
      <LazyLightbox
        image={activeImage}
        captionChildren={captionChildren}
        onClose={(): void => {
          setActiveImage(null);
        }}
      />
    </Suspense>
  );
}

const imageExtensions = new Set([
  "apng",
  "avif",
  "gif",
  "jpg",
  "jpeg",
  "png",
  "svg",
  "webp",
  "tif",
  "tiff",
]);

function isImageLikeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const extension = path.substring(path.lastIndexOf(".") + 1);
    return imageExtensions.has(extension);
  } catch (e) {
    return false;
  }
}
