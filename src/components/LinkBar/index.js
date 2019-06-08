import React from 'react'
import classNames from 'classnames'
import { isNil, get, defaults, map, omit } from 'lodash'

import LinkButtonAuto from '../LinkButtonAuto'

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
        {map(links, l => {
          const link = defaults(l, {
            href: '#',
            text: '',
            icon: null,
            newTab: null,
            disabled: false,
            iconClass: iconClass,
          })

          link.className = classNames(linkClass, get(l, 'class', ''))

          const key = link.href + '-->' + link.text
          return (
            <li className={liClass} key={key}>
              <LinkButtonAuto {...omit(link, ['class'])} />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default LinkBar
