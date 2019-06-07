import React from 'react'
import { concat, flatMap, includes } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
library.add(faGithub, faLinkedin, faEnvelope)
const map = { fab: ['github', 'linkedin'], fas: ['envelope'] }

const baseStyle = { display: 'inline-block', height: '1em', width: '1em' }
const resolveClass = name =>
  concat(
    flatMap(map, (value, key) => (includes(value, name) ? [key] : [])),
    name
  )

const Icon = ({ className, name }) => {
  return (
    <div className={className} style={baseStyle}>
      <FontAwesomeIcon icon={resolveClass(name)} />
    </div>
  )
}

export default Icon
