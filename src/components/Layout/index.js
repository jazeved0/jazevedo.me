import React from 'react'

import Nav from 'components/Nav'
import { siteMetadata } from '../../../gatsby-config'

import 'modern-normalize/modern-normalize.css'
import 'prismjs/themes/prism.css'
import 'scss/base.scss'
import 'animate.css/animate.css'
import 'font-awesome/css/font-awesome.css'

class Layout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <div>
        <Nav {...this.props} />
        {children}
      </div>
    )
  }
}

export default Layout
