import React from 'react'
import { graphql } from 'gatsby'
import { omit, isNil } from 'lodash'
import classNames from 'classnames'
import { imgUrlFormat } from '../../util'

import Layout from 'components/Layout'
import ButtonBar from 'components/ButtonBar'
import Topic from 'components/Topic'

import './style.scss'
import backgroundSVG from '../../../static/img/project-background.svg'

export const query = graphql`
  query($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        shortTitle
        type
        title
        start
        end
        lead
        topics {
          main
          secondary
        }
        ...Buttons
      }
    }
  }
`

const ProjectTemplate = ({ data }) => {
  return (
    <Layout title={data.markdownRemark.frontmatter.shortTitle}>
      <Background />
      <div className="background-top" />
      <article className="container">
        <ProjectHead
          {...omit(data.markdownRemark.frontmatter, ['shortTitle'])}
        />
        <div
          className="pt-4 pb-5 project-content"
          dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
        />
      </article>
    </Layout>
  )
}

export default ProjectTemplate

// ? -----------------
// ? Helper Components
// ? -----------------

function Background({ className, ...rest }) {
  return (
    <div
      className={classNames('background-top', className)}
      style={{
        backgroundImage: imgUrlFormat(backgroundSVG),
        backgroundPositionX: 'center',
        backgroundPositionY: '32px',
        backgroundSize: '2600px 750px',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        zIndex: 0,
        flexGrow: 0,
        width: '100%',
        height: '900px',
      }}
      {...rest}
    />
  )
}

function ProjectHead({ type, title, start, end, lead, topics, buttons }) {
  return (
    <div className="head">
      <h2 className="subhead">{type}</h2>
      <h1 className="title">{title}</h1>
      <Dates start={start} end={end} />
      <div className="lead-text" dangerouslySetInnerHTML={{ __html: lead }} />
      <Topics {...topics} />
      <ButtonBar buttons={buttons} />
    </div>
  )
}

function Dates({ start, end }) {
  return (
    <div className="d-flex flex-row flex-content-start dates">
      <DateComponent label="Start" content={start} />
      {!isNil(end) ? <DateComponent label="End" content={end} /> : ''}
    </div>
  )
}

function DateComponent({ label, content }) {
  return (
    <div>
      <p>{label}</p>
      <p>{content}</p>
    </div>
  )
}

function Topics({ main, secondary }) {
  return (
    <div className="topics">
      {main.map(mainTopic => (
        <Topic type="main" key={mainTopic}>
          {mainTopic}
        </Topic>
      ))}
      {secondary.map(secondaryTopic => (
        <Topic type="secondary" key={secondaryTopic}>
          {secondaryTopic}
        </Topic>
      ))}
    </div>
  )
}
