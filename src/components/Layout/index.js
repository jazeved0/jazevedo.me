import React from 'react'

import Nav from 'components/Nav'
import { siteMetadata } from '../../../gatsby-config'

import 'scss/base.scss'

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
