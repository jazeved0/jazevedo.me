import React from 'react'

import Nav from 'components/Nav'
import { Alert } from 'react-bootstrap'

import 'scss/base.scss'

class Layout extends React.Component {
  render() {
    const { children, className, ...rest } = this.props
    return (
      <div className={className}>
        <Nav {...rest} />
        <noscript>
          <div className="container mt-3 noscript-alert">
            <Alert variant="dark">
              This website works better with javascript enabled
            </Alert>
          </div>
        </noscript>
        {children}
      </div>
    )
  }
}

export default Layout
