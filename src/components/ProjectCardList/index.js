import React from 'react'
import classNames from 'classnames'

import ProjectCard from '../ProjectCard'

function ProjectCardList({ projects, className, ...rest }) {
  return (
    <div
      className={classNames('row project-container px-3 px-md-0', className)}
      {...rest}
    >
      {projects.map(project => (
        <ProjectCard
          className="col-12 col-md-6 col-xl-4"
          key={project.slug}
          project={project}
        />
      ))}
    </div>
  )
}

export default ProjectCardList
