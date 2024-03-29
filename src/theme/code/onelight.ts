/**
 * From https://github.com/kenchandev/prism-theme-one-light-dark
 * @author Ken Chan
 */
export const oneLight = `
  code[class*="language-"],
  pre[class*="language-"] {
      color: #383a42;
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
      background: #e5e6e7;
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
      background: #fff;
      border: 1px solid #e7eaf4;
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
      color: #8d8e94;
  }
  .token.punctuation {
      color: #383a42;
  }
  .token.selector,
  .token.tag {
      color: #f07c85;
  }
  .token.property,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.attr-name,
  .token.deleted {
      color: #e1aa76;
  }
  .token.string,
  .token.char,
  .token.attr-value,
  .token.builtin,
  .token.inserted {
      color: #88b369;
  }
  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
      color: #46a6b2;
  }
  .token.function {
      color: #3d85bf;
  }
  .token.atrule,
  .token.keyword,
  .token.regex,
  .token.important,
  .token.variable {
      color: #b668cd;
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
      color: #b5b9c2;
      display: block;
      padding-right: 0.8em;
      text-align: right;
  }
  code.language-css,
  pre.languagecss {
      color: #ca1243;
  }
  code.language-javascript,
  pre.languagejavascript {
      color: #ca1243;
  }
  code.language-js,
  pre.languagejs {
      color: #ca1243;
  }
  code.language-jsx,
  pre.languagejsx {
      color: #ca1243;
  }
  code.language-sass,
  pre.languagesass {
      color: #ca1243;
  }
  code.language-scss,
  pre.languagescss {
      color: #ca1243;
  }
  code.language-ts,
  pre.languagets {
      color: #ca1243;
  }
  code.language-tsx,
  pre.languagetsx {
      color: #ca1243;
  }
  code.language-typescript,
  pre.languagetypescript {
      color: #ca1243;
  }
`;
