import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'
import { isNil } from 'lodash'

import ButtonBar from 'components/ButtonBar/index'

import './style.scss'

const Footer = ({ className }) => {
  const { html, buttons, left, right } = dataHook()

  return (
    <div className={classNames(className, 'footer')}>
      <div className="inner">
        <FooterTextColumn text={left} />
        <FooterColumn content={html} />
        <FooterTextColumn text={right} className="made-with">
          <ButtonBar buttons={buttons} />
        </FooterTextColumn>
      </div>
    </div>
  )
}

export default Footer

// ? -----------------
// ? Helper Components
// ? -----------------

const FooterColumn = ({ content, contentControl, children, ...rest }) => {
  if (isNil(contentControl)) contentControl = content
  return contentControl.toString().trim() !== '' ? (
    <div {...rest}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <div>{children}</div>
    </div>
  ) : (
    <div {...rest}>
      <div>{children}</div>
    </div>
  )
}

const FooterTextColumn = ({ text, children, ...rest }) => {
  return (
    <FooterColumn contentControl={text} {...rest}>
      <span>{text}</span>
      {children}
    </FooterColumn>
  )
}
