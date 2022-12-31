/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, lang, meta, title, thumbnail, thumbnailAlt }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            name
            description
            siteUrl
            image
            twitterCreator
            twitterSite
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  const defaultSeoImageUrl = `${site.siteMetadata.siteUrl}${site.siteMetadata.image}`
  const thumbnailUrl = `${site.siteMetadata.siteUrl}${thumbnail}`

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `author`,
          content: site.siteMetadata.name,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.twitterCreator,
        },
        {
          name: `twitter:site`,
          content: site.siteMetadata.twitterSite,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]
        .concat(
          thumbnail
            ? [
                {
                  name: `image`,
                  property: `og:image`,
                  content: thumbnailUrl,
                },
                {
                  name: `og:image:alt`,
                  content: thumbnailAlt || title,
                },
                {
                  name: `twitter:image`,
                  content: thumbnailUrl,
                },
                {
                  name: `twitter:image:alt`,
                  content: thumbnailAlt || title,
                },
                {
                  name: `twitter:card`,
                  content: `summary_large_image`,
                },
              ]
            : [
                {
                  name: `image`,
                  property: `og:image`,
                  content: defaultSeoImageUrl,
                },
                {
                  name: `og:image:alt`,
                  content: thumbnailAlt || title,
                },
                {
                  name: `twitter:image`,
                  content: defaultSeoImageUrl,
                },
                {
                  name: `twitter:image:alt`,
                  content: thumbnailAlt || title,
                },
                {
                  name: `twitter:card`,
                  content: `summary`,
                },
              ]
        )
        .concat(meta)}
    />
  )
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default Seo
