import React from 'react'
import classNames from 'classnames'
import { get, isNil } from 'lodash'

import Topic from '../Topic'
import LinkButtonAuto from '../LinkButtonAuto'
import Img from 'gatsby-image'

import './style.scss'

function ProjectCard({ className, project, logo, card, ...rest }) {
  const url = `/projects/${get(project, 'slug')}`
  const title = get(project, 'title')
  const type = get(project, 'type')
  const topics = get(project, 'topics.main')

  const description = get(project, 'description')
  const hasDescription = !isNil(description)

  const hasCard = !isNil(card)
  const hasLogo = !isNil(logo)

  let style = undefined
  if (hasCard && !card.sharpImg) style = { backgroundImage: `url(${card.src})` }

  return (
    <div className={classNames('project-card', className)} {...rest}>
      <div className="card-top" style={style}>
        <LinkButtonAuto href={url} tabIndex="-1">
          {hasCard && card.sharpImg ? (
            <Img
              className="fill-card-top"
              fluid={card.image}
              role="presentation"
              alt=""
            />
          ) : (
            ''
          )}
          <div className="fill-card-top overlay">
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
  const alt = title.toString() + 'logo'
  return hasLogo
    ? base(
        logo.sharpImg ? (
          <Img fluid={logo.image} alt={alt} />
        ) : (
          <img src={logo.src} alt={alt} />
        )
      )
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
