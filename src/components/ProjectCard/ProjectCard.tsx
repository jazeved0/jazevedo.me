import React, { MouseEvent } from "react";
import styled from "@emotion/styled";
import { GatsbyImage } from "gatsby-plugin-image";

import { ProjectCardFragment } from "./types";
import { shadow } from "../../theme/shadows";
import { gap } from "../../theme/spacing";
import { color, ColorMode, mode } from "../../theme/color";
import LinkButton from "../LinkButton";
import ProjectTopics from "../ProjectTopics";

const Styled = {
  ProjectCard: styled(LinkButton)`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 200px auto;
    min-width: 320px;

    overflow: hidden;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    text-decoration: none;
    text-align: left;
    border-radius: 12px;
    box-shadow: ${shadow("z4")};
    transition: 0.15s box-shadow linear, 0.1s transform linear;
    transform: none;
    will-change: transform;
    color: ${color("text")};

    --card-bg: ${color("bg+10")};
    --card-highlight-bg: transparent;

    &:hover {
      box-shadow: ${shadow("z5")};
      transform: translateY(-4px);
      --card-highlight-bg: ${color("bg+15")};
    }
  `,
  CardTop: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    height: 100%;
  `,
  CardBottom: styled.div`
    padding: ${gap.nano};
    background-color: var(--card-bg);
    position: relative;

    /* Use an absolutely positioned pseudo-element
    that animates between transparent and opaque
    to simulate the <CardBottom> having a background color transition
    without creating an ugly transition upon changing themes */
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      content: " ";
      transition: 0.1s background-color linear;
      background-color: var(--card-highlight-bg);
      z-index: -1;
    }
  `,
  CardTitle: styled.h4`
    font-size: 1.3rem;
    font-weight: 700;
    margin-bottom: ${gap.nano};
  `,
  CardDescription: styled.p`
    font-size: 0.95rem;
    font-weight: 400;
    margin-bottom: ${gap.nano};
  `,
  Logo: styled.img`
    max-width: 200px;
    max-height: 100px;

    margin-bottom: ${gap.nano};
    margin-left: ${gap.nano};

    user-select: none;
    user-drag: none;

    /* Add drop shadow */
    filter: drop-shadow(0 0 18px rgba(0, 0, 0, 1))
      drop-shadow(0 0 18px rgba(0, 0, 0, 0.8));
  `,
  ColorOverlay: styled.div`
    ${mode(ColorMode.Dark)} {
      background-color: rgba(20, 20, 20, 0.2);
    }

    ${mode(ColorMode.Light)} {
      background-color: rgba(230, 230, 230, 0.2);
    }
  `,
};

export type ProjectCardProps = {
  project: ProjectCardFragment;
  onClick?: () => boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Displays a small card with image, logo/title, and description
 * to provide a clickable preview of an individual project.
 */
export default function ProjectCard({
  project,
  onClick,
  className,
  style,
}: ProjectCardProps): React.ReactElement {
  const { card, logo } = project;
  const slug = project.parent.relativeDirectory;
  const {
    title,
    description,
    topics: { main: mainTopics },
  } = project.frontmatter;
  const url = `/projects/${slug}`;

  return (
    <Styled.ProjectCard
      draggable={false}
      href={url}
      className={className}
      style={style}
      onClick={(e: MouseEvent): void => {
        if (onClick != null && !onClick()) {
          e.preventDefault();
        }
      }}
    >
      <Styled.CardTop
        style={{
          gridArea: "1/1",
          zIndex: 2,
        }}
      >
        <Styled.Logo
          src={logo?.publicURL ?? ""}
          alt={`${title ?? "unknown"} logo`}
          draggable={false}
        />
      </Styled.CardTop>
      <Styled.CardBottom
        style={{
          gridArea: "2/1",
          zIndex: 2,
        }}
      >
        <Styled.CardTitle>{title}</Styled.CardTitle>
        <Styled.CardDescription>{description}</Styled.CardDescription>
        {/* This is not a typo;
        I like the way the hollow pills look more on the cards,
        so this passes the main topics to the `secondary` prop */}
        <ProjectTopics secondary={mainTopics ?? []} />
      </Styled.CardBottom>
      {card?.childImageSharp?.gatsbyImageData != null ? (
        <GatsbyImage
          style={{ gridArea: "1/1/2/1", zIndex: 0, height: "100%" }}
          image={card.childImageSharp.gatsbyImageData}
          alt=""
        />
      ) : (
        <img alt="" src={card?.publicURL ?? ""} />
      )}
      <Styled.ColorOverlay
        style={{ gridArea: "1/1/2/1", zIndex: 1, height: "100%" }}
      />
    </Styled.ProjectCard>
  );
}
