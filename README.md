# Personal website ([jazevedo.me](https://jazevedo.me))

This is my personal website, where I have a short 'about' section, a copy of my current resume, and descriptions/demos of past projects I worked on. It is built using [React](https://reactjs.org), [Gatsby.js](https://www.gatsbyjs.org/) (using full ahead-of-time static generation), and [MDX](https://mdxjs.com/).

- [Home page](https://jazevedo.me/)
- [Resume](https://jazevedo.me/resume) ([LaTeX source code](https://github.com/jazeved0/jazevedo.me/blob/main/src/resume/main.tex))
- [Index of past projects](https://jazevedo.me/projects)

Screenshot of the home page:

<!-- Screenshot taken by going to home page and selecting a 1920x1280 resolution
in devtools device toolbar, then use the 'Capture screenshot' devtools command: -->

![screenshot of the home page](./.github/readme/homepage_screenshot.png)

## 🏗️ Developing

This repository is licensed under the [MIT License](./LICENSE). Feel free to fork it and use it/parts of it as a template for your own website (if you do, I'd love to know about it).

> **Note**:
> Other than what is outlined in this section and the implementation of the site itself,
> the other notable component of the deployment of this repository
> is the setup for GitHub Actions, which includes steps for building the site HTML,
> compiling the resume PDF from LaTeX source, and deploying all files to GitHub Pages.
> See the [`.github/workflows`](./.github/workflows) directory for more details.

### Running Locally

This repository has been tested using [Node](https://nodejs.org/en/) v18 (and all GitHub Actions run under Node v18).

To install the project's dependencies, run the following command in the repository root:

```sh
# `--legacy-peer-deps` is required; otherwise errors will prevent installation:
npm install --legacy-peer-deps
```

To run the website on a development test server, run the following command in the repository root:

```sh
npm run start
```

Then, open [localhost:8000](http://localhost:8000/) in a browser. [localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql) is also available for testing GraphQL queries.

### Other commands

- `npm run build` - this performs ahead-of-time static generation of the site, and outputs all files to the `public` directory. This runs `gatsby build`.
- `npm run serve` - this starts a simple HTTP server that serves files from the `public` directory. Useful to locally test the result of `npm run build`. This runs `gatsby serve`.
- `npm run clean` - cleans the `public` directory and certain caches. This runs `gatsby clean`.
- `npm run lint` - runs ESLint on the project, reporting any warnings/errors. This will fail with a non-zero exit code if any warnings/errors are found.
- `npm run lint:fix` - runs ESLint on the project, attempting to auto-fix any warnings/error when possible.
- `npm run format` - runs Prettier on the project, formatting all files to match the project's style.
- `npm run format:check` - runs Prettier on the project, reporting any files that do not match the project's style. This will fail with a non-zero exit code if any files do not match the project's style.
