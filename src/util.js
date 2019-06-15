import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Icon from 'components/Icon'
import { isNil } from 'lodash'

const externalRegex = /^(?:http|https):\/\/(?!(?:www\.)?jazevedo.me)[\w./=?#-_]+$/
export const isExternal = href => externalRegex.test(href)

const fileRegex = /^[\w./=:?#-]+[.]\w+$/
export const isFile = href => fileRegex.test(href)

const iconRegex = /:([A-Za-z-0-9]+)(?:_([a-zA-Z0-9-_ ]+))?:/g
export const renderIcons = rawHtmlInput =>
  isNil(rawHtmlInput)
    ? ''
    : rawHtmlInput.replace(iconRegex, (_match, g1, g2) => {
        const element = <Icon name={g1} className={g2} />
        return ReactDOMServer.renderToString(element)
      })

export const imgUrlFormat = img => `url(${img})`

export const preloadImage = url => {
  var img = new Image()
  img.src = url
  return img
}

export const loadScript = (url, callback) => {
  var script = document.createElement('script')
  script.onload = callback(url)
  script.src = url
  document.head.appendChild(script)
  return script
}
