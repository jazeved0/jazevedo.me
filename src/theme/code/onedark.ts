/**
 * From https://github.com/kenchandev/prism-theme-one-light-dark
 * @author Ken Chan
 */
export const oneDark = `
  code[class*="language-"],
  pre[class*="language-"] {
      color: #abb2bf;
      background: none;
      font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
      text-align: left;
      white-space: pre;
      word-spacing: normal;
      word-break: normal;
      word-wrap: normal;
      line-height: 1.5;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
      -webkit-hyphens: none;
      -moz-hyphens: none;
      -ms-hyphens: none;
      hyphens: none;
  }
  pre[class*="language-"]::selection,
  pre[class*="language-"] ::selection,
  code[class*="language-"]::selection,
  code[class*="language-"] ::selection,
  pre[class*="language-"]::-moz-selection,
  pre[class*="language-"] ::-moz-selection,
  code[class*="language-"]::-moz-selection,
  code[class*="language-"] ::-moz-selection {
      text-shadow: none;
      background: #9aa2b1;
  }
  @media print {
      code[class*="language-"],
      pre[class*="language-"] {
          text-shadow: none;
      }
  }
  pre[class*="language-"] {
      padding: 1em;
      margin: 0.5em 0;
      overflow: auto;
  }
  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
      background: #282c34;
      border: 1px solid rgba(0, 0, 0, 0);
  }
  :not(pre) > code[class*="language-"] {
      padding: 0.1em;
      border-radius: 0.3em;
      white-space: normal;
  }
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
      color: #686f7d;
  }
  .token.punctuation {
      color: #abb2bf;
  }
  .token.selector,
  .token.tag {
      color: #e06c75;
  }
  .token.property,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.attr-name,
  .token.deleted {
      color: #d19a66;
  }
  .token.string,
  .token.char,
  .token.attr-value,
  .token.builtin,
  .token.inserted {
      color: #98c379;
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
      color: #56b6c2;
  }
  .token.function {
      color: #61afef;
  }
  .token.atrule,
  .token.keyword,
  .token.regex,
  .token.important,
  .token.variable {
      color: #c678dd;
  }
  .token.important,
  .token.bold {
      font-weight: bold;
  }
  .token.italic {
      font-style: italic;
  }
  .token.entity {
      cursor: help;
  }
  pre.line-numbers {
      position: relative;
      padding-left: 3.8em;
      counter-reset: linenumber;
  }
  pre.line-numbers > code {
      position: relative;
  }
  .line-numbers .line-numbers-rows {
      position: absolute;
      pointer-events: none;
      top: 0;
      font-size: 100%;
      left: -3.8em;
      width: 3em;
      letter-spacing: -1px;
      border-right: 0;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
  }
  .line-numbers-rows > span {
      pointer-events: none;
      display: block;
      counter-increment: linenumber;
  }
  .line-numbers-rows > span:before {
      content: counter(linenumber);
      color: #5c6370;
      display: block;
      padding-right: 0.8em;
      text-align: right;
  }
  code.language-css,
  pre.languagecss {
      color: #fa4273;
  }
  code.language-javascript,
  pre.languagejavascript {
      color: #fa4273;
  }
  code.language-js,
  pre.languagejs {
      color: #fa4273;
  }
  code.language-jsx,
  pre.languagejsx {
      color: #fa4273;
  }
  code.language-sass,
  pre.languagesass {
      color: #fa4273;
  }
  code.language-scss,
  pre.languagescss {
      color: #fa4273;
  }
  code.language-ts,
  pre.languagets {
      color: #fa4273;
  }
  code.language-tsx,
  pre.languagetsx {
      color: #fa4273;
  }
  code.language-typescript,
  pre.languagetypescript {
      color: #fa4273;
  }
`;
