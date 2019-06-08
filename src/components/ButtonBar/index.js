import React from 'react'
import classNames from 'classnames'

import LinkBar from '../LinkBar'

import './style.scss'

function ButtonBar({ buttons, className, liClass, linkClass, ...rest }) {
  return (
    <LinkBar
      links={buttons}
      ulClass={classNames('button-bar', className)}
      liClass={classNames('button-bar-item', liClass)}
      linkClass={classNames('btn', linkClass)}
      {...rest}
    />
  )
}

export default ButtonBar
