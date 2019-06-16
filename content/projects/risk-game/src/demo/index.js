import React from 'react'
import classNames from 'classnames'
import { dataHook } from './data-hook'
import { preloadImage } from '../../../../../src/util'

import Figure from 'components/Figure'
import VueInterop from './vue-interop'

import './style.scss'

const preloads = ['/projects/risk-game/demo_castle.png']
const prefix = 'Risk Demo'
const logBase = (message, prefixes) =>
  console.log(prefixes.map(p => `[${p}] `).join('') + message)
export const log = (message, ...prefixes) =>
  logBase(message, [prefix, ...prefixes])

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { preloads: [] }
    this.preload = this.preload.bind(this)
  }

  preload() {
    this.setState({
      preloads: this.preloadImages(),
    })
  }

  preloadImages() {
    const preloadedImages = preloads.map(url => preloadImage(url))
    preloads.forEach(url => log(`Preloaded image at ${url}`))
    return preloadedImages
  }

  render() {
    const { label, className, height, scale, ...rest } = this.props
    return (
      <Figure
        caption={label}
        style={{ width: '100%', maxWidth: 'none' }}
        className={classNames(className, 'risk-demo')}
        {...rest}
      >
        <Wrapper height={height}>
          <div id="app">
            <VueInterop
              preload={this.preload}
              initialScale={scale}
              height={height}
            />
          </div>
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
