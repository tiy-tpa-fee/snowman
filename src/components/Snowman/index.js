import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import spine from './spine'

const snowman = {
  atlas: require('file!./Spine.atlas'),
  json: require('!file!./Spine.json'),
  png: require('./Spine.png')
}

class Snowman extends Component {

  static propTypes = {
    size: React.PropTypes.number,
    step: React.PropTypes.number
  }

  static defaultProps = {
    step: 1,
    size: window.innerWidth / 2
  }

  componentDidMount () {
    const config = { alpha: false }
    const canvas = ReactDOM.findDOMNode(this)
    canvas.width = this.props.size
    canvas.height = this.props.size
    const gl = canvas.getContext('webgl', config) ||
               canvas.getContext('experimental-webgl', config)
    const mvp = new spine.webgl.Matrix4()
    const shader = spine.webgl.Shader.newColoredTextured(gl)
    const batcher = new spine.webgl.PolygonBatcher(gl)
    const skeletonRenderer = new spine.webgl.SkeletonRenderer(gl)
    const assetManager = new spine.webgl.AssetManager(gl)
    assetManager.loadText(snowman.json)
    assetManager.loadText(snowman.atlas)
    assetManager.loadTexture(snowman.png)
    this.gl = gl
    this.mvp = mvp
    this.shader = shader
    this.batcher = batcher
    this.skeletonRenderer = skeletonRenderer
    this.assetManager = assetManager
    this.lastFrameTime = Date.now() / 1000
    window.requestAnimationFrame(this.load)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.size !== this.props.size) this.resize(nextProps.size)
    if (nextProps.step !== this.props.step) this.stepTo(nextProps.step, this.props.step)
  }

  load = () => {
    if (this.assetManager.isLoadingComplete()) {
      const atlas = new spine.TextureAtlas(this.assetManager.get(snowman.atlas), () => this.assetManager.get(snowman.png))
      const atlasLoader = new spine.AtlasAttachmentLoader(atlas)
      const skeletonJson = new spine.SkeletonJson(atlasLoader)
      const skeletonData = skeletonJson.readSkeletonData(this.assetManager.get(snowman.json))
      const skeleton = new spine.Skeleton(skeletonData)
      skeleton.setToSetupPose()
      skeleton.updateWorldTransform()
      const offset = new spine.Vector2()
      const size = new spine.Vector2()
      skeleton.getBounds(offset, size)
      const bounds = { offset, size }
      const animationStateData = new spine.AnimationStateData(skeleton.data)
      const animationState = new spine.AnimationState(animationStateData)
      animationState.setAnimation(0, 'idle', true)
      animationState.setAnimation(1, 'build-1-in', false)
      this.animation = { skeleton: skeleton, state: animationState, bounds: bounds }
      this.resize(this.props.size)
      window.requestAnimationFrame(this.animate)
    } else {
      window.requestAnimationFrame(this.load)
    }
  }

  animate = () => {
    const now = Date.now() / 1000
    const delta = now - this.lastFrameTime
    this.lastFrameTime = now
    this.gl.clearColor(1, 1, 1, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    const state = this.animation.state
    const skeleton = this.animation.skeleton
    state.update(delta)
    state.apply(skeleton)
    skeleton.updateWorldTransform()
    this.shader.bind()
    this.shader.setUniformi(spine.webgl.Shader.SAMPLER, 0)
    this.shader.setUniform4x4f(spine.webgl.Shader.MVP_MATRIX, this.mvp.values)
    this.batcher.begin(this.shader)
    this.skeletonRenderer.premultipliedAlpha = false // TODO: Needed?
    this.skeletonRenderer.draw(this.batcher, skeleton)
    this.batcher.end()
    this.shader.unbind()
    window.requestAnimationFrame(this.animate)
  }

  resize (size) {
    const canvas = ReactDOM.findDOMNode(this)
    canvas.width = size
    canvas.height = size
    const bounds = this.animation.bounds
    const centerX = bounds.offset.x + bounds.size.x / 2
    const centerY = bounds.offset.y + bounds.size.y / 2
    const scaleX = bounds.size.x / size
    const scaleY = bounds.size.y / size
    let scale = Math.max(scaleX, scaleY) * 1.2
    if (scale < 1) scale = 1
    const width = size * scale
    const height = size * scale
    this.mvp.ortho2d(centerX - width / 2, centerY - height / 2, width, height)
    this.gl.viewport(0, 0, size, size)
  }

  stepTo (to, from) {
    console.log(from, to)
    if (this.animation && this.animation.state) {
      if (to > from) {
        _.rangeRight(to, from, -1).forEach((step) => {
          if (step === 7) {
            this.animation.state.addAnimation(1, 'cheer', true, 0)
          } else {
            this.animation.state.addAnimation(1, `build-${step + 1}-in`, false, 0)
          }
        })
      } else {
        _.range(from, to, -1).forEach((step) => {
          if (step !== 7) {
            console.log(`build-${step + 1}-out`)
            this.animation.state.addAnimation(1, `build-${step + 1}-out`, false, 0)
          }
        })
      }
    }
  }

  render () {
    return <canvas ref='canvas' style={{ backgroundColor: 'red' }} width={this.props.size} height={this.props.size} />
  }
}

export default Snowman
