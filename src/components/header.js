import { Link } from "gatsby"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

const Header = () => {
    const data = useStaticQuery(graphql`query siteMetadataAndHeaderImageQuery {
  logo: file(absolutePath: {regex: "/zero-counts-logo-light.png/"}) {
    childImageSharp {
      gatsbyImageData(width: 528, placeholder: NONE, layout: CONSTRAINED)
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
                    <GatsbyImage
                        image={data.logo.childImageSharp.gatsbyImageData}
                        alt={`${data.site.siteMetadata.title} logo`} />
                </Link>
            </div>
            {/* <div id="byline">
                <address>By {data.site.siteMetadata.author.name}</address>
            </div> */}
      </header>
  );
}

export default Header