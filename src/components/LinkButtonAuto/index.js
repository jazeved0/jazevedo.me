import React from 'react'
import { isNil } from 'lodash'

import LinkButton from '../LinkButton'
import { isExternal, isFile } from '../../util'

function LinkButtonAuto({ href, children, external, ...rest }) {
  const externalProp = isNil(external) ? isExternal(href) : external
  return (
    <LinkButton
      useLink={!externalProp}
      href={href}
      download={isFile(href) ? true : undefined}
      {...rest}
    >
      {children}
    </LinkButton>
  )
}

export default LinkButtonAuto
