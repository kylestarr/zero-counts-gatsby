import React from 'react'
import { Link, graphql } from 'gatsby'

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
                    const title = node.frontmatter.title || node.fields.filePath
                    return (
                        <article key={node.fields.filePath}>
                            <h2>
                                <Link to={node.fields.filePath}>
                                    {title}
                                </Link>
                            </h2>
                            <date>
                                {node.frontmatter.date}
                            </date>
                        </article>
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
              }
              fields {
                filePath
              }
            }
        }
    }
  }
`