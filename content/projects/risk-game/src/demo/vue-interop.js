import React from 'react'
import { log } from './util'

import { VueWrapper } from 'vuera'

let GameCanvas
class VueInterop extends React.Component {
  constructor () {
    super()
    this.state = { mount : false }
  }

  componentDidMount () {
    GameCanvas = require("./GameCanvas.vue").default
    this.setState( { mount : true });
    log('Loading Vue component, forcing re-render')
  }

  render () {
    if (GameCanvas !== undefined ) {
      return (
        <VueWrapper component={GameCanvas} />
      )
    } else {
      return (
        null
      )
    }
  }
}

export default VueInterop
