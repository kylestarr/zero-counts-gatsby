import { Link } from "gatsby"
import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const Footer = () => {
    const data = useStaticQuery(graphql`
        query iconQuery {
            logo: file(absolutePath: { regex: "/info-400x400.png/" }) {
                childImageSharp {
                    fluid(maxWidth: 42) {
                    ...GatsbyImageSharpFluid
                    }
                }
            }
            twitter: file(absolutePath: { regex: "/Twitter_Logo_WhiteOnImage.png/" }) {
                childImageSharp {
                    fluid(maxWidth: 42) {
                    ...GatsbyImageSharpFluid
                    }
                }
            }
            email: file(absolutePath: { regex: "/mail-icon-400-400.png/" }) {
                childImageSharp {
                    fluid(maxWidth: 42) {
                    ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `)

    return (
        <footer>
            <div class="social">
                <div class="social-icon">
                    <Link to="/about"><Img fluid={data.logo.childImageSharp.fluid} alt="about icon" /></Link>
                </div>
                <div class="social-icon">
                    <a href="http://twitter.com/_zerocounts" id="twitter"><Img fluid={data.twitter.childImageSharp.fluid} alt="twitter icon" /></a>
                </div>
                <div class="social-icon">
                    <a href="mailto:info@zerocounts.net" id="email"><Img fluid={data.email.childImageSharp.fluid} alt ="email icon" /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer