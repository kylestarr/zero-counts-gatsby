import { Link } from "gatsby"
import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const definedHeight = 20

const Footer = () => {
  return (
    <footer>
      <div className="social">
        <div className="social-icon">
          <Link to="/about">
            <StaticImage
              src="../images/info-icon.svg"
              alt="about icon"
              layout="constrained"
              height={definedHeight}
            />
          </Link>
        </div>
        <div className="social-icon">
          <a href="https://mas.to/@zerocounts" id="mastodon">
            <StaticImage
              src="../images/mastodon-icon.svg"
              alt="mastodon icon"
              layout="constrained"
              height={definedHeight}
            />
          </a>
        </div>
        <div className="social-icon">
          <a href={"https://zerocounts.net/rss.xml"} id="rss-feed">
            <StaticImage
              src="../images/feed-icon.svg"
              alt="feed icon"
              layout="constrained"
              height={definedHeight}
            />
          </a>
        </div>
        <div className="social-icon">
          <a href="mailto:info@zerocounts.net" id="email">
            <StaticImage
              src="../images/mail-icon.svg"
              alt="mail icon"
              layout="constrained"
              height={definedHeight}
            />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
