import React from 'react'
import { Link, graphql } from 'gatsby'

import SEO from '../components/seo'
import Layout from '../components/layout'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()
    
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={siteTitle}
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <div class="row nav">
          <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
          <div class="col-xs-12 col-sm-8 col-md-8 col-lg-6">
            <Link to={"/archive"}>Archive</Link>
          </div>
          <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        </div>
        <div id="blog-list">
        {posts.map(({ node }) => {
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
            <div
                dangerouslySetInnerHTML={{
                  __html: node.html,
                }}
              />
          </article>
        )
      })}
      </div>
      <nav id="list-pagination">
        {!isLast && (
          <Link to={`../${nextPage}`} rel="next">
            ← Older
          </Link>
        )}
        {!isFirst && (
          <Link to={`../${prevPage}`} rel="prev">
            Newer →
          </Link>
        )}
      </nav>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          html
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`