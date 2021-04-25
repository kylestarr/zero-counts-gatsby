module.exports = {
  siteMetadata: {
    title: `Zero Counts`,
    author: {
      name: `Kyle Starr`,
      summary: `Since 1985`
    },
    description: `A blog about video games, mostly.`,
    siteUrl: `https://zerocounts.net/`,
    image: '/zero-counts-logo-1200.png',
    social: {
      twitterCreator: `@_kylestarr`,
      twitterSite: `@_zerocounts`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts`,
        name: `posts`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 580,
              backgroundColor: "none",
              disableBgImageOnAlpha: true,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-embedder`,
            options: {
              services: {
                // The service-specific options by the name of the service
              },
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: [
          "UA-177899257-1",
        ],
        // This object gets passed directly to the gtag config command
        // This config will be shared across all trackingIds
        gtagConfig: {
          anonymize_ip: true,
          cookie_expires: 0,
        },
        // This object is used for configuration specific to this plugin
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Setting this parameter is also optional
          respectDNT: true,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Zero Counts`,
        short_name: `Zero Counts`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#004992`,
        display: `standalone`,
        icon: `content/assets/zero-counts-logo-512.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    'gatsby-plugin-meta-redirect',
    `gatsby-plugin-sitemap`
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
