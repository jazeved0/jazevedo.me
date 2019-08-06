import React from 'react'
import { graphql } from 'gatsby'
import { omit, isNil } from 'lodash'
import classNames from 'classnames'
import { imgUrlFormat } from '../../util'
import scope from '../../mdx-scope'

import Layout from 'components/Layout'
import ButtonBar from 'components/ButtonBar'
import Topic from 'components/Topic'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { MDXProvider } from '@mdx-js/react'

import './style.scss'
import backgroundSVG from '../../../static/img/project-background.svg'

export const pageQuery = graphql`
  fragment PageData on Frontmatter {
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
    buttons {
      ...Buttons
    }
  }

  query($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        ...PageData
      }
      body
    }
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        ...PageData
      }
    }
  }
`

const ProjectPageTemplate = ({ data, pageContext }) => {
  const { isMdx, isAuxillary: isAux } = pageContext
  const frontmatter = (isMdx ? data.mdx : data.markdownRemark).frontmatter
  const content = isMdx ? data.mdx.body : data.markdownRemark.html
  console.log({ frontmatter, content, pageContext, data })

  return (
    <Layout title={frontmatter.shortTitle}>
      {!isAux ? <Background /> : null}
      <article className="container">
        {!isAux ? <ProjectHead {...omit(frontmatter, ['shortTitle'])} /> : null}
        <ProjectContent {...{ content, isMdx, isAux }} />
      </article>
    </Layout>
  )
}

export default ProjectPageTemplate

// ? -----------------
// ? Helper Components
// ? -----------------

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

function ProjectContent({ content, isMdx, isAux }) {
  return content == null || content.trim() === '' ? (
    <div className="project-content">
      <hr className="short mt-0" />
    </div>
  ) : (
    <div className={classNames('project-content', { 'pt-4': !isAux })}>
      <ContentRenderer {...{ content, isMdx }} />
      <hr className="short" />
    </div>
  )
}

function ContentRenderer({ content, isMdx }) {
  return isMdx ? (
    <MDXProvider components={{ ...scope }}>
      <MDXRenderer children={content} />
    </MDXProvider>
  ) : (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )
}

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

function Dates({ start, end }) {
  return (
    <div className="d-flex flex-row flex-content-start dates">
      <DateComponent label="Start" content={start} />
      {!isNil(end) ? <DateComponent label="End" content={end} /> : null}
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
