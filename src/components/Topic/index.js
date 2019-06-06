import React from 'react'

import { Badge } from 'react-bootstrap'

import './style.scss'

function Topic({ type, children, className, ...rest }) {
  return (
    <Badge variant={type} className={className} {...rest} bsPrefix="topic">
      {children}
    </Badge>
  )
}

export default Topic
