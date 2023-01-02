import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/seo.jsx"
import Layout from "../components/layout"

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? "/" : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <div id="blog-list">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.filePath
            return (
              <article key={node.fields.filePath}>
                <h2>
                  <Link to={node.fields.filePath}>{title}</Link>
                </h2>
                <time>{node.frontmatter.date}</time>
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

export const Head = ({ data }) => (
  <Seo title={`${data.site.siteMetadata.title}`} />
)

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: $limit
      skip: $skip
      filter: { fileAbsolutePath: { regex: "/post/" } }
    ) {
      edges {
        node {
          html
          excerpt
          fields {
            filePath
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
