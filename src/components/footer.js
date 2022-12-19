import { Link } from "gatsby"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

const Footer = () => {
  const data = useStaticQuery(graphql`
    query iconQuery {
      logo: file(absolutePath: { regex: "/info-icon-84.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 42, layout: CONSTRAINED)
        }
      }
      twitter: file(absolutePath: { regex: "/twitter-logo-white-84.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 42, layout: CONSTRAINED)
        }
      }
      email: file(absolutePath: { regex: "/mail-icon-84.png/" }) {
        childImageSharp {
          gatsbyImageData(width: 42, layout: CONSTRAINED)
        }
      }
    }
  `)

  return (
    <footer>
      <div class="social">
        <div class="social-icon">
          <Link to="/about">
            <GatsbyImage
              image={data.logo.childImageSharp.gatsbyImageData}
              alt="about icon"
            />
          </Link>
        </div>
        {/* <div class="social-icon">
                    <a href="http://twitter.com/_zerocounts" id="twitter"><GatsbyImage image={data.twitter.childImageSharp.gatsbyImageData} alt="twitter icon" /></a>
                </div> */}
        <div class="social-icon">
          <a href="mailto:info@zerocounts.net" id="email">
            <GatsbyImage
              image={data.email.childImageSharp.gatsbyImageData}
              alt="email icon"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
