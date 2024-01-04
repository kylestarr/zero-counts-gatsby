import { Link } from "gatsby"
import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Header = () => {
  return (
    <header>
      <div id="header-image">
        <Link to="/">
          <StaticImage
            src="../images/zero-counts-logo-light.png"
            alt="Zero Counts logo"
            placeholder="none"
            layout="constrained"
            width={528}
          />
        </Link>
      </div>
      <div id="byline">
        <address>By Kyle Starr</address>
      </div>
    </header>
  )
}

export default Header
