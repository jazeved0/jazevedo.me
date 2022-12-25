import React, { useState, useLayoutEffect, useRef } from "react";
import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import styled from "@emotion/styled";

import Mdx from "../components/Mdx";
import HeroBackground from "../components/HeroBackground";
import Layout from "../components/Layout";
import EmailSpoiler from "../components/EmailSpoiler";
import { gap } from "../theme/spacing";
import { contentWidth, sitePadding } from "../theme/layout";
import { shadow } from "../theme/shadows";
import Icon from "../components/Icon";
import { highlightLinks } from "../theme/mixins";
import { down } from "../theme/media";
import { ProjectCardFragment } from "../components/ProjectCard/types";
import ProjectCarousel from "../components/ProjectCarousel";
import Button from "../components/Button";

const Styled = {
  PageLayout: styled.div`
    position: relative;
    z-index: 0;
    --image-size: 256px;

    ${down("md")} {
      --image-size: 180px;
    }

    display: grid;
    grid-template-rows: auto auto;
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
      ". . profile content . ."
      "carousel carousel carousel carousel carousel carousel";

    padding-top: ${gap.milli};
    padding-bottom: ${gap.milli};

    ${down("xl")} {
      padding-top: ${gap.nano};
    }

    ${down("lg")} {
      grid-template-rows: max-content auto auto;
      grid-template-columns:
        ${sitePadding}
        1fr
        min(${contentWidth}, calc(100% - (2 * ${sitePadding})))
        1fr
        ${sitePadding};
      grid-template-areas:
        ". . profile . ."
        ". . content . ."
        "carousel carousel carousel carousel carousel";

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
  ContentWrapper: styled.article`
    grid-area: content;
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
  Heading: styled.h3`
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: ${gap.centi};
    margin-bottom: ${gap.micro};
  `,
  About: styled.div`
    margin-top: ${gap.milli};

    & p {
      font-size: 1.2rem;
      margin-bottom: ${gap.nano};
      font-weight: 400;
    }

    & a {
      ${highlightLinks}
    }
  `,
  EmailSpoilerHeading: styled.h4`
    font-size: 1.05rem;
    margin-top: ${gap.micro};
  `,
  Carousel: styled(ProjectCarousel)`
    grid-area: carousel;
    width: 100%;
  `,
  CarouselPositioner: styled.div`
    margin-left: var(--content-padding);
    grid-area: content;
    pointer-events: none;
  `,
};

// Must stay synchronized with below pageQuery
type PageQueryResult = {
  file: {
    childMdx: {
      body: string;
      frontmatter: {
        title: string;
        name: string;
        headline: string;
        subHeadline: string;
        email: string;
      };
    };
  };

  topProjects: {
    projectFiles: Array<{
      childMdx: ProjectCardFragment;
    }>;
  };
};

export const pageQuery = graphql`
  query {
    file(
      name: { eq: "index" }
      extension: { eq: "md" }
      sourceInstanceName: { eq: "data" }
    ) {
      childMdx {
        body
        frontmatter {
          title
          name
          headline
          subHeadline
          email
        }
      }
    }

    topProjects: allFile(
      sort: { childMdx: { frontmatter: { importance: DESC } } }
      limit: 10
      filter: {
        childMdx: { frontmatter: { importance: { ne: null } } }
        relativePath: { regex: "/^[^/]+/index.md$/" }
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
`;

export type IndexPageProps = {
  data: PageQueryResult;
};

export default function IndexPage({
  data,
}: IndexPageProps): React.ReactElement {
  const { body, frontmatter } = data.file.childMdx;
  const { title, name, headline, subHeadline, email } = frontmatter;
  const projects = data.topProjects.projectFiles.map(
    ({ childMdx }) => childMdx
  );

  return (
    <Layout
      title={title}
      headerSpacing="sparse"
      style={{ overflowX: "hidden" }}
    >
      <HeroBackground />
      <Styled.PageLayout>
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
        <Styled.ContentWrapper>
          <Styled.Name>{name}</Styled.Name>
          <Styled.Headline>{headline}</Styled.Headline>
          <Styled.SubHeadline>{subHeadline}</Styled.SubHeadline>
          <Styled.EmailSpoilerHeading>
            <Icon name="envelope" style={{ marginRight: gap.nano }} />
            <EmailSpoiler email={email} />
          </Styled.EmailSpoilerHeading>
          <Styled.About>
            <Styled.Heading>About</Styled.Heading>
            <Mdx content={body} />
          </Styled.About>
          <Styled.Heading>
            Past projects{" "}
            <Button
              href="/projects"
              text="View All"
              style={{
                fontSize: "1.05rem",
                marginLeft: gap.nano,
                verticalAlign: "4px",
              }}
            />
          </Styled.Heading>
        </Styled.ContentWrapper>
        <Carousel projects={projects} />
      </Styled.PageLayout>
    </Layout>
  );
}

// ? -----------------
// ? Helper Components
// ? -----------------

type CarouselProps = {
  projects: ProjectCardFragment[];
};

function Carousel({ projects }: CarouselProps): React.ReactElement {
  const positionerRef = useRef() as React.RefObject<HTMLDivElement>;
  // Default to the page padding for the padding.
  // Most users won't see this/will see it for a split second
  // before the padding is measured from the positioner
  // and the component is re-rendered.
  // However, it serves as a nicer fallback in case JS is disabled.
  const [padding, setPadding] = useState<string | number>(sitePadding);
  useLayoutEffect(() => {
    const handleResize = (): void => {
      if (positionerRef.current == null) return;
      const { x } = positionerRef.current.getBoundingClientRect();
      setPadding(x);
    };

    // Upon mounting, configure the size of the carousel
    handleResize();

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Styled.CarouselPositioner ref={positionerRef} />
      <Styled.Carousel projects={projects} leftPadding={padding} />
    </>
  );
}
