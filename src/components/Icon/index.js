import React from 'react'
import { concat, flatMap, includes } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons'
library.add(
  faGithub,
  faLinkedin,
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle
)
const map = { fab: ['github', 'linkedin'] }

const baseStyle = { display: 'inline-block', height: '1em', width: '1em' }
const resolveClass = name => {
  const resolved = flatMap(map, (icons, key) =>
    includes(icons, name) ? [key] : []
  )
  return concat(resolved.length === 0 ? ['fas'] : resolved, name)
}

const Icon = ({ className, name }) => {
  return (
    <div className={className} style={baseStyle}>
      <FontAwesomeIcon icon={resolveClass(name)} />
    </div>
  )
}

export default Icon
