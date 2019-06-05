import React from 'react'
import { isExternal } from '../../util'
import classNames from 'classnames'
import { isNil, get, defaults } from 'lodash'

import LinkButton from '../LinkButton'

class LinkBar extends React.Component {
  render() {
    const { links } = this.props
    let { linkClass, iconClass, ulClass, liClass } = this.props

    if (isNil(linkClass)) linkClass = ''
    if (isNil(iconClass)) iconClass = ''
    if (isNil(ulClass)) ulClass = ''
    if (isNil(liClass)) liClass = ''

    return (
      <ul className={ulClass}>
        {links.map(l => {
          const link = defaults(l, {
            href: '#',
            noLink: false,
            text: '',
            icon: null,
            newTab: null,
            disabled: false,
            external: isExternal(get(l, 'href', '#')),
            iconClass: iconClass,
          })

          link.className = classNames(linkClass, get(l, 'class', ''))
          const renderLink = !(link.external || link.noLink)

          const key = link.href + '-->' + link.text
          return (
            <li className={liClass} key={key}>
              <LinkButton useLink={renderLink} {...link} />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default LinkBar
