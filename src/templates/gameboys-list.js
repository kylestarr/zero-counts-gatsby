import React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from "gatsby-plugin-image"

import SEO from '../components/seo'
import Layout from '../components/layout'

class GameBoysIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={siteTitle}
          keywords={[`video games`, `blog`, `business`, `education`, `culture`, `design`]}
        />
        <div id="gameboys-list">
            {
                posts.map(({ node }) => {
                    const title = node.frontmatter.title
                    return (
                      <div class="article">
                        <Link to={node.frontmatter.slug}>
                        
                          <article key={node.frontmatter.slug}>
                            <div class="article-thumbnail">
                                <GatsbyImage
                                  image={getImage(node.frontmatter.thumbnail)}
                                  alt={node.frontmatter.title}
                                />
                            </div>
                            <h2>
                              {title}
                            </h2>
                          </article>
                        
                        </Link>
                      </div>
                    ) 
                })
            }
        </div>
      </Layout>
    )
  }
}

export default GameBoysIndex

export const pageQuery = graphql`
  query gameboysListQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: {fileAbsolutePath: {regex: "/gameboys/"}}
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