import React from 'react'

import Nav from 'components/Nav'
import Icon from 'components/Icon'
import { Navbar } from 'react-bootstrap'

import 'scss/base.scss'

class Layout extends React.Component {
  render() {
    const { nav, children, className, ...rest } = this.props
    return (
      <div className={className}>
        <div className="nav-container sticky-scroll">
          <noscript>
            <Navbar bg="primary" className="noscript-alert">
              <div className="container py-1">
                <span
                  className="mr-3"
                  style={{ fontSize: '1.5rem', marginTop: '-8px' }}
                >
                  <Icon name="info-circle" />{' '}
                </span>
                This website works better with javascript enabled
              </div>
            </Navbar>
          </noscript>
          <Nav {...rest} />
          {nav}
        </div>
        {children}
      </div>
    )
  }
}

export default Layout
