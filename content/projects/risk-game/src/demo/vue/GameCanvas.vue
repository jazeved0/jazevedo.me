<template>
  <div class="stage-wrapper" ref="stageWrapper" @contextmenu.prevent="void 0">
    <v-stage :config="stageConfig" ref="stage" class="stage" @mousedown="handleMouseDown">
      <v-layer>
        <v-rect
          :config="{
          x: -50000,
          y: -50000,
          width: 100000,
          height: 100000,
          fill: '#1d2951'}"
        ></v-rect>
        <v-line
          v-for="waterConnection in waterConnectionConfigs"
          :key="waterConnection.num"
          :config="waterConnection"
        ></v-line>
      </v-layer>
      <v-layer>
        <v-territory
          v-for="(territory, index) in territoryData"
          :key="index"
          :castle="territory.castle"
          :highlight="territory.highlight"
          :baseColor="territory.baseColor"
          :path="territory.path"
          @territory-click-raw="left => handleTerritoryMouseUp(index, left)"
        ></v-territory>
      </v-layer>
      <v-layer ref="castleLayer">
        <v-castle-icon
          v-for="castle in castleData"
          v-bind="castle"
          :key="castle.num"
          :onLoad="handleCastleIconLoad"
        ></v-castle-icon>
        <v-army-shape v-for="army in armyData" v-bind="army" :key="army.num"></v-army-shape>
      </v-layer>
    </v-stage>
    <div class="stage-fill"></div>
  </div>
</template>

<script>
import { clamp, distance, exists, logError } from './util'
import { log } from '../index'
import dataFile from './data'

// Components
import ArmyShape from './ArmyShape'
import CastleIcon from './CastleIcon'

// hook Konva
import VueKonva from 'vue-konva'
import Vue from 'vue'
import Territory from './Territory'
Vue.use(VueKonva)

