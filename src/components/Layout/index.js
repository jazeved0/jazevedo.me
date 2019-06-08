import React from 'react'

import Nav from 'components/Nav'

import 'scss/base.scss'

class Layout extends React.Component {
  render() {
    const { children, className, ...rest } = this.props
    return (
      <div className={className}>
        <Nav {...rest} />
        {children}
      </div>
    )
  }
}

export default Layout
