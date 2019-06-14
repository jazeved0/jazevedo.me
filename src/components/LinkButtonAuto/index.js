import React from 'react'
import { isNil } from 'lodash'
import { isAction } from './util'
import { isExternal, isFile } from '../../util'

import LinkButton from '../LinkButton'

function LinkButtonAuto({
  href,
  children,
  external,
  onClick,
  action,
  newTab,
  ...rest
}) {
  const externalProp = isNil(external) ? isExternal(href) : external
  const useAnchor =
    externalProp ||
    isFile(href) ||
    !isNil(onClick) ||
    isAction(action) ||
    (!isNil(newTab) && newTab)
  return (
    <LinkButton
      useLink={!useAnchor}
      external={externalProp}
      href={href}
      onClick={onClick}
      action={action}
      newTab={newTab}
      {...rest}
    >
      {children}
    </LinkButton>
  )
}

export default LinkButtonAuto
