import type { GatsbySSR } from "gatsby";

// Add the language attribute to the root `<html>` element
export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHtmlAttributes,
}) => {
  setHtmlAttributes({
    lang: "en",
  });
};
