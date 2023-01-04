<template>
  <div id="canvas-container" ref="canvasContainer">
    <img :src="'./static/castle.png'" alt="Castle icon" style="display: none;" />
    <!-- Bind the height of the game canvas to the height of the container,
      and automatically update the height when the page resizes.
      Write code for Vue 2. -->
    <v-game-canvas :initialScale="1.65" :height="canvasHeight"></v-game-canvas>
  </div>
</template>

<script>
import GameCanvas from "./components/GameCanvas";

export default {
  components: {
    'v-game-canvas': GameCanvas,
  },
  data() {
    return {
      canvasHeight: 1,
    };
  },
  methods: {
    updateCanvasHeight() {
      this.canvasHeight = Math.max(this.$refs.canvasContainer.clientHeight, 1);
    },
  },
  mounted() {
    window.addEventListener('resize', this.updateCanvasHeight);
    this.updateCanvasHeight();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCanvasHeight);
  },
};
</script>

<style>
/* Quick CSS reset: */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  overflow: hidden;
  /* Same color as canvas background: */
  background-color: #1d2951;
}

#canvas-container {
  height: 100%;
}

.stage-wrapper {
  height: 100%;
}
</style>
