import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo.jsx"

const GameboyTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext

  return (
    <Layout location={location} title={siteTitle}>
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <time>{post.frontmatter.date}</time>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
      <nav id="post-pagination">
        {next && (
          <Link
            to={`/gameboys/${next.frontmatter.slug}`}
            rel="next"
            className="next-post"
          >
            {next.frontmatter.title} →
          </Link>
        )}
        {previous && (
          <Link
            to={`/gameboys/${previous.frontmatter.slug}`}
            rel="prev"
            className="prev-post"
          >
            ← {previous.frontmatter.title}
          </Link>
        )}
      </nav>
    </Layout>
  )
}

export default GameboyTemplate

export const Head = ({ data }) => (
  <Seo
    title={`${data.markdownRemark.frontmatter.title} - Game Boy Mods - ${data.site.siteMetadata.title}`}
    description={
      data.markdownRemark.frontmatter.description || data.markdownRemark.excerpt
    }
    thumbnail={
      data.markdownRemark.frontmatter.thumbnail.childImageSharp.original.src
    }
    thumbnailAlt={data.markdownRemark.frontmatter.thumbnailAlt}
  />
)

export const pageQuery = graphql`
  query GameboyByfilePath($filePath: String!) {
    site {
      siteMetadata {
        title
        siteUrl
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
        thumbnail {
          childImageSharp {
            original {
              src
            }
          }
        }
      }
    }
  }
`