export default {
  props: {
    // Initial scale (optional)
    initialScale: Number,
    // Stage height (optional)
    height: Number,
  },

  components: {
    'v-army-shape': ArmyShape,
    'v-territory': Territory,
    'v-castle-icon': CastleIcon,
  },

  data() {
    return {
      // DOM object for the stage, gotten through refs upon mount
      stageObj: undefined,
      // Current stage dimensions updated upon resize
      stageDimensions: {
        w: 400,
        h: this.height,
      },
      // Current touch state (unused if on desktop)
      touchState: {
        lastDist: 0,
        point: undefined,
      },
      // Current scale bounds (may be updated upon initialization as appropriate)
      scaleBounds: {
        min: 0.8,
        max: 5,
      },
      // Current index of territory with mouse over
      mouseOver: -1,
      armyData: dataFile.armyData,
      // Last click location
      mouseDownLoc: {
        x: 0,
        y: 0,
      },
    }
  },

  computed: {
    // Configuration objects for the stage
    stageConfig() {
      return {
        // Depend on dimensions changed upon resize
        width: this.stageDimensions.w,
        height: this.stageDimensions.h,
        draggable: true,
        // Clamp dragging
        dragBoundFunc: pos => this.clampPosition(pos),
      }
    },

    // *****************
    // Rendering configs
    // *****************

    // Creates array of territory data
    territoryData() {
      return dataFile.territoryData
    },

    // Config data for water connection paths
    waterConnectionConfigs() {
      return dataFile.waterConnectionConfigs
    },

    // Rendering data for each castle
    castleData() {
      return dataFile.castleData
    },

    // Gets the size of the gameboard from the store
    gameboardSize() {
      return dataFile.gameboardSize
    },
  },

  methods: {
    // ***************
    // Utility methods
    // ***************

    // Calculates the initial position & scale of the map in the viewport
    calculateInitialTransform() {
      const bounds = this.stageDimensions
      const totalW = bounds.w
      const totalH = bounds.h
      const size = this.gameboardSize

      let k
      if (exists(this.initialScale)) {
        // use passed in initial scale
        k = this.initialScale
        log(`Using non-default scale ${k.toFixed(2)}`, 'Vue')
      } else {
        // make initial map take up 3/4 of smaller dimension
        const margin = Math.min(totalW, totalH) / 8
        const kw = (totalW - 2 * margin) / size.a
        const kh = (totalH - 2 * margin) / size.b
        k = Math.min(kw, kh)
        log(`Calculating default fit scale ${k.toFixed(2)}`, 'Vue')
      }
      return {
        x: (totalW - size.a * k) / 2,
        y: (totalH - size.b * k) / 2,
        scale: k,
      }
    },

    // Translates the pointer mouse pointer minus the stage offset
    relativePointer(clientX, clientY, stage) {
      return {
        x: clientX - stage.getContent().offsetLeft,
        y: clientY - stage.getContent().offsetTop,
      }
    },

    // Clamps the scale according to the current bounds
    clampScale(scale) {
      return clamp(scale, this.scaleBounds.min, this.scaleBounds.max)
    },

    // Clamps the position according to newly calculated position bounds
    clampPosition(pos) {
      const bounds = this.calculatePositionBounds()
      return {
        x: clamp(pos.x, bounds.x.min, bounds.x.max),
        y: clamp(pos.y, bounds.y.min, bounds.y.max),
      }
    },

    // Calculates the position bounds according to the current scale & dimensions
    calculatePositionBounds() {
      if (exists(this.stageObj)) {
        const scale = this.stageObj.scale()
        const bounds = this.stageDimensions
        const size = this.gameboardSize
        return {
          x: this.axisBounds(size.a * scale.x, bounds.w),
          y: this.axisBounds(size.b * scale.y, bounds.h),
        }
      } else {
        logError('StageObj or Gameboard are undefined. Ignoring')
        // default value
        return {
          x: {
            min: 0,
            max: 1,
          },
          y: {
            min: 0,
            max: 1,
          },
        }
      }
    },

    // Applies bounds, wrapping as necessary
    axisBounds(size, bound) {
      return size < bound
        ? {
            min: -(size / 2),
            max: bound - size / 2,
          }
        : {
            min: bound / 2 - size,
            max: bound / 2,
          }
    },

    // ***************
    // Event listeners
    // ***************

    // Handles castle icon loading
    handleCastleIconLoad() {
      if (exists(this.$refs) && exists(this.$refs.castleLayer)) {
        this.$refs.castleLayer.getStage().batchDraw()
        log('Calling batch draw on castle layer', 'Vue', 'GameCanvas')
      } else {
        logError('StageWrapper not found. Skipping icon-driven redraw')
      }
    },

    // Handles territory clicks
    handleTerritoryMouseUp(index, left) {
      if (exists(this.stageObj)) {
        const mousePos = this.stageObj.getPointerPosition()
        const distSquared =
          (mousePos.x - this.mouseDownLoc.x) ** 2 +
          (mousePos.y - this.mouseDownLoc.y) ** 2
        if (distSquared > 144) return
        if (left) {
          ++this.armyData[index].size
        } else if (this.armyData[index].size > 0) {
          --this.armyData[index].size
        }
      } else {
        logError('Stage object not found. Skipping mouse up event')
      }
    },

    // Handle stage mouse down
    handleMouseDown() {
      if (exists(this.stageObj)) {
        this.mouseDownLoc = this.stageObj.getPointerPosition()
      } else {
        logError('Stage object not found. Skipping mouse down event')
      }
    },

    // Handles resize events
    handleResize() {
      if (exists(this.$refs) && exists(this.$refs.stageWrapper)) {
        this.stageDimensions = {
          w: this.$refs.stageWrapper.clientWidth,
          h: this.$refs.stageWrapper.clientHeight,
        }
      } else {
        logError('StageWrapper not found. Skipping resize event')
      }
    },

    // Handles scroll wheel input (event callback)
    handleScroll(event) {
      const stage = this.stageObj
      if (exists(stage)) {
        event.preventDefault()
        const oldScale = stage.scaleX()

        const pointer = stage.getPointerPosition()
        const startPos = {
          x: pointer.x / oldScale - stage.x() / oldScale,
          y: pointer.y / oldScale - stage.y() / oldScale,
        }

        let deltaYBounded = 0
        if (!(event.deltaY % 1)) {
          deltaYBounded = Math.abs(Math.min(-10, Math.max(10, event.deltaY)))
        } else {
          // noinspection JSSuspiciousNameCombination
          deltaYBounded = Math.abs(event.deltaY)
        }
        const scaleBy = 1.01 + deltaYBounded / 70
        let newScale = 0
        if (event.deltaY > 0) {
          newScale = oldScale / scaleBy
        } else {
          newScale = oldScale * scaleBy
        }
        newScale = this.clampScale(newScale)
        stage.scale({ x: newScale, y: newScale })

        const newPosition = {
          x: (pointer.x / newScale - startPos.x) * newScale,
          y: (pointer.y / newScale - startPos.y) * newScale,
        }
        stage.position(this.clampPosition(newPosition))
        stage.batchDraw()
      } else {
        logError('StageObj not found. Scroll events will not work')
      }
    },

    // Handles touch move input (event callback)
    handleTouchMove(event) {
      const t1 = event.touches[0]
      const t2 = event.touches[1]
      if (t1 && t2) {
        event.preventDefault()
        event.stopPropagation()
        const stage = this.stageObj
        const touchState = this.touchState
        if (exists(stage)) {
          const oldScale = stage.scaleX()
          const dist = distance(
            { x: t1.clientX, y: t1.clientY },
            { x: t2.clientX, y: t2.clientY }
          )
          if (!touchState.lastDist) touchState.lastDist = dist
          const delta = dist - touchState.lastDist
          const px = (t1.clientX + t2.clientX) / 2
          const py = (t1.clientY + t2.clientY) / 2
          let pointer = {}
          if (typeof touchState.point === 'undefined') {
            pointer = this.relativePointer(px, py, stage)
            touchState.point = pointer
          } else {
            pointer = touchState.point
          }
          const startPos = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
          }
          const scaleBy = 1.01 + Math.abs(delta) / 100
          const newScale = this.clampScale(
            delta < 0 ? oldScale / scaleBy : oldScale * scaleBy
          )
          stage.scale({ x: newScale, y: newScale })
          const newPosition = {
            x: (pointer.x / newScale - startPos.x) * newScale,
            y: (pointer.y / newScale - startPos.y) * newScale,
          }
          stage.position(this.clampPosition(newPosition))
          stage.batchDraw()
          // Update touch state
          touchState.lastDist = dist
        } else {
          logError('StageObj not found. Touch events will not work')
        }
      }
    },

    // Handles touch end input (event callback)
    handleTouchEnd() {
      // Reset touch state
      this.touchState.lastDist = 0
      this.touchState.point = undefined
    },

    // Handles mouse down on the document node (event callback)
    handleDocumentMouseDown(e) {
      if (e.button !== 0) this.stageObj.draggable(false)
    },

    // Handles mouse up on the document node (event callback)
    handleDocumentMouseUp(e) {
      this.stageObj.draggable(true)
    },

    // Attach event listeners upon mounting
    attachEventListeners(stageRef) {
      window.addEventListener('resize', this.handleResize)
      document.addEventListener('mousedown', this.handleDocumentMouseDown)
      document.addEventListener('mouseup', this.handleDocumentMouseUp)
      // attach events to the stage
      if (exists(stageRef)) {
        stageRef.addEventListener('wheel', this.handleScroll)
        stageRef.addEventListener('touchmove', this.handleTouchMove)
        stageRef.addEventListener('touchend', this.handleTouchEnd)
      } else {
        logError('StageRef not found. Canvas events will not work')
      }
    },

    // Detach any event listeners upon being destroyed
    detachEventListeners(stageRef) {
      window.removeEventListener('resize', this.handleResize)
      document.removeEventListener('mousedown', this.handleDocumentMouseDown)
      document.removeEventListener('mouseup', this.handleDocumentMouseUp)
      if (exists(stageRef)) {
        stageRef.removeEventListener('wheel', this.handleScroll)
        stageRef.removeEventListener('touchmove', this.handleTouchMove)
        stageRef.removeEventListener('touchend', this.handleTouchEnd)
      }
    },

    // *********************
    // Async synchronization
    // *********************

    // Attempts to unlock the GUI side of the async initialization lock
    unlockInitialization() {
      this.initializeTransforms()
    },

    // Initializes transforms once information from the server is loaded
    initializeTransforms() {
      const dims = {
        w: this.$refs.stageWrapper.clientWidth,
        h: this.$refs.stageWrapper.clientHeight,
      }
      log(
        `Loaded stage dimensions from globals: { w: ${dims.w}, h: ${dims.h} }`,
        'Vue'
      )
      const stage = this.stageObj
      const initialTransform = this.calculateInitialTransform()
      const scaleBounds = this.scaleBounds
      if (exists(stage)) {
        // Scale
        stage.scale({
          x: initialTransform.scale,
          y: initialTransform.scale,
        })
        // Translate
        stage.x(initialTransform.x)
        stage.y(initialTransform.y)
        // Update scale bounds
        scaleBounds.min = Math.min(scaleBounds.min, initialTransform.scale)
        scaleBounds.max = Math.max(scaleBounds.max, initialTransform.scale)
      } else {
        logError('StageObj not found. Canvas will not be positioned')
      }
    },
  },

  // Mounted lifecycle hook
  mounted() {
    this.$nextTick(function() {
      // initialize canvas dimensions
      this.handleResize()
      if (exists(this.$refs.stage)) {
        // load the stageObj
        this.stageObj = this.$refs.stage.getStage()
        this.attachEventListeners(this.stageObj.getContent())
        this.unlockInitialization()
      }
    })
  },

  // Destruction lifecycle hook
  beforeDestroy() {
    this.detachEventListeners(this.stageObj.getContent())
  },
}
</script>
