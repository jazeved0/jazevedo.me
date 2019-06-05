import React from 'react'
import classNames from 'classnames'

import Icon from 'components/Icon/index'

import './style.scss'

class SocialButton extends React.Component {
  render() {
    const { href, icon, className, ...rest } = this.props

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={classNames('social-button', className)}
        {...rest}
      >
        <Icon name={icon} />
      </a>
    )
  }
}

export default SocialButton
