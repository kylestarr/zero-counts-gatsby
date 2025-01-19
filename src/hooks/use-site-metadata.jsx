import { useStaticQuery, graphql } from "gatsby"

export const useSiteMetadata = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          name
          siteUrl
          image
          seoCardImage
          twitterCreator
          twitterSite
        }
      }
    }
  `)

  return data.site.siteMetadata
}
