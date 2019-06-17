import React from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'
import { dataHook } from './data-hook'

import Nav from 'components/Nav'
import Meta from 'components/Meta'
import Footer from 'components/Footer'

import 'scss/base.scss'
import './style.scss'

function Layout({
  title,
  nav,
  stickyNav,
  children,
  transparentFooter,
  className,
  ...rest
}) {
  const siteMeta = dataHook()

  return (
    <div className={classNames(className, 'site-wrapper')}>
      <Meta title={title} siteMeta={siteMeta} />
      <div className="content">
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
      <Footer className={classNames({ transparent: transparentFooter })} />
    </div>
  )
}

export default Layout
