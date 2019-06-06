import React from 'react'

import LinkButton from '../LinkButton'
import { isExternal } from '../../util'

function LinkButtonAuto({ href, children, ...rest }) {
  return (
    <LinkButton useLink={!isExternal(href)} href={href} {...rest}>
      {children}
    </LinkButton>
  )
}

export default LinkButtonAuto
