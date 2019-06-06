import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'
import { renderIcons } from '../../util'

import SocialButton from '../SocialButton'

import './style.scss'

class ContactPopup extends React.Component {
  constructor(props) {
    super(props)
    this.closeButton = React.createRef()
    this.focusCloseButton = this.focusCloseButton.bind(this)
    this.escPressed = this.escPressed.bind(this)
  }

  escPressed(e) {
    if (e.keyCode === 27) {
      if (this.props.show) this.props.onClose()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escPressed, false)
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.escPressed, false)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) this.focusCloseButton()
  }

  focusCloseButton() {
    this.closeButton.current.focus()
  }

  render() {
    const { show, onClose, className, ...rest } = this.props
    return (
      <Wrapper className={classNames({ active: show }, className)} {...rest}>
        <span className="background-fill" onClick={onClose} />
        <button
          className={classNames('close-button', className)}
          aria-label="Close contact panel"
          onClick={onClose}
          ref={this.closeButton}
        >
          <span>×</span>
        </button>
        <div className="light-text contact shadow-sm">
          <ContactContent />
          <Side />
        </div>
      </Wrapper>
    )
  }
}

export default ContactPopup

// ? -----------------
// ? Helper Components
// ? -----------------

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

function ContactContent({ className, ...rest }) {
  const { content, buttons } = dataHook()
  return (
    <div className={classNames('content', className)} {...rest}>
      <div dangerouslySetInnerHTML={{ __html: renderIcons(content) }} />
      <div className="social-group">
        {buttons.map(btn => (
          <SocialButton key={btn.href} {...btn} />
        ))}
      </div>
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
