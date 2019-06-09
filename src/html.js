import React from 'react'
import PropTypes from 'prop-types'

import { Navbar } from 'react-bootstrap'
import Icon from 'components/Icon'

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        {/* Custom no-script content */}
        <noscript>
          <Navbar bg="primary" className="noscript-alert">
            <div className="container py-1">
              <span
                className="mr-3"
                style={{ fontSize: '1.5rem', marginTop: '-8px' }}
              >
                <Icon name="info-circle" />{' '}
              </span>
              This website works better with javascript enabled
            </div>
          </Navbar>
        </noscript>
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
