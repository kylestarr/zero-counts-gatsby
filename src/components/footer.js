import { Link } from "gatsby"
import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Footer = () => {
  return (
    <footer>
      <div className="social">
        <div className="social-icon">
          <Link to="/about">
            <StaticImage
              src="../images/info-icon-84.png"
              alt="about icon"
              layout="constrained"
              width={42}
            />
          </Link>
        </div>
        <div className="social-icon">
          <Link to={"/rss.xml"} id="rss-feed">
            <StaticImage
              src="../images/feed-icon-84.png"
              alt="feed icon"
              layout="constrained"
              width={42}
            />
          </Link>
        </div>
        <div className="social-icon">
          <a href="mailto:info@zerocounts.net" id="email">
            <StaticImage
              src="../images/mail-icon-84.png"
              alt="feed icon"
              layout="constrained"
              width={42}
            />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
