import React from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'
import { dataHook } from './data-hook'

import Nav from 'components/Nav'
import Meta from 'components/Meta'

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
        <Nav {...rest} />
        {nav}
      </div>
      {children}
    </div>
  )
}

export default Layout
