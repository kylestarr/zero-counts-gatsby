import React from "react"
import { Link, graphql } from "gatsby"

import Seo from "../components/seo"
import Layout from "../components/layout"

class ArchiveIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Seo
          title={siteTitle}
          keywords={[
            `video games`,
            `blog`,
            `business`,
            `education`,
            `culture`,
            `design`,
          ]}
        />
        <div id="archive-list">
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.filePath
            return (
              <article key={node.fields.filePath}>
                <h2>
                  <Link to={node.fields.filePath}>{title}</Link>
                </h2>
                <time>{node.frontmatter.date}</time>
              </article>
            )
          })}
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
      sort: { frontmatter: { date: DESC } }
      filter: { fileAbsolutePath: { regex: "/posts/" } }
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
