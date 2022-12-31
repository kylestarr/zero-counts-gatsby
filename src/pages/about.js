import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const About = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="About" />
      <h1>About</h1>
      <p>
        The primary focus of Zero Counts is video game industry business,
        culture, and news.
      </p>
      <p>Zero Counts is built on and with:</p>
      <ul>
        <li>
          <a href="https://www.gatsbyjs.com">GatsbyJS</a>
        </li>
        <li>
          <a href="https://github.com">GitHub</a>
        </li>
        <li>
          <a href="https://www.gatsbyjs.com/cloud/">Gatsby Cloud</a>
        </li>
        <li>
          <a href="https://code.visualstudio.com">VS Code</a>
        </li>
        <li>
          <a href="https://ia.net/writer">iA Writer</a>
        </li>
      </ul>
      <h2>Contact</h2>
      <p>
        Email: <a href="mailto:info@zerocounts.net">info@zerocounts.net</a>
      </p>
      <hr />
    </Layout>
  )
}

export default About

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
