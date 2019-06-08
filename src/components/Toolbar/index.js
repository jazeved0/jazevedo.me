import React from 'react'
import classNames from 'classnames'
import { isNil } from 'lodash'

import ButtonBar from '../ButtonBar'
import { Navbar } from 'react-bootstrap'

import './style.scss'

function Toolbar({ buttons, background, className, fixed, ...rest }) {
  return (
    <div
      className={classNames('toolbar-outer', className, {
        fixed: !isNil(fixed),
      })}
    >
      <Navbar bg={background} expand="md" fixed={fixed} {...rest}>
        <div className="container my-2">
          <ButtonBar buttons={buttons} />
        </div>
      </Navbar>
    </div>
  )
}

export default Toolbar
