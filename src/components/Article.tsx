import React from "react";
import styled from "@emotion/styled";
import { rgba } from "polished";

import { gap } from "../theme/spacing";
import { color, ColorMode, hybridColor, mode } from "../theme/color";
import { down } from "../theme/media";
import { shadow } from "../theme/shadows";
import { highlightLinks } from "../theme/mixins";

const Styled = {
  Article: styled.article`
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: ${gap.milli};
    }

    pre,
    blockquote,
    hr,
    table {
      margin-top: ${gap.milli};
      margin-bottom: ${gap.milli};
    }

    p,
    ol,
    ul,
    table,
    figure {
      margin-top: ${gap.nano};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${color("text-strong")};
    }

    ul {
      position: relative;
      list-style: none;
      padding-left: 1.5em;
      margin-left: 0.8em;

      li:before {
        content: "\\25C6";
        font-size: 0.6em;
        position: absolute;
        transform: translateY(0.7em);
        left: 0;
      }
    }

    ol {
      padding-inline-start: 32px;

      & > li {
        padding-left: 0.65rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding: ${gap.micro};
      border-left: solid 8px ${color("primary")};
      border-radius: 8px;

      ${mode(ColorMode.Light)} {
        background-color: ${rgba(hybridColor("primary", ColorMode.Light), 0.2)};
      }

      ${mode(ColorMode.Dark)} {
        background-color: ${rgba(hybridColor("primary", ColorMode.Dark), 0.2)};
      }

      ${down("sm")} {
        padding: ${gap.nano};
      }

      /* This is somewhat risky with Emotion SSR,
      but as far as I understand that only is a risk
      if a <style> can be interleaved in the DOM as the first child,
      which shouldn't happen since neither the block quote or its children
      are Emotion components (probably) */
      & > :first-child {
        margin-top: 0;
      }
    }

    table {
      border-collapse: collapse;
      border: none;
      --border-radius: 8px;
      border-radius: var(--border-radius);
      box-shadow: ${shadow("z2")};

      thead tr:first-of-type th:first-of-type {
        border-top-left-radius: var(--border-radius);
      }

      thead tr:first-of-type th:last-child {
        border-top-right-radius: var(--border-radius);
      }

      tbody tr:last-child td:first-of-type {
        border-bottom-left-radius: var(--border-radius);
      }

      tbody tr:last-child td:last-child {
        border-bottom-right-radius: var(--border-radius);
      }

      td,
      th {
        min-width: 6rem;
        padding: 0.75rem;
        vertical-align: top;
        text-align: left;
      }

      td:not(:first-of-type),
      th:not(:first-of-type) {
        min-width: 8rem;
      }

      ${down("md")} {
        td:not(:first-of-type),
        th:not(:first-of-type) {
          min-width: 10rem;
        }
      }

      tbody {
        border: none;

        ${mode(ColorMode.Light)} {
          tr:nth-child-of-type(2n) {
            background-color: ${color("bg+10")};
          }

          tr:nth-child-of-type(2n + 1) {
            background-color: ${color("bg+5")};
          }
        }

        ${mode(ColorMode.Dark)} {
          tr:nth-child-of-type(2n) {
            background-color: ${color("bg+15")};
          }

          tr:nth-child-of-type(2n + 1) {
            background-color: ${color("bg+10")};
          }
        }
      }

      thead {
        tr {
          box-shadow: ${shadow("z1")};
          z-index: 1;
          position: relative;

          ${mode(ColorMode.Light)} {
            background-color: ${color("bg+15")};
          }

          ${mode(ColorMode.Dark)} {
            background-color: ${color("bg+20")};
          }
        }

        th {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: ${color("text-faint")};
          letter-spacing: 1px;
        }
      }

      td {
        font-size: 0.9rem;
        font-weight: 400;
      }
    }

    & a {
      ${highlightLinks}
    }

    --img-border-radius: 8px;

    img {
      border-radius: var(--img-border-radius);
      box-shadow: ${shadow("z2")};
    }

    .gatsby-resp-image-wrapper {
      max-width: none !important;

      .gatsby-resp-image-background-image {
        border-radius: var(--img-border-radius) !important;
        box-shadow: ${shadow("z2")};
      }
    }

    .gatsby-resp-iframe-wrapper {
      margin-top: ${gap.micro};
    }
  `,
};

export type ArticleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Supplies styles to markdown-style content
 * (i.e. headings, anchors, paragraphs, code blocks)
 * in the children.
 */
export default function Article({
  children,
  className,
  style,
}: ArticleProps): React.ReactElement {
  return (
    <Styled.Article className={className} style={style}>
      {children}
    </Styled.Article>
  );
}
