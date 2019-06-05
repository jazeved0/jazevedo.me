import React from 'react'
import { concat, flatMap, includes } from 'lodash'
import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
library.add(faGithub, faLinkedin, faEnvelope)
const map = { fab: ['github', 'linkedin'], fas: ['envelope'] }

const resolveClass = name =>
  concat(
    flatMap(map, (value, key) => (includes(value, name) ? [key] : [])),
    name
  )

const Icon = ({ className, name }) => {
  return <FontAwesomeIcon className={className} icon={resolveClass(name)} />
}

export default Icon
