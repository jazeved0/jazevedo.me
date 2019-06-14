import React from 'react'
import classNames from 'classnames'
import { isNil, get, defaults, map, omit } from 'lodash'

import LinkButtonAuto from '../LinkButtonAuto'

class LinkBar extends React.Component {
  render() {
    const { links, linkClass, iconClass, ulClass, liClass } = this.props
    return (
      <ul className={ulClass}>
        {map(links, l => {
          const link = defaults(l, {
            href: '#',
            iconClass: iconClass,
          })
          link.className = classNames(
            linkClass,
            get(l, 'class', ''),
            get(l, 'className', '')
          )
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
