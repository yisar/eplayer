class Danmu {
  constructor(canvas, video, data) {
    this.canvas = canvas
    this.video = video
    this.context = canvas.getContext('2d')
    this.context.width=video.clientWidth
    this.context.height=video.clientHeight
    let defaultOpts = {
      color: '#fff',
      fontSize: 20,
      speed: 2,
      opcity: 0.3,
      data: []
    }
    Object.assign(this, defaultOpts, { data })

    this.pause = true
    this.danmuku = this.data
    
    this.render()
  }

  render(){

  }
}
