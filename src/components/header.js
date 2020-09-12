import { Link } from "gatsby"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Header = () => {
    const data = useStaticQuery(graphql`
        query siteMetadataAndHeaderImageQuery {
            logo: file(absolutePath: { regex: "/zero-counts-logo-light.png/" }) {
                childImageSharp {
                    fluid(maxWidth: 528) {
                    ...GatsbyImageSharpFluid_noBase64
                    }
                }
            }
            site {
                siteMetadata {
                    title
                    author {
                        name
                    }
                }
            }
        }
    `)

  return (
  <header>
        <div id="header-image">
            <Link to="/">
                <Img
                    fluid={data.logo.childImageSharp.fluid}
                    alt={`${data.site.siteMetadata.title} logo`}
                />
            </Link>
        </div>
        <div id="byline">
            <address>By {data.site.siteMetadata.author.name}</address>
        </div>
  </header>
  )
}

export default Header