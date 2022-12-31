import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />

      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <time>{post.frontmatter.date}</time>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <nav id="post-pagination">
        {next && (
          <Link to={next.fields.filePath} rel="next" className="next-post">
            {next.frontmatter.title} →
          </Link>
        )}
        {previous && (
          <Link to={previous.fields.filePath} rel="prev" className="prev-post">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostByfilePath($filePath: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { filePath: { eq: $filePath } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
