<template>
  <v-image :config="config"></v-image>
</template>

<script>
import { log } from '../index'

const image = document.createElement('img')
const imgWidth = 28
const imgHeight = 28
const imageOnLoadCallbacks = new Set()
image.onload = () => {
  log('Image loaded, forcing redraw', 'Vue', 'CastleIcon')
  imageOnLoadCallbacks.forEach(callback => callback())
}
image.src = '/projects/risk-game/demo_castle.png'

const layerRefWrapper = {
  layerRef: null,
  needsRedraw: false,
}

export default {
  props: {
    x: Number,
    y: Number,
    onLoad: Function,
  },
  computed: {
    config: function() {
      const position = {
        a: this.x,
        b: this.y,
      }
      return {
        x: position.a - imgWidth / 4,
        y: position.b - imgHeight / 4,
        image: image,
        width: imgWidth,
        height: imgHeight,
        listening: false,
      }
    },
  },
  mounted() {
    imageOnLoadCallbacks.add(this.onLoad)
  },
}
</script>
