import React from "react"

const Layout = ({ title, children }) => {
  return (
    <div>
      <div class="row header">
        <div class="col-xs-1 col-lg-3"></div>
        <div class="col-xs-10 col-lg-6">
          <header>
            <h1>{title}</h1>
          </header>
        </div>
        <div class="col-xs-1 col-lg-3"></div>
      </div>
      <div class="row">
        <div class="col-xs-1 col-lg-3"></div>
        <div class="col-xs-10 col-lg-6">
          <main>{children}</main>
        </div>
        <div class="col-xs-1 col-lg-3"></div>
      </div>
      <div class="row footer">
        <div class="col-xs-1 col-lg-3"></div>
        <div class="col-xs-10 col-lg-6">
          <footer>
            © {new Date().getFullYear()}
          </footer>
        </div>
        <div class="col-xs-1 col-lg-3"></div>
      </div>
    </div>
  )
}

export default Layout
