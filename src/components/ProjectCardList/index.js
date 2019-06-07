import React from 'react'
import classNames from 'classnames'
import { dataHook, getProjectData } from './data-hook'

import ProjectCard from '../ProjectCard'

function ProjectCardList({ projects, className, ...rest }) {
  const cardLogoData = dataHook()

  return (
    <div
      className={classNames('project-container px-3 px-md-0', className)}
      {...rest}
    >
      {projects.map(project => {
        const projectData = getProjectData(project.slug, cardLogoData)
        return (
          <ProjectCard
            key={project.slug}
            project={project}
            card={projectData.card}
            logo={projectData.logo}
          />
        )
      })}
    </div>
  )
}

export default ProjectCardList
