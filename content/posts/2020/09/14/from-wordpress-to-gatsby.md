---
title: "From WordPress to Gatsby"
date: "2020-09-14"
slug: "from-wordpress-to-gatsby"
category: "general"
postFormat:
- Link
tags:
    - web-development
---

As of today, I no longer have a CMS backing Zero Counts, my analytics have been wiped away, and most of my posts have been removed from the website.

No, this is not the next catastrophic event of 2020. The internet is not slowly dissolving like a post-Thanos snap. Quite the opposite. This is self-imposed (and maybe a huge mistake), but it's a project I've been meaning to take on since the beginning of quarantine. (As if I didn't have enough to worry about this year.) 

As the title states, I moved Zero Counts from a [self-hosted WordPress](https://wordpress.org) instance hosted with [DreamHost](https://www.dreamhost.com) to a static site built with [Gatsby.js](https://www.gatsbyjs.com) and hosted with [Netlify](https://www.netlify.com) CDN. What does this mean? In short, Zero Counts is faster, more efficient, and better suited for SEO and accessibility.

For those unfamiliar, with WordPress, all of my posts were published with the WordPress CMS and stored in a database. When you visited the website, your device had to make several roundtrips to a server to fetch each post. However, with Gatsby, the site gets regenerated every time I make a change to the codebase, including posts. Therefore, most everything — HTML+CSS and content — is compiled into a single static application that your device fetches (generally) once from a server.

On top of that, when visiting the WordPress version of Zero Counts, upwards of 10 CSS files were downloaded onto your device — including the Bootstrap CSS necessary for the grid system I used for page layout — totaling 225KB, give or take. This may or may not have been WordPress's fault; maybe just my inexperience with PHP and Wordpress themes. With the Gatsby version of Zero Counts, I wrote a single bare minimum CSS file including a [Bootstrap grid clone using CSS grid](https://speckyboy.com/replicate-bootstrap-grid-using-css-grid/).

On the authoring side, all of the website's code and content are stored in a single code repository that I push to GitHub. I no longer write or manage any content in a CMS (for now). Instead, I write raw Markdown files and push them straight to GitHub. (God, I love [Markdown](https://daringfireball.net/projects/markdown/).) I can write these in an IDE like [VS Code](https://code.visualstudio.com) or a Markdown compatible word processor like [iA Writer](https://ia.net/writer). Once I finish a post, I push the file to GitHub, Gatsby re-generates the HTML for [zerocounts.net](https://zerocounts.net), and the new post appears.

I won't go into [a lengthy piece](/2018/03/25/building-zero-counts/) about how all of this was done. Instead, I'll point to some resources that helped me get here:
- Tania Rascia's ["The End of an Era: Migrating from WordPress to Gatsby"](https://www.taniarascia.com/migrating-from-wordpress-to-gatsby/) pointed me in the direction of [ExitWP](https://github.com/thomasf/exitwp) — a tool to convert Wordpress XML to Markdown.
- While Rascia leveraged the [Gatsby Advanced Starter](https://github.com/vagr9k/gatsby-advanced-starter/), I decided that was overkill for Zero Counts and began with the [Gatsby Starter Blog](https://www.gatsbyjs.com/starters/gatsbyjs/gatsby-starter-blog) and incorporated bits from the [gatsby-paginated-blog](https://github.com/NickyMeuleman/gatsby-paginated-blog).
- Many WordPress to Gatsby posts (including Rascia's) pointed to [Netlify](https://www.netlify.com) for CDN hosting. If you're not familiar, think of a CDN as a global network of servers. When a user visits Zero Counts, the user gets pointed to the server closest to them for the fastest download. (The internet still abides by physics, folks.)
- I'm fairly proficient in Markdown, but I did reference [John Gruber's Markdown spec](https://daringfireball.net/projects/markdown/) several times.
- Chris Wachtman's ["How to Replicate the Bootstrap 3 Grid Using CSS Grid"](https://speckyboy.com/replicate-bootstrap-grid-using-css-grid/) was immensely helpful.

The migration is not entirely complete. While ExitWP is a great tool, each post requires a bit of Markdown clean-up. Therefore, I've only ported over posts from 2019–2020 as well as any interlinked posts prior to 2019. I'll be chipping away at the remainder of posts from 2013–2018 over time.

Zero Counts began as a Tumblr blog called The Starr List back in 2013 or so. Over time, I moved over to WordPress.com, [dabbled and stumbled around in code](/2018/04/08/in-rainbows/), migrated to a self-hosted WordPress site using a stock theme, created my own child theme, and eventually moved everything into a single codebase, allowing me quickly develop locally and offer up an optimized version of Zero Counts.

It's been a lot of work and education, and finding time is not easy. In any case, here's to another iteration of Zero Counts. Here's to you, [old sport](/2014/12/30/2014-zero-counts-launch-greatest-hits/).