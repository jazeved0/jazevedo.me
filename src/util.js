import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Icon from 'components/Icon'
import { isNil } from 'lodash'

const externalRegex = /((http|https):\/\/(?!(?:www\.)?jazevedo.me)[\w./=?#-]+)/
export const isExternal = href => externalRegex.test(href)

const iconRegex = /:([A-Za-z-0-9]+)(?:_([a-zA-Z0-9-_ ]+))?:/g
export const renderIcons = rawHtmlInput =>
  isNil(rawHtmlInput)
    ? ''
    : rawHtmlInput.replace(iconRegex, (_match, g1, g2) => {
        const element = <Icon name={g1} className={g2} />
        return ReactDOMServer.renderToString(element)
      })
