import React from 'react'
import classNames from 'classnames'

const Figure = ({ children, caption, sharp, left, className, ...rest }) => {
  return (
    <figure
      className={classNames(className, 'figure', {
        'gatsby-resp-image-figure': sharp,
        left,
      })}
      {...rest}
    >
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

export default Figure
