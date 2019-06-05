import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'
import { renderIcons } from '../../util'

import SocialButton from '../SocialButton'

import './style.scss'

function ContactPopup({ show, onClose, className, ...rest }) {
  const { content, buttons } = dataHook()

  return (
    <Wrapper className={classNames({ active: show }, className)} {...rest}>
      <span className="background-fill" onClick={onClose} />
      <CloseButton onClick={onClose} />
      <div className="light-text contact shadow-sm">
        <div className="content">
          <div dangerouslySetInnerHTML={{ __html: renderIcons(content) }} />
          <div className="social-group">
            {buttons.map(btn => (
              <SocialButton key={btn.href} {...btn} />
            ))}
          </div>
        </div>
        <Side />
      </div>
    </Wrapper>
  )
}

export default ContactPopup

// ? -----------------
// ? Helper Components
// ? -----------------

function CloseButton({ onClick, className, ...rest }) {
  return (
    <button
      className={classNames('close-button', className)}
      aria-label="Close contact panel"
      onClick={onClick}
      {...rest}
    >
      <span>×</span>
    </button>
  )
}

function Wrapper({ children, className, ...rest }) {
  return (
    <div
      className={classNames('contact-wrapper', className)}
      style={{ visibility: 'hidden' }}
      {...rest}
    >
      {children}
    </div>
  )
}

function Side({ className, ...rest }) {
  return (
    <div className={classNames('side', className)} {...rest}>
      <div className="stripes-bg fill-container">
        <span />
      </div>
    </div>
  )
}
