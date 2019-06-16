import React from 'react'
import { VueWrapper } from 'vuera'

let GameCanvas

export default class VueInterop extends React.Component {
  constructor () {
    super()
    this.state = { mount : false }
  }
  componentDidMount () {
    GameCanvas = require("./GameCanvas.vue");
    this.setState( { mount : true });
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
