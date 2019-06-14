import React from 'react'
import { concat, flatMap, includes } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faGithub,
  faLinkedin,
  faTwitch,
  faDocker,
} from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faArchive,
  faMap,
  faFilePdf,
  faFilePowerpoint,
  faBoxes,
  faBook,
  faDatabase,
} from '@fortawesome/free-solid-svg-icons'
import { csOverleaf } from './custom'
library.add(
  faGithub,
  faLinkedin,
  faEnvelope,
  faFileCode,
  faDownload,
  faHome,
  faChevronLeft,
  faInfoCircle,
  faExternalLinkAlt,
  faArchive,
  faMap,
  faFilePdf,
  faTwitch,
  faFilePowerpoint,
  faBoxes,
  faBook,
  csOverleaf,
  faDatabase,
  faDocker
)
const map = { fab: ['github', 'linkedin', 'twitch', 'overleaf', 'docker'] }

const baseStyle = { display: 'inline-block', height: '1em', width: '1em' }
const resolveClass = name => {
  const resolved = flatMap(map, (icons, key) =>
    includes(icons, name) ? [key] : []
  )
  return concat(resolved.length === 0 ? ['fas'] : resolved, name)
}

const Icon = ({ className, name }) => {
  return (
    <span className={className} style={baseStyle}>
      <FontAwesomeIcon icon={resolveClass(name)} />
    </span>
  )
}

export default Icon
