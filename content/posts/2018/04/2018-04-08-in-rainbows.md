---
author: zerocounts
date: 2018-04-08 21:00:20+00:00
draft: false
title: In Rainbows
type: post
url: /in-rainbows/
categories:
- Design
tags:
- coding
- computers
- programming
- syntax highlighting
- writing
---

After publishing ‘[Building Zero Counts](https://www.zerocounts.net/2018/03/25/building-zero-counts/)’, I became curious about [syntax highlighting](https://en.m.wikipedia.org/wiki/Syntax_highlighting) — the walls of rainbowed text you see splayed out in front of developers.

In ‘Building Zero Counts’, I used a gradient from sea foam green (#00fa92) to Zero Counts blue (#004992) to denote code. Here’s the Bitbucket Pipeline YAML example I used:


    
    <code>image: php:7.0.27
    
    pipelines:
     default:
     - step:
     script:
     - apt-get update
     - apt-get -qq install git-ftp
     - git ftp push --user $SFTP_username --passwd $SFTP_password --verbose sftp://ftp.[host]/home/[username]/[domain]/wp-content/plugins/jetpack/modules/minileven/theme/pub/minileven
     custom: # Pipelines triggered manually
     full-deploy-after-jetpack-update:
     - step:
     script:
     - apt-get update
     - apt-get -qq install git-ftp
     - git ftp init --user $SFTP_username --passwd $SFTP_password --verbose sftp://ftp.[host]/home/[username]/[domain]/wp-content/plugins/jetpack/modules/minileven/theme/pub/minileven</code>



The color scheme and implementation is completely useless, but it’s meant to abstract how I perceive syntax highlighting. In the tech industry, it’s impossible not to see engineers, developers, and designers living in front of colorful walls of text. And for me, it’s impossible not to want to live and work in this world of rainbows. So, the way I display code on Zero Counts is a window into the beauty I see, the envy I have, and my ignorance of what is actually going on with syntax highlighting.

Poking around, I found some interesting posts about syntax highlighting and some methodologies behind color schemes and implementation. [Ethan Schoonover’s Solarized](http://ethanschoonover.com/solarized) is a simple color scheme that shares the same syntax highlighting between light and dark themes. It’s inspired by reading in the shade vs direct sunlight and incorporates fixed color wheel relationships:


<blockquote>Solarized works as a sixteen color palette for compatibility with common terminal based applications / emulators. In addition, it has been carefully designed to scale down to a variety of five color palettes (four base monotones plus one accent color) for use in design work such as web design. In every case it retains a strong personality but doesn’t overwhelm.

</blockquote>

Meanwhile, [Evan Brooks notes](https://medium.com/@evnbr/coding-in-color-3a6db2743a1e) switching to _semantic highlighting_ from _syntax highlighting_ — an inverted use of highlighting, moving away from colorizing built-in keywords such as `let`, `var`, and `function` to coloring user-defined variables, methods, etc.:


<blockquote>We think syntax highlighting makes the structure of code easier to understand. But as it stands, we highlight the obvious (like the word function) and leave most of the content in black. Rather than highlighting the differences between currentIndex and the keyword function, we could highlight the difference between currentIndex and randomIndex. Here’s what that might look like:
![](https://www.zerocounts.net/wp-content/uploads/2018/04/1TVSPOYO1z8GOVs3tuxNRqA.png)


</blockquote>

Brooks’ method has been incorporated in a variety of text editors. Beyond that, [KDevelop](https://www.kdevelop.org) had actually [incorporated semantic highlighting in 2009](https://zwabel.wordpress.com/2009/01/08/c-ide-evolution-from-syntax-highlighting-to-semantic-highlighting/) — five years before Brooks’ post:


<blockquote>**Understand code**: The real facility that helps you understanding global code-structure is the navigation-tooltip or the code-browser. However those are not very useful to understand local algorithms. The following picture illustrates my favorite part of the semantic highlighting: Local Variable Colorization. That colorization assigns a semi-unique color to each variable in a local context. This allows much easier distinguishing those variables, largely without reading their full name at all. By freeing you of actually having to read all the variable names, this allows grokking local code relations faster, and has already helped me fixing quite a few very stupid bugs right away. 🙂
Great minds!

</blockquote>

Syntax highlighting is a silly reason to want to learn to code, but well designed colorization and implementation certainly make it an attractive work environment. Who wouldn’t want to live [in rainbows](https://itunes.apple.com/us/album/in-rainbows/1109714933)?
