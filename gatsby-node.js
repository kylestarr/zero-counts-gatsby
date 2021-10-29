const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createRedirect } = actions
  createRedirect({ fromPath: "/hail-mario/", toPath: "/2014/06/01/hail-mario/", statusCode: 301})
  createRedirect({ fromPath: "/2014/06/01/hail-mary-o/", toPath: "/2014/06/01/hail-mario/", statusCode: 301})
  createRedirect({ fromPath: "/star-fox-64-design-mission-accomplished/", toPath: "/2013/04/20/star-fox-64-design-mission-accomplished/", statusCode: 301})
  createRedirect({ fromPath: "/e3-2013/", toPath: "/2013/06/15/e3-2013-genre-gender-breakdown/", statusCode: 301})
  createRedirect({ fromPath: "/save-developers-and-you-will-save-your-soul/", toPath: "/2014/03/13/save-developers-and-you-will-save-your-soul/", statusCode: 301})
  createRedirect({ fromPath: "/myst-tv-drama-and-companion-video-game/", toPath: "/2014/10/08/myst-tv-drama-and-companion-video-game/", statusCode: 301})
  createRedirect({ fromPath: "/old-school-hip-hop-is-the-new-golden-oldies/", toPath: "/2014/12/28/old-school-hip-hop-is-the-new-golden-oldies/", statusCode: 301})
  createRedirect({ fromPath: "/home-economics-2-0/", toPath: "/2015/01/27/home-economics-2-0/", statusCode: 301})
  createRedirect({ fromPath: "/gender/", toPath: "/2015/02/08/e3-2014-genre-gender-breakdown/", statusCode: 301})
  createRedirect({ fromPath: "/would-disney-buy-nintendo/", toPath: "/2015/05/07/would-disney-buy-nintendo/", statusCode: 301})
  createRedirect({ fromPath: "/buttons/", toPath: "/2015/05/31/buttons/", statusCode: 301})
  createRedirect({ fromPath: "/firewatch-review/", toPath: "/2016/02/21/firewatch-review/", statusCode: 301})
  createRedirect({ fromPath: "/the-witness-a-cheaters-review/", toPath: "/2016/03/11/the-witness-a-cheaters-review/", statusCode: 301})
  createRedirect({ fromPath: "/pokemon-goty/", toPath: "/2016/07/13/pokemon-goty/", statusCode: 301})
  createRedirect({ fromPath: "/nintendo-switch-presentation-2017-impressions/", toPath: "/2017/01/14/nintendo-switch-presentation-2017-impressions/", statusCode: 301})
  createRedirect({ fromPath: "/reggie-fils-aime-i-dont-mind-how-you-interact-with-our-ip-as-long-as-youre-interacting-with-it-every-day/", toPath: "/2017/01/15/reggie-fils-aime-i-dont-mind-how-you-interact-with-our-ip-as-long-as-youre-interacting-with-it-every-day/", statusCode: 301})
  createRedirect({ fromPath: "/the-second-console/", toPath: "/2017/02/10/the-second-console/", statusCode: 301})
  createRedirect({ fromPath: "/business/self-competing-and-time-blocking/", toPath: "/2017/04/23/self-competing-and-time-blocking/", statusCode: 301})
  createRedirect({ fromPath: "/self-competing-and-time-blocking/", toPath: "/2017/04/23/self-competing-and-time-blocking/", statusCode: 301})
  createRedirect({ fromPath: "/hail-mario-2-electrodrome-boogaloo/", toPath: "/2017/04/30/hail-mario-2-electrodrome-boogaloo/", statusCode: 301})
  createRedirect({ fromPath: "/general/sold-on-cross-network-play/", toPath: "/2017/06/18/sold-on-cross-network-play/", statusCode: 301})
  createRedirect({ fromPath: "/e3-2017/", toPath: "/2017/06/19/e3-2017/", statusCode: 301})
  createRedirect({ fromPath: "/sell-my-old-consoles-im-off-to-handheld/", toPath: "/2017/08/05/sell-my-old-consoles-im-off-to-handheld/", statusCode: 301})
  createRedirect({ fromPath: "/mario-rabbids-kingdom-battle-just-looking-around-is-a-joy/", toPath: "/2017/08/28/mario-rabbids-kingdom-battle-just-looking-around-is-a-joy/", statusCode: 301})
  createRedirect({ fromPath: "/super-mario-odyssey-a-review/", toPath: "/2017/11/19/super-mario-odyssey-a-review/", statusCode: 301})
  createRedirect({ fromPath: "/good-enough/", toPath: "/2017/11/22/good-enough/", statusCode: 301})
  createRedirect({ fromPath: "/big-ns-big-year/", toPath: "/2017/11/28/big-ns-big-year/", statusCode: 301})
  createRedirect({ fromPath: "/building-zero-counts/", toPath: "/2018/03/25/building-zero-counts/", statusCode: 301})
  createRedirect({ fromPath: "/cross-network-play-is-the-next-logical-step/", toPath: "/2018/03/25/cross-network-play-is-the-next-logical-step/", statusCode: 301})
  createRedirect({ fromPath: "/the-verge-my-xbox-one-s-is-now-a-meaningfully-different-console-to-my-ps4/", toPath: "/2018/04/22/the-verge-my-xbox-one-s-is-now-a-meaningfully-different-console-to-my-ps4/", statusCode: 301})
  createRedirect({ fromPath: "/microsofts-xbox-adaptive-controller/", toPath: "/2018/05/17/microsofts-xbox-adaptive-controller/", statusCode: 301})
  createRedirect({ fromPath: "/ps4-fortnite-accounts-are-blocked-on-the-nintendo-switch/", toPath: "/2018/06/12/ps4-fortnite-accounts-are-blocked-on-the-nintendo-switch/", statusCode: 301})
  createRedirect({ fromPath: "/sometimes-failure-leads-to-opportunity/", toPath: "/2018/06/12/sometimes-failure-leads-to-opportunity/", statusCode: 301})
  createRedirect({ fromPath: "/xbox-switch-better-together-campaign/", toPath: "/2018/06/22/xbox-switch-better-together-campaign/", statusCode: 301})
  createRedirect({ fromPath: "/cross-platform-play-coming-to-ps4-starting-with-fortnite/", toPath: "/2018/09/26/cross-platform-play-coming-to-ps4-starting-with-fortnite/", statusCode: 301})
  createRedirect({ fromPath: "/there-are-too-many-video-games-what-now/", toPath: "/2018/09/28/there-are-too-many-video-games-what-now/", statusCode: 301})
  createRedirect({ fromPath: "/demo-mode-rise-of-the-tomb-raider/", toPath: "/2016/01/18/demo-mode-rise-of-the-tomb-raider/", statusCode: 301})
  createRedirect({ fromPath: "/egoraptor-just-harshly-criticized-ocarina-of-time-on-the-internet/", toPath: "/2014/07/04/egoraptor-just-harshly-criticized-ocarina-of-time-on-the-internet/", statusCode: 301})
  createRedirect({ fromPath: "/gruber-there-is-a-thing-to-being-mac-like/", toPath: "/2019/01/01/gruber-there-is-a-thing-to-being-mac-like/", statusCode: 301})
  createRedirect({ fromPath: "/the-year-in-gaming-controversies/", toPath: "/2019/01/02/the-year-in-gaming-controversies/", statusCode: 301})
  createRedirect({ fromPath: "/uk-video-games-market-is-now-80-digital/", toPath: "/2019/01/03/uk-video-games-market-is-now-80-digital/", statusCode: 301})
  createRedirect({ fromPath: "/20-years-of-starcraft/", toPath: "/2019/01/05/20-years-of-starcraft/", statusCode: 301})
  createRedirect({ fromPath: "/jim-guthrie-and-the-below-soundtrack/", toPath: "/2019/01/18/jim-guthrie-and-the-below-soundtrack/", statusCode: 301})
  createRedirect({ fromPath: "/activision-microsoft-and-platforms/", toPath: "/2019/01/21/activision-microsoft-and-platforms/", statusCode: 301})
  createRedirect({ fromPath: "/switch-is-selling-like-wii-thanks-to-traditional-nintendo-games/", toPath: "/2019/01/23/switch-is-selling-like-wii-thanks-to-traditional-nintendo-games/", statusCode: 301})
  createRedirect({ fromPath: "/polygon-the-battle-between-steam-and-epic-games-store-is-heating-up/", toPath: "/2019/01/29/polygon-the-battle-between-steam-and-epic-games-store-is-heating-up/", statusCode: 301})
  createRedirect({ fromPath: "/nintendo-earnings-fy18-q3/", toPath: "/2019/01/31/nintendo-earnings-fy18-q3/", statusCode: 301})
  createRedirect({ fromPath: "/microsofts-super-bowl-ad/", toPath: "/2019/02/01/microsofts-super-bowl-ad/", statusCode: 301})
  createRedirect({ fromPath: "/real-world-playbook/", toPath: "/2019/02/02/real-world-playbook/", statusCode: 301})
  createRedirect({ fromPath: "/microsoft-to-bring-xbox-live-to-the-switch/", toPath: "/2019/02/04/microsoft-to-bring-xbox-live-to-the-switch/", statusCode: 301})
  createRedirect({ fromPath: "/activision-blizzard-employees-brace-for-massive-layoffs/", toPath: "/2019/02/09/activision-blizzard-employees-brace-for-massive-layoffs/", statusCode: 301})
  createRedirect({ fromPath: "/activision-blizzard-cuts-hundreds-of-jobs-despite-record-revenue-year/", toPath: "/2019/02/12/activision-blizzard-cuts-hundreds-of-jobs-despite-record-revenue-year/", statusCode: 301})
  createRedirect({ fromPath: "/rumor-microsoft-bringing-game-pass-and-published-titles-to-switch/", toPath: "/2019/02/21/rumor-microsoft-bringing-game-pass-and-published-titles-to-switch/", statusCode: 301})
  createRedirect({ fromPath: "/but-the-answer-is-simpler-when-it-comes-to-the-real-money-maker-for-microsoft/", toPath: "/2019/02/22/but-the-answer-is-simpler-when-it-comes-to-the-real-money-maker-for-microsoft/", statusCode: 301})
  createRedirect({ fromPath: "/nintendo-knew-how/", toPath: "/2019/03/10/nintendo-knew-how/", statusCode: 301})
  createRedirect({ fromPath: "/game-boy-restored/", toPath: "/2019/04/21/game-boy-restored/", statusCode: 301})
  createRedirect({ fromPath: "/a-video-game-developed-to-detect-alzheimers-disease-seems-to-be-working/", toPath: "/2019/04/28/a-video-game-developed-to-detect-alzheimers-disease-seems-to-be-working/", statusCode: 301})
  createRedirect({ fromPath: "/playdate/", toPath: "/2019/05/22/playdate/", statusCode: 301})
  createRedirect({ fromPath: "/its-like-friendly-punk/", toPath: "/2019/05/23/its-like-friendly-punk/", statusCode: 301})
  createRedirect({ fromPath: "/but-when-i-play-video-games-i-begin-feeling-guilty-and-even-bored/", toPath: "/2019/07/07/but-when-i-play-video-games-i-begin-feeling-guilty-and-even-bored/", statusCode: 301})
  createRedirect({ fromPath: "/fire-emblem-management-simulator/", toPath: "/2019/08/29/fire-emblem-management-simulator/", statusCode: 301})
  createRedirect({ fromPath: "/eurogamer-docked-zelda-stutters-in-places-where-the-mobile-experience-does-not/", toPath: "/2017/03/03/eurogamer-docked-zelda-stutters-in-places-where-the-mobile-experience-does-not/", statusCode: 301})
  createRedirect({ fromPath: "/adjustable-charging-stand-for-nintendo-switch/", toPath: "/2018/05/09/adjustable-charging-stand-for-nintendo-switch/", statusCode: 301})
  createRedirect({ fromPath: "/polygons-100-best-games-of-the-decade/", toPath: "/2019/11/05/polygons-100-best-games-of-the-decade/", statusCode: 301})
  createRedirect({ fromPath: "/hail-mario-3-revenge-of-the-stock/", toPath: "/2019/11/08/hail-mario-3-revenge-of-the-stock/", statusCode: 301})
  createRedirect({ fromPath: "/star-wars-the-rise-of-skywalker-a-review/", toPath: "/2019/12/18/star-wars-the-rise-of-skywalker-a-review/", statusCode: 301})
  createRedirect({ fromPath: "/estimates-nintendo-switch-passed-the-xbox-one-in-hardware-shipments/", toPath: "/2020/01/31/estimates-nintendo-switch-passed-the-xbox-one-in-hardware-shipments/", statusCode: 301})
  createRedirect({ fromPath: "/gamestop-is-a-garbage-company/", toPath: "/2020/03/20/gamestop-is-a-garbage-company/", statusCode: 301})
  createRedirect({ fromPath: "/%f0%9f%a6%a0-nbcsw-will-broadcast-video-game-simulations-of-wizards-and-capitals-games/", toPath: "/2020/03/20/nbcsw-will-broadcast-video-game-simulations-of-wizards-and-capitals-games/", statusCode: 301})
  createRedirect({ fromPath: "/the-comfort-of-childhood-media-during-lockdown/", toPath: "/2020/03/29/the-comfort-of-childhood-media-during-lockdown/", statusCode: 301})
  createRedirect({ fromPath: "/listen-to-me-motherfucker-listen/", toPath: "/2020/03/30/listen-to-me-motherfucker-listen/", statusCode: 301})
  createRedirect({ fromPath: "/vgc-nintendo-will-reveal-plans-to-re-release-most-of-super-marios-35-year-back-catalogue-this-year/", toPath: "/2020/03/30/vgc-nintendo-will-reveal-plans-to-re-release-most-of-super-marios-35-year-back-catalogue-this-year/", statusCode: 301})
  createRedirect({ fromPath: "/were-not-necessarily-expecting-a-setting-like-animal-crossing-to-be-the-real-world-and-maybe-thats-partly-why-it-works/", toPath: "/2020/04/13/were-not-necessarily-expecting-a-setting-like-animal-crossing-to-be-the-real-world-and-maybe-thats-partly-why-it-works/", statusCode: 301})
  createRedirect({ fromPath: "/video-games-hell-yeah/", toPath: "/2020/05/14/video-games-hell-yeah/", statusCode: 301})
  createRedirect({ fromPath: "/endeavorrx-first-video-game-approved-by-fda/", toPath: "/2020/06/18/endeavorrx-first-video-game-approved-by-fda/", statusCode: 301})
  createRedirect({ fromPath: "/good-sudoku-and-the-grid/", toPath: "/2020/08/01/good-sudoku-and-the-grid/", statusCode: 301})
  createRedirect({ fromPath: "/sports-are-forging-a-trail-which-the-games-industry-would-be-wise-to-follow/", toPath: "/2020/08/29/sports-are-forging-a-trail-which-the-games-industry-would-be-wise-to-follow/", statusCode: 301})
  createRedirect({ fromPath: "/super-mario-3d-all-stars-announcement/", toPath: "/2020/09/03/super-mario-3d-all-stars-announcement/", statusCode: 301})
  createRedirect({ fromPath: "/2013/10/15/why-game/", toPath: "/2013/10/15/1985-burst-and-bloom/", statusCode: 301})
  createRedirect({ fromPath: "/thoughts-on-star-wars-teaser-2/", toPath: "/2015/04/17/thoughts-on-star-wars-teaser-2/", statusCode: 301})
  createRedirect({ fromPath: "/tag/rocksmith-2014/", toPath: "/2015/01/25/goty-rocksmith-2014/", statusCode: 301})
  createRedirect({ fromPath: "/general/ps4-fortnite-accounts-are-blocked-on-the-nintendo-switch/", toPath: "/2018/06/12/ps4-fortnite-accounts-are-blocked-on-the-nintendo-switch/", statusCode: 301})
  createRedirect({ fromPath: "/tag/moneyball/", toPath: "/2014/05/23/people-of-a-certain-age/", statusCode: 301})
  createRedirect({ fromPath: "/page/5/", toPath: "/5", statusCode: 301})
  createRedirect({ fromPath: "/nintendo-switch-is-the-fastest-selling-console-in-u-s-history/", toPath: "/2018/01/23/nintendo-switch-is-the-fastest-selling-console-in-u-s-history/", statusCode: 301})
  createRedirect({ fromPath: "/the-paradox-of-fun/", toPath: "/2018/09/15/the-paradox-of-fun/", statusCode: 301})
  createRedirect({ fromPath: "/study-playing-video-games-can-increase-brain-size/", toPath: "/2013/11/05/study-playing-video-games-can-increase-brain-size/", statusCode: 301})
  createRedirect({ fromPath: "/video-games-crash-course/", toPath: "/2014/06/02/video-games-crash-course/", statusCode: 301})
  createRedirect({ fromPath: "/griffin-and-justin-mcelroy-depart-polygon/", toPath: "/2018/04/25/griffin-and-justin-mcelroy-depart-polygon/", statusCode: 301})
  createRedirect({ fromPath: "/tag/reading/feed/", toPath: "/2014/02/24/on-reading/", statusCode: 301})
  createRedirect({ fromPath: "/tag/playstation-4/feed/", toPath: "/", statusCode: 301})
  createRedirect({ fromPath: "/tag/lgbt/page/2/", toPath: "/", statusCode: 301})
  createRedirect({ fromPath: "/video-games-do-not-exist/", toPath: "/2019/10/01/video-games-do-not-exist/", statusCode: 301})
  
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
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

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
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
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}