import React, { useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import styled from "@emotion/styled";
import type { VisibilityContext } from "react-horizontal-scrolling-menu";
import { ScrollMenu } from "react-horizontal-scrolling-menu";

import type { ProjectCardFragment } from "./ProjectCard/types";
import ProjectCard from "./ProjectCard";
import { gap } from "../theme/spacing";
import { useDrag, useHorizontalScroll } from "../hooks";
import { hiddenScrollbar } from "../theme/mixins";
import { sitePadding } from "../theme/layout";
import type { ProjectCardProps } from "./ProjectCard/ProjectCard";

type ScrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const Styled = {
  ProjectCarousel: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    .react-horizontal-scrolling-menu--item:not(:last-child) {
      margin-right: ${gap.micro};
    }

    .react-horizontal-scrolling-menu--wrapper {
      width: 100%;
    }

    .react-horizontal-scrolling-menu--scroll-container {
      padding-top: 4px;
      padding-bottom: ${gap.centi};
      width: 100%;
      ${hiddenScrollbar()}

      padding-left: var(--carousel-left-padding);
      padding-right: ${sitePadding};

      /* The following styles normally get injected by the library at runtime,
      but to make things work better if JS is disabled, we duplicate them here */
      display: flex;
      height: max-content;
      overflow-y: hidden;
      position: relative;
      width: 100%;
    }
  `,
  ProjectCard: styled(ProjectCard)`
    user-select: none;
    user-drag: none;
  `,
};

export type ProjectCarouselProps = {
  leftPadding: string | number;
  projects: ProjectCardFragment[];
  className?: string;
  style?: React.CSSProperties;
};

const scrollContainerClassName = "carousel-scroll-container";

/**
 * Displays a list of the most recent/most significant projects
 * as a horizontally-scrollable carousel.
 * Used on the home page.
 */
export default function ProjectCarousel({
  leftPadding,
  projects,
  className,
  style,
}: ProjectCarouselProps): React.ReactElement {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const handleDrag =
    ({ scrollContainer }: ScrollVisibilityApiType) =>
    (ev: MouseEvent): void =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          // eslint-disable-next-line no-param-reassign
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  // This is a bit of a crime, but without it we can't get a ref
  // to the scroll container element inside the <ScrollMenu> component.
  // Instead, we use element.getElementsByClassName()
  // to get the DOM ref manually in an effect.
  // It won't get populated until the useEffect is run,
  // but the useEffect in useHorizontalScroll should run after that.
  const outerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (outerRef.current != null) {
      const wrapperElements = outerRef.current.getElementsByClassName(
        scrollContainerClassName
      );
      if (wrapperElements.length > 0 && wrapperElements[0] != null) {
        scrollContainerRef.current = wrapperElements[0] as HTMLElement;
      }
    }
  }, []);
  useHorizontalScroll(scrollContainerRef);

  const leftPaddingCssValue =
    typeof leftPadding === "number" ? `${leftPadding}px` : leftPadding;

  return (
    <Styled.ProjectCarousel
      ref={outerRef}
      className={className}
      onMouseLeave={dragStop}
      style={
        {
          ...style,
          "--carousel-left-padding": leftPaddingCssValue,
        } as React.CSSProperties
      }
    >
      <ScrollMenu
        scrollContainerClassName={scrollContainerClassName}
        onMouseDown={(): React.MouseEventHandler<Element> => dragStart}
        onMouseUp={(): React.MouseEventHandler<Element> => dragStop}
        onMouseMove={handleDrag}
      >
        {projects.map((project, i) => (
          <Styled.ProjectCard
            key={i}
            // itemId is required for `<ScrollMenu>` to track items:
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...({ itemId: String(i) } as unknown as ProjectCardProps)}
            project={project}
            // returning false cancels the onClick event:
            onClick={(): boolean => !dragging}
          />
        ))}
      </ScrollMenu>
    </Styled.ProjectCarousel>
  );
}
