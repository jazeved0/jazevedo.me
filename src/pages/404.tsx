import React from "react";
import styled from "@emotion/styled";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { container } from "../theme/layout";
import HeroBackground from "../components/HeroBackground";
import { down } from "../theme/media";
import { color } from "../theme/color";
import Meta from "../components/Meta";

const Styled = {
  PageLayout: styled.div`
    ${container}
    padding-top: ${gap.milli};
    padding-bottom: ${gap.milli};
  `,
  Content: styled.div`
    max-width: 360px;
    position: relative;
    z-index: 1;

    padding-top: ${gap.milli};
    padding-bottom: ${gap.milli};

    ${down("md")} {
      padding-top: ${gap.micro};
      padding-bottom: ${gap.micro};
    }
  `,
  PageTitle: styled.h2`
    color: ${color("text-strong")};
    font-size: 7rem;
    font-weight: 200;
    margin-bottom: ${gap.pico};
    line-height: 1;
    ${down("md")} {
      font-size: 4.5rem;
    }
  `,
  Subtitle: styled.h3`
    font-size: 1.5rem;
    margin-bottom: ${gap.micro};
  `,
  Paragraph: styled.p`
    color: ${color("text")};
    margin-bottom: ${gap.pico};
  `,
};

export default function NotFoundPage(): React.ReactElement {
  return (
    <Layout
      headerProps={{ spacing: "sparse" }}
      overlayChildren={<HeroBackground />}
    >
      <Styled.PageLayout>
        <Styled.PageTitle>404</Styled.PageTitle>
        <Styled.Subtitle>Page not found 😕</Styled.Subtitle>
        <Styled.Paragraph>
          The page you&apos;re looking for doesn&apos;t exist or was removed.
        </Styled.Paragraph>
      </Styled.PageLayout>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Not Found" noIndex />;
}
