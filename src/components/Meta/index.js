import React from 'react'
import Helmet from 'react-helmet'
import { get, isNil } from 'lodash'

const Meta = ({ siteMeta, title }) => {
  const siteTitle = get(siteMeta, 'title')
  title = !isNil(title) ? `${siteTitle} | ${title}` : siteTitle

  const description = get(siteMeta, 'description')
  const msTileColor = get(siteMeta, 'msTileColor')
  const maskIconColor = get(siteMeta, 'maskIconColor')

  return (
    <Helmet
      meta={[
        // Robots meta
        {
          name: 'robots',
          content: 'index, follow',
        },
        // Content type meta
        {
          'http-equiv': 'Content-Type',
          content: 'text/html; charset=UTF-8',
        },
        // Additional image meta
        {
          rel: 'icon',
          type: 'image/png',
          size: '32x32',
          href: '/img/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          size: '16x16',
          href: '/img/favicon-16x16.png',
        },
        {
          rel: 'mask-icon',
          color: maskIconColor,
          href: '/img/safari-pinned-tab.svg',
        },
        {
          name: 'msapplication-TileColor',
          content: msTileColor,
        },
        {
          name: 'msapplication-config',
          content: '/img/browserconfig.xml',
        },
        // Site-universal meta
        {
          property: 'og:image',
          content: '/img/thumbnail.png',
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          name: 'description',
          content: description,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary',
        },
        // Page specific meta
        {
          property: 'og:title',
          content: title,
        },
      ]}
      title={title}
    />
  )
}

export default Meta
