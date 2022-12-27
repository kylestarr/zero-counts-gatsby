module.exports = {
  siteMetadata: {
    title: `Zero Counts`,
    author: {
      name: `Kyle Starr`,
      summary: `Since 1985`,
    },
    description: `A blog about video games, mostly.`,
    siteUrl: `https://zerocounts.net/`,
    image: "/zero-counts-logo-1200.png",
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
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/gameboys`,
        name: `gameboys`,
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
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        // You can add multiple tracking ids and a pageview event will be fired for all of them.
        trackingIds: ["UA-177899257-1"],
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
        theme_color: `#000000`,
        display: `standalone`,
        icon: `content/assets/zero-counts-logo-512.png`,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    "gatsby-plugin-meta-redirect",
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-gatsby-cloud`,
    /* {
      resolve: `gatsby-plugin-gatsby-cloud`,
      options: {
        headers: {
          "/*": [
            "X-Frame-Options: DENY",
            "X-XSS-Protection: 1; mode=block",
            "Referrer-Policy: same-origin",
          ],
          "/rss.xml": ["Content-Type: text/xml"],
        },
        mergeSecurityHeaders: false,
      },
    }, */
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.filePath,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.filePath,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(sort: { frontmatter: { date: DESC }}, limit: 50) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { filePath }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "rss.xml",
            title: "Zero Counts",
          },
        ],
      },
    },
  ],
}
