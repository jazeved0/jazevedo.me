import React from 'react'
import classNames from 'classnames'
import { get, isNil } from 'lodash'

import Topic from '../Topic'
import LinkButtonAuto from '../LinkButtonAuto'

import './style.scss'

function ProjectCard({ className, project, ...rest }) {
  const url = get(project, 'url')
  const title = get(project, 'title')
  const type = get(project, 'type')
  const topics = get(project, 'topics.main')

  const description = get(project, 'description')
  const hasDescription = !isNil(description)

  const hasCard = true
  const card = 'https://picsum.photos/700/500'
  const hasLogo = false
  const logo = 'https://picsum.photos/350/200'

  let style = undefined
  if (hasCard) style = { backgroundImage: `url(${card})` }

  return (
    <div className={classNames('project-card', className)} {...rest}>
      <div className="card-top" style={style}>
        <LinkButtonAuto href={url} tabIndex="-1">
          <div className="overlay">
            <Logo hasLogo={hasLogo} logo={logo} title={title} />
            {hasDescription ? (
              <Description title={title} description={description} />
            ) : (
              ''
            )}
          </div>
        </LinkButtonAuto>
      </div>
      <Label url={url} type={type}>
        <div>
          {topics.map(topic => (
            <Topic type="main" key={topic}>
              {topic}
            </Topic>
          ))}
        </div>
      </Label>
    </div>
  )
}

export default ProjectCard

// ? -----------------
// ? Helper Components
// ? -----------------

function Logo({ children, hasLogo, logo, title, className, ...rest }) {
  const base = inner => (
    <div className={classNames('logo-container', className)} {...rest}>
      {inner}
    </div>
  )
  return hasLogo
    ? base(<img src={logo} alt={title.toString() + 'logo'} />)
    : base(<h2>{title}</h2>)
}

function Description({ title, description, className, ...rest }) {
  return (
    <div className={classNames('description', className)} {...rest}>
      <div className="inner text-left">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

function Label({ children, type, url, className, ...rest }) {
  return (
    <div className={classNames('label', className)} {...rest}>
      <LinkButtonAuto className="stretched-link" href={url}>
        <h2>
          <span>{type}</span>
        </h2>
      </LinkButtonAuto>
      {children}
    </div>
  )
}
