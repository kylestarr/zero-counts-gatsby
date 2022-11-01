import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const GameboyTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      
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
          <Link to={`/gameboys/${next.frontmatter.slug}`} rel="next" className="next-post">
            {next.frontmatter.title} →
          </Link>
        )}
        {previous && (
          <Link to={`/gameboys/${previous.frontmatter.slug}`} rel="prev" className="prev-post">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default GameboyTemplate

export const pageQuery = graphql`
  query GameboyByfilePath($filePath: String!) {
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
        slug
      }
    }
  }
`
