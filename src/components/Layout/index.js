import React from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'
import { dataHook } from './data-hook'

import Nav from 'components/Nav'
import Icon from 'components/Icon'
import Meta from 'components/Meta'
import { Navbar } from 'react-bootstrap'

import 'scss/base.scss'

function Layout({ title, nav, stickyNav, children, className, ...rest }) {
  const siteMeta = dataHook()

  return (
    <div className={className}>
      <Meta title={title} siteMeta={siteMeta} />
      <div
        className={classNames('nav-container', {
          'sticky-scroll': isNil(stickyNav) ? true : stickyNav,
        })}
      >
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

export default Layout
