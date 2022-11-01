const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const redirects = require("./redirects.json");

exports.createPages = async ({ graphql, actions }) => {
  
  const { createRedirect } = actions
  redirects.forEach(redirect => 
		createRedirect({
	    fromPath: redirect.fromPath,
	    toPath: redirect.toPath,
      statusCode: redirect.statusCode
	  })
	)

  const { createPage } = actions

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)
  const postQuery = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {fileAbsolutePath: {regex: "/posts/"}}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                filePath
              }
              frontmatter {
                title
              }
            }
          }
        }
      }
    `
  )

  if (postQuery.errors) {
    throw postQuery.errors
  }

  // Create blog post pages
  const posts = postQuery.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.filePath,
      component: blogPostTemplate,
      context: {
        filePath: post.node.fields.filePath,
        previous,
        next,
      },
    })
  })

  // Create Game Boy pages
  const gameBoyQuery = await graphql(
    `
      {
        allMarkdownRemark(
          filter: {fileAbsolutePath: {regex: "/gameboys/"}}
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                filePath
              }
              frontmatter {
                title
                slug
              }
            }
          }
        }
      }
    `
  )
  
  const gameBoyPosts = gameBoyQuery.data.allMarkdownRemark.edges

  gameBoyPosts.forEach((gameBoyPost, index) => {
    const previous = index === gameBoyPosts.length - 1 ? null : gameBoyPosts[index + 1].node
    const next = index === 0 ? null : gameBoyPosts[index - 1].node

    createPage({
      path: `/gameboys/${gameBoyPost.node.frontmatter.slug}`,
      component: blogPostTemplate,
      context: {
        filePath: gameBoyPost.node.fields.filePath,
        previous,
        next,
      },
    })
  })

  // Create blog post list pages
  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: path.resolve('./src/templates/blog-list.js'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1
      },
    });
  });

  // Create archive list page
  createPage({
    path: `/archive`,
    component: path.resolve('./src/templates/archive-list.js'),
  })

  // Create archive list page
  createPage({
    path: `/gameboys`,
    component: path.resolve('./src/templates/gameboys-list.js'),
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `filePath`,
      node,
      value,
    })
  }
}