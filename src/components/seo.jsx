import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"

const Seo = ({
  title,
  description,
  thumbnail,
  thumbnailAlt,
  pathname,
  children,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    name,
    image,
    siteUrl,
    twitterCreator,
    twitterSite,
  } = useSiteMetadata()

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    name,
    image: `${siteUrl}${thumbnail}` || `${siteUrl}/${image}`,
    url: `${siteUrl}${pathname || ``}`,
    twitterCreator,
    twitterSite,
    thumbnailAlt: thumbnailAlt,
  }

  return (
    <>
      <title>{seo.title}</title>
      <meta name="author" content={seo.name} />
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="og:title" content={seo.title} />
      <meta name="og:description" content={seo.description} />
      <meta name="og:image" content={seo.image} />
      <meta name="og:image:alt" content={seo.thumbnailAlt} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.thumbnailAlt} />
      <meta name="twitter:creator" content={seo.twitterCreator} />
      <meta name="twitter:site" content={seo.twitterSite} />
      {children}
    </>
  )
}

export default Seo
