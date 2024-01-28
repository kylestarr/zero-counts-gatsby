import React from "react"
import { Link } from "gatsby"

import Header from "../components/header"
import Footer from "../components/footer"

const Layout = ({ title, children }) => {
  return (
    <div>
      <div className="row header">
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <Header />
        </div>
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <div className="row nav">
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <Link to={"/archive"}>Archive</Link>
          <a href={"https://www.ybutton.online/"}>Podcast</a>
          <Link to={"/gameboys"}>Game Boy Mods</Link>
          {/* <a href={"https://zerocounts.net/rss.xml"}>RSS Feed</a> */}
        </div>
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <div className="row">
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <main>{children}</main>
        </div>
        <div className="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <div className="row footer">
        <div className="col-xs-0 col-sm-3 col-md-2 col-lg-3"></div>
        <div className="col-xs-12 col-sm-6 col-md-8 col-lg-6">
          <Footer />
        </div>
        <div className="col-xs-0 col-sm-3 col-md-2 col-lg-3"></div>
      </div>
    </div>
  )
}

export default Layout
