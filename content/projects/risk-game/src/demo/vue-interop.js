import React from 'react'
import { log } from './index'

import { VueWrapper } from 'vuera'

let GameCanvas
class VueInterop extends React.Component {
  constructor() {
    super()
    this.state = { mount: false }
  }

  componentDidMount() {
    if (this.props.preload) this.props.preload()
    GameCanvas = require('./vue/GameCanvas.vue').default
    this.setState({ mount: true })
    log('Loading Vue component, forcing re-render')
  }

  render() {
    const { preload, ...rest } = this.props
    if (GameCanvas !== undefined) {
      return (
        <VueWrapper component={GameCanvas} highlightColor="blue" {...rest} />
      )
    } else {
      return null
    }
  }
}

export default VueInterop
