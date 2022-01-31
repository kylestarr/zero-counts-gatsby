import React from "react"
import {Link} from 'gatsby'

import Header from "../components/header"
import Footer from "../components/footer"

const Layout = ({ title, children }) => {
  return (
    <div>
      <div class="row header">
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div class="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <Header />
        </div>
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <div class="row">
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
        <div class="col-xs-12 col-sm-8 col-md-8 col-lg-6">
          <main>{children}</main>
        </div>
        <div class="col-xs-0 col-sm-2 col-md-2 col-lg-3"></div>
      </div>
      <div class="row footer">
        <div class="col-xs-0 col-sm-3 col-md-2 col-lg-3"></div>
        <div class="col-xs-12 col-sm-6 col-md-8 col-lg-6">
          <Footer />
        </div>
        <div class="col-xs-0 col-sm-3 col-md-2 col-lg-3"></div>
      </div>
    </div>
  )
}

export default Layout
