import React, { useState, useEffect, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import styled from "@emotion/styled";
import classNames from "classnames";

import HeroBackground from "../components/HeroBackground";
import Layout from "../components/Layout";
import EmailSpoiler from "../components/EmailSpoiler";
import { gap } from "../theme/spacing";
import { contentWidth, sitePadding } from "../theme/layout";
import { shadow } from "../theme/shadows";
import Icon from "../components/Icon";
import { highlightLinks } from "../theme/mixins";
import { down } from "../theme/media";
import type { ProjectCardFragment } from "../components/ProjectCard/types";
import BaseProjectCarousel from "../components/ProjectCarousel";
import Mdx from "../components/Mdx";

const ContentWrapperCommon = styled.div`
  padding-left: var(--content-padding);

  & p {
    font-size: 1.2rem;
    margin-bottom: ${gap.nano};
    font-weight: 400;
  }

  & p a {
    ${highlightLinks}
  }

  & h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: ${gap.centi};
    margin-bottom: ${gap.micro};
  }
`;

const Styled = {
  PageLayout: styled.article`
    position: relative;
    z-index: 0;
    --image-size: 256px;

    ${down("md")} {
      --image-size: 180px;
    }

    display: grid;
    grid-template-rows: auto auto auto;
    grid-template-columns:
      ${sitePadding}
      1fr
      var(--image-size)
      min(
        calc(${contentWidth} - var(--image-size)),
        calc(100% - (2 * ${sitePadding}) - var(--image-size))
      )
      1fr
      ${sitePadding};
    grid-template-areas:
      ". . profile name . ."
      ". . profile content . ."
      "carouselBleed carouselBleed carouselBleed carousel carousel carousel"
      ". . . postCarouselContent . .";

    padding-top: ${gap.milli};
    padding-bottom: ${gap.milli};

    ${down("xl")} {
      padding-top: ${gap.nano};
    }

    ${down("lg")} {
      grid-template-rows: max-content auto auto auto;
      grid-template-columns:
        ${sitePadding}
        1fr
        min(${contentWidth}, calc(100% - (2 * ${sitePadding})))
        1fr
        ${sitePadding};
      grid-template-areas:
        ". . profile . ."
        ". . name    . ."
        ". . content . ."
        "carouselBleed carouselBleed carousel carousel carousel"
        ". . postCarouselContent . .";

      padding-top: ${gap.femto};
    }

    --content-padding: ${gap.centi};
    ${down("lg")} {
      --content-padding: 0;
    }
  `,
  ProfileWrapper: styled.div`
    grid-area: profile;
    border: 8px solid white;
    border-radius: 1000px;
    overflow: hidden;
    box-shadow: ${shadow("z3")};
    justify-self: start;
    width: var(--image-size);
    height: var(--image-size);

    img,
    picture {
      /* Needed for image to appear correctly on iOS */
      border-radius: 1000px;
    }
  `,
  NameWrapper: styled.article`
    grid-area: name;
    padding-left: var(--content-padding);
  `,
  Name: styled.h1`
    font-weight: 900;
    font-size: 4rem;
    margin-bottom: ${gap.nano};
    /* Visually center name near profile */
    margin-top: 40px;
    line-height: 0.9;

    ${down("lg")} {
      margin-top: ${gap.micro};
    }
  `,
  Headline: styled.h2`
    font-size: 2rem;
    margin-bottom: ${gap.femto};
    font-weight: 300;
  `,
  SubHeadline: styled.h3`
    font-size: 1.5rem;
    font-weight: 400;
  `,
  Content: styled(ContentWrapperCommon)`
    grid-area: content;
  `,
  PostCarouselContent: styled(ContentWrapperCommon)`
    grid-area: postCarouselContent;
  `,
  EmailSpoilerHeading: styled.h4`
    font-size: 1.05rem;
    margin-top: ${gap.micro};
  `,
  Carousel: styled(BaseProjectCarousel)`
    // Initially, the carousel is placed in the "carousel" area, which
    // will cause it to cut off the left side of the carousel when it is
    // scrolled (and the scrolled elements go into the "carouselBleed" area).
    // To fix this, we move the carousel to span both the "carouselBleed" and
    // "carousel" areas on the second render, while at the same time applying
    // a positive padding-left to the inner scrolling area to place the
    // carousel back in the correct position.
    // This is a compromise between preventing very visible layout shifts
    // and keeping the site usable without JavaScript.
    grid-area: carousel;
    width: 100%;

    &.place-in-bleed-area {
      // Span the "carouselBleed" and "carousel" areas
      grid-column-start: carouselBleed;
      grid-column-end: carousel;
      grid-row-start: carousel;
      grid-row-end: carousel;
    }
  `,
  CarouselPositioner: styled.div`
    margin-left: var(--content-padding);
    grid-area: content;
    pointer-events: none;
  `,
};

// Must stay synchronized with below static query
type StaticQueryResult = {
  topProjects: {
    projectFiles: Array<{
      childMdx: ProjectCardFragment;
    }>;
  };
};

function useData(): StaticQueryResult {
  return useStaticQuery<StaticQueryResult>(
    graphql`
      query {
        topProjects: allFile(
          sort: { childMdx: { frontmatter: { importance: DESC } } }
          limit: 10
          filter: {
            childMdx: { frontmatter: { importance: { ne: null } } }
            relativePath: { regex: "/^[^/]+/index.mdx$/" }
            sourceInstanceName: { eq: "projects" }
          }
        ) {
          projectFiles: nodes {
            childMdx {
              ...ProjectCard
            }
          }
        }
      }
    `
  );
}

export type HomepageLayoutProps = {
  children?: React.ReactNode;
};

/**
 * MDX Layout component for the /src/pages/index.mdx page.
 *
 * This uses a CSS Grid to lay out its 4 sub-components:
 *
 * - `<HomepageLayout.ProfilePicture>` - the large profile picture
 * - `<HomepageLayout.Name>` the 'name' section, including the heading/
 *   sub-heading and email
 * - `<HomepageLayout.Content>` - the main content (containing an "About"
 *   section). This also should contain the heading, if any, for the project
 *   carousel, since it aligns the heading with the left of the initial scroll
 *   of the carousel (which is actually a full-bleed horizontal scroll
 *   container).
 * - `<HomepageLayout.ProjectCarousel>` - a horizontally-scrolling project
 *   carousel
 */
function HomepageLayout({ children }: HomepageLayoutProps): React.ReactElement {
  return (
    <Layout
      headerProps={{ spacing: "sparse" }}
      style={{ overflowX: "hidden" }}
      overlayChildren={<HeroBackground />}
    >
      <Styled.PageLayout>
        <Mdx>{children}</Mdx>
      </Styled.PageLayout>
    </Layout>
  );
}

// Set up and export the aggregate (parent & sub-components):
type HomepageLayoutAggregateType = typeof HomepageLayout & {
  ProfilePicture: typeof ProfilePicture;
  Name: typeof Name;
  Content: typeof Styled.Content;
  ProjectCarousel: typeof ProjectCarousel;
  PostCarouselContent: typeof Styled.PostCarouselContent;
};
const HomepageLayoutAggregate: HomepageLayoutAggregateType =
  HomepageLayout as HomepageLayoutAggregateType;
HomepageLayoutAggregate.ProfilePicture = ProfilePicture;
HomepageLayoutAggregate.Name = Name;
HomepageLayoutAggregate.Content = Styled.Content;
HomepageLayoutAggregate.ProjectCarousel = ProjectCarousel;
HomepageLayoutAggregate.PostCarouselContent = Styled.PostCarouselContent;
export default HomepageLayoutAggregate;

// ? --------------
// ? Sub Components
// ? --------------

function ProfilePicture(): React.ReactElement {
  return (
    <Styled.ProfileWrapper>
      <StaticImage
        src="../../static/img/profile.jpg"
        alt=""
        layout="constrained"
        width={256}
        quality={90}
        placeholder="blurred"
      />
    </Styled.ProfileWrapper>
  );
}

export type NameProps = {
  name: React.ReactNode;
  headline: React.ReactNode;
  subHeadline: React.ReactNode;
  email: React.ReactNode;
};

function Name({
  name,
  headline,
  subHeadline,
  email,
}: NameProps): React.ReactElement {
  return (
    <Styled.NameWrapper>
      <Styled.Name>{name}</Styled.Name>
      <Styled.Headline>{headline}</Styled.Headline>
      <Styled.SubHeadline>{subHeadline}</Styled.SubHeadline>
      <Styled.EmailSpoilerHeading>
        <Icon name="envelope" style={{ marginRight: gap.nano }} />
        <EmailSpoiler email={email} />
      </Styled.EmailSpoilerHeading>
    </Styled.NameWrapper>
  );
}

function ProjectCarousel(): React.ReactElement {
  const data = useData();
  const projects = data.topProjects.projectFiles.map(
    ({ childMdx }) => childMdx
  );

  const positionerRef = useRef() as React.RefObject<HTMLDivElement>;
  // See comment in CSS for the approach to this element.
  // This state will be updated to trigger the second render
  // of the component, which will use the measured padding and span both
  // grid areas.
  const [measuredPadding, setMeasuredPadding] = useState<number | null>(null);
  /* No point in using useLayoutEffect, since the page will have painted
  already due to the SSR HTML rendering initially. */
  useEffect(() => {
    const handleResize = (): void => {
      if (positionerRef.current == null) return;
      const { x } = positionerRef.current.getBoundingClientRect();
      setMeasuredPadding(x);
    };

    // Upon mounting, configure the size of the carousel
    handleResize();

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Styled.CarouselPositioner ref={positionerRef} />
      <Styled.Carousel
        projects={projects}
        // If we have not yet measured the padding, then use the CSS variable
        // "content-padding" as the padding. This will align the left of the
        // carousel when it is placed outside the bleed area with the
        // left of the content.
        leftPadding={measuredPadding ?? "var(--content-padding)"}
        className={classNames({
          "place-in-bleed-area": measuredPadding !== null,
        })}
      />
    </>
  );
}
