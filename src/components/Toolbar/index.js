import React from 'react'
import classNames from 'classnames'

import LinkBar from '../LinkBar'
import { Navbar } from 'react-bootstrap'

import './style.scss'

function Toolbar({ buttons, background, className, ...rest }) {
  return (
    <Navbar
      bg={background}
      className={classNames('toolbar-outer', className)}
      {...rest}
    >
      <div className="container my-2">
        <LinkBar
          links={buttons}
          ulClass="toolbar container"
          liClass="toolbar-item"
          linkClass="btn"
        />
      </div>
    </Navbar>
  )
}

export default Toolbar
