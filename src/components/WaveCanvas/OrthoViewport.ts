import { OrthographicCamera } from "three";

export type OrthoViewport = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
};

export function adaptiveZoomOrthoViewport({
  clientWidth,
  clientHeight,
  baseViewport,
}: {
  clientWidth: number;
  clientHeight: number;
  baseViewport: OrthoViewport;
}): OrthoViewport {
  // Make the viewport the same aspect ratio as the screen, without
  // changing its position relative to its center. The new dimensions must
  // fit within the base viewport.

  const aspectRatio = clientWidth / clientHeight;
  const viewportAspectRatio =
    (baseViewport.right - baseViewport.left) /
    (baseViewport.top - baseViewport.bottom);

  const newViewport = { ...baseViewport };

  if (aspectRatio < viewportAspectRatio) {
    // The screen is wider than the viewport, so we need to shrink the
    // viewport horizontally.
    const width = baseViewport.top - baseViewport.bottom;
    newViewport.left = (-width * aspectRatio) / 2;
    newViewport.right = (width * aspectRatio) / 2;
  } else {
    // The screen is taller than the viewport, so we need to shrink the
    // viewport vertically.
    const height = baseViewport.right - baseViewport.left;
    newViewport.top = height / aspectRatio / 2;
    newViewport.bottom = -height / aspectRatio / 2;
  }

  // TODO zoom in more if the screen is a square

  return newViewport;
}

export function updateOrthoCamera(
  mutCamera: OrthographicCamera,
  viewport: OrthoViewport
): void {
  mutCamera.left = viewport.left;
  mutCamera.right = viewport.right;
  mutCamera.top = viewport.top;
  mutCamera.bottom = viewport.bottom;
  mutCamera.near = viewport.near;
  mutCamera.far = viewport.far;
  mutCamera.updateProjectionMatrix();
}

export function createOrthoCamera(viewport: OrthoViewport): OrthographicCamera {
  const camera = new OrthographicCamera(
    viewport.left,
    viewport.right,
    viewport.top,
    viewport.bottom,
    viewport.near,
    viewport.far
  );
  return camera;
}
