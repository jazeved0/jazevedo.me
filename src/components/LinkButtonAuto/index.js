import React from 'react'
import { isNil } from 'lodash'

import LinkButton from '../LinkButton'
import { isExternal, isFile } from '../../util'

function LinkButtonAuto({
  href,
  children,
  external,
  onClick,
  action,
  ...rest
}) {
  const externalProp =
    (isNil(external) ? isExternal(href) : external) ||
    !isNil(onClick) ||
    !isNil(action)
  return (
    <LinkButton
      useLink={!externalProp}
      external={externalProp}
      href={href}
      onClick={onClick}
      action={action}
      download={isFile(href) ? true : undefined}
      {...rest}
    >
      {children}
    </LinkButton>
  )
}

export default LinkButtonAuto
