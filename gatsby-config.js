module.exports = {
  siteMetadata: {
    title: 'Joseph Azevedo',
    description:
      "My name is Joseph, and I'm a third-year computer science student at Georgia Tech specializing in web application development and distributed systems. I enjoy working on projects that focus on solving interesting problems in creative ways.",
    msTileColor: '#ffc40d',
    maskIconColor: '#9e6276',
    siteUrl: 'https://jazevedo.me/',
  },
  pathPrefix: '/',
  plugins: [
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/projects/`,
        name: 'projects',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/data/`,
        name: 'data',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
              showCaptions: ['title'],
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {},
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Personal Portfolio',
        short_name: 'Portfolio',
        description: "Joseph Azevedo's personal portfolio",
        homepage_url: 'https://jazevedo.me',
        start_url: '/',
        background_color: '#21283B',
        theme_color: '#2f3b56',
        display: 'standalone',
        icons: [
          {
            src: '/img/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/img/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-141036948-1',
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 800,
              showCaptions: false,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {},
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              noInlineHighlight: true,
            },
          },
          {
            resolve: 'gatsby-remark-smartypants',
            options: {},
          },
        ],
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-transformer-sharp',
    'gatsby-plugin-remove-trailing-slashes',
  ],
}
