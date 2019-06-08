import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'
import { isNil } from 'lodash'

import ContactPopup from '../ContactPopup'
import LinkBar from '../LinkBar'
import { Link } from 'gatsby'
import { Navbar } from 'react-bootstrap'

import './style.scss'

class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showPopup: false }
    this.showPopup = this.showPopup.bind(this)
    this.hidePopup = this.hidePopup.bind(this)
  }

  showPopup() {
    this.setState({
      showPopup: true,
    })
  }

  hidePopup() {
    this.setState({
      showPopup: false,
    })
  }

  render() {
    const { custom, className } = this.props
    const wrapperClass = classNames('navbar-outer', className, {
      'custom-layout': custom,
    })

    return (
      <div className={wrapperClass}>
        <NavLayout custom={custom}>
          <HomeButton height={22} />
          <Navbar.Toggle aria-controls="collapse-links" />
          <Navbar.Collapse id="collapse-links">
            <NavLinks />
            <ContactButton id="btn-contact" onClick={this.showPopup} />
          </Navbar.Collapse>
        </NavLayout>
        <ContactPopup show={this.state.showPopup} onClose={this.hidePopup} />
      </div>
    )
  }
}

export default Nav

// ? -----------------
// ? Helper Components
// ? -----------------

function NavLayout({ children, custom, navClassName, ...rest }) {
  return (
    <Navbar
      className={navClassName}
      expand="md"
      bg="tertiary"
      variant="dark"
      collapseOnSelect
      {...rest}
    >
      <div className={custom ? 'nav-container' : 'container'}>
        {custom ? <div className="inner">{children}</div> : children}
      </div>
    </Navbar>
  )
}

function NavLinks({ props }) {
  const links = dataHook()
  return (
    <LinkBar
      links={links}
      ulClass="navbar-nav nav-padding"
      liClass="nav-item"
      linkClass="nav-link"
      iconClass="d-inline-block d-md-none d-lg-inline-block"
      {...props}
    />
  )
}

function HomeButton({ height, className, ...rest }) {
  return (
    <Link
      className={classNames('navbar-brand nav-padding', className)}
      to="/"
      aria-label="Homepage"
      {...rest}
    >
      <img
        className="brand-img"
        src="/img/brand.svg"
        height={height}
        alt="jazevedo"
      />
    </Link>
  )
}

function ContactButton({ className, onClick, ...rest }) {
  return (
    <button
      type="button"
      onClick={e => {
        e.preventDefault()
        onClick()
      }}
      className={classNames('btn btn-outline-light', className)}
      {...rest}
    >
      Contact
    </button>
  )
}
