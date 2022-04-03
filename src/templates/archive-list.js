import React from 'react'
import { Link, graphql } from 'gatsby'

import SEO from '../components/seo'
import Layout from '../components/layout'

class ArchiveIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={siteTitle}
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div id="archive-list">
            {
                posts.map(({ node }) => {
                    const title = node.frontmatter.title || node.fields.slug
                    return (
                        <article key={node.fields.slug}>
                            <h2>
                                <Link to={node.fields.slug}>
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

export default ArchiveIndex

export const pageQuery = graphql`
  query archiveListQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        ) {
        edges {
            node {
              frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
              }
              fields {
                slug
              }
            }
        }
    }
  }
`