import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'

import Figure from 'components/Figure'

import './style.scss'
import { preloadImage, loadScript } from '../../../../../src/util'

const preloads = ['/projects/risk-game/demo/castle.png']
const scripts = [
  '/projects/risk-game/demo/app.d64af9e4.js',
  '/projects/risk-game/demo/chunk-vendors.6c484327.js',
]
const prefix = 'Risk Demo'
const log = message => console.log(`[${prefix}] ${message}`)

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { preloads: [], scripts: [] }
  }

  componentDidMount() {
    this.bootstrapAppSettings()
    this.setState({
      preloads: this.preloadImages(),
      scripts: this.loadScripts(),
    })
  }

  componentWillUnmount() {
    this.unloadScripts()
  }

  bootstrapAppSettings() {
    const { height, scale } = this.props
    window.appHeight = height
    window.appScaleFactor = scale
    log(`Mounted component with height ${height}px and scale ${scale}`)
  }

  preloadImages() {
    const preloadedImages = preloads.map(url => preloadImage(url))
    preloads.forEach(url => log(`Preloaded image at ${url}`))
    return preloadedImages
  }

  loadScripts() {
    const statusClosure = Object.assign(
      ...scripts.map(url => {
        return { [url]: false }
      })
    )
    const loadCallback = url => {
      return () => {
        statusClosure[url] = true
        log(`Loaded script at ${url}`)
        const unfinished = Object.values(statusClosure).includes(false)
        if (!unfinished) {
          log('Loaded all scripts')
        }
      }
    }
    return scripts.map(url => loadScript(url, loadCallback(url)))
  }

  unloadScripts() {
    this.state.scripts.forEach(script => {
      document.head.removeChild(script)
    })
    log(`Unloaded all scripts`)
    this.setState({ preloads: [], scripts: [] })
  }

  render() {
    const { label, className, height, ...rest } = this.props
    return (
      <Figure
        caption={label}
        style={{ width: '100%', maxWidth: 'none' }}
        className={classNames(className, 'risk-demo')}
        {...rest}
      >
        <Wrapper height={height}>
          <div id="app" />
        </Wrapper>
      </Figure>
    )
  }
}

export default Demo

// ? -----------------
// ? Helper Components
// ? -----------------

function Wrapper({ children, height, className, ...rest }) {
  const { previewBase64 } = dataHook()
  return (
    <div
      className={classNames('wrapper', className)}
      style={{
        height: `${height}px`,
        backgroundImage: `url('data:image/png;base64,${previewBase64}')`,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
