import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <div class="row nav">
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div class="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <Link to={"/archive"}>Archive</Link>
        </div>
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <article>
        <header>
          <h1>
            {post.frontmatter.title}
          </h1>
          <date>
            {post.frontmatter.date}
          </date>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <nav id="post-pagination">
        
        {next && (
          <Link to={next.fields.slug} rel="next" className="next-post">
            {next.frontmatter.title} →
          </Link>
        )}
        {previous && (
          <Link to={previous.fields.slug} rel="prev" className="prev-post">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
