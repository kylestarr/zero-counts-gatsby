import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const About = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
        <SEO title="About" />
        <h1>About</h1>
        <p>Zero Counts is a link blog designed, developed, and written by Kyle Starr. The primary focus is video game industry business, culture, and news.</p>
        <p>Zero Counts is built on and with:</p>
        <ul>
            <li><a href="https://www.gatsbyjs.com">GatsbyJS</a></li>
            <li><a href="https://github.com">GitHub</a></li>
            <li><a href="https://www.gatsbyjs.com/cloud/">Gatsby Cloud</a></li>
            <li><a href="https://code.visualstudio.com">VS Code</a></li>
            <li><a href="https://ia.net/writer">iA Writer</a></li>
        </ul>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:info@zerocounts.net">info@zerocounts.net</a></p>
        <p>Twitter: <a href="https://twitter.com/_zerocounts">@_zerocounts</a></p>
        <hr />
        <h2>Other Projects by Kyle Starr</h2>
        <h3>Music</h3>
        <p>All projects produced using:</p>
        <ul>
            <li><a href="https://www.apple.com/logic-pro/">Logic Pro X</a></li>
            <li><a href="https://itunes.apple.com/us/app/logic-remote/id638394624">Logic Remote</a></li>
            <li><a href="https://www.landr.com/">LANDR</a></li>
        </ul>
        <h4>Child Starr</h4>
        <p>’80s inspired synthwave / electronic</p>
        <ul>
            <li><a href="https://itunes.apple.com/us/artist/child-starr/1281181413">Apple Music</a></li>
            <li><a href="https://open.spotify.com/artist/5bJDBrfQzTyI7czlXVzMdV?si=1ftNx9nuSKu8HyxY2qO8fQ">Spotify</a></li>
            <li><a href="https://childstarr.bandcamp.com/">Bandcamp</a></li>
            <li><a href="https://soundcloud.com/childstarrmusic">SoundCloud</a></li>
        </ul>
        <h4>Death Starr</h4>
        <p>Emo / Rock</p>
        <ul>
            <li><a href="https://soundcloud.com/deathstarrmusic">SoundCloud</a></li>
        </ul>
        <h3>Podcasts</h3>
        <h4>Ported</h4>
        <p>A casual video games focused talk show</p>
        <ul>
            <li><a href="https://itunes.apple.com/us/podcast/ported/id1092918272?mt=2">Apple Podcasts</a></li>
        </ul>
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
