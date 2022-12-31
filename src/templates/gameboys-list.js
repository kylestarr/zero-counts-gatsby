import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Seo from "../components/seo.jsx"
import Layout from "../components/layout"

class GameBoysIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <div id="gameboys-list">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title
            return (
              <div className="article">
                <Link to={node.frontmatter.slug}>
                  <article key={node.frontmatter.slug}>
                    <div className="article-thumbnail">
                      <GatsbyImage
                        image={getImage(node.frontmatter.thumbnail)}
                        alt={node.frontmatter.title}
                      />
                    </div>
                    <h2>{title}</h2>
                  </article>
                </Link>
              </div>
            )
          })}
        </div>
      </Layout>
    )
  }
}

export default GameBoysIndex

export const Head = ({ data }) => (
  <Seo
    title={"Game Boy Modding Gallery"}
    thumbnail={`/static/game-boy-gallery-hero.jpeg`}
    thumbnailAlt={"Three modded Game Boys"}
    description={
      "A gallery of custom Game Boy mods and materials used by Kyle Starr"
    }
  />
)

export const pageQuery = graphql`
  query gameboysListQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/gameboys/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
            slug
          }
        }
      }
    }
  }
`
