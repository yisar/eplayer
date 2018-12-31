class Danmuku {
  constructor(canvas, video, data) {
    this.canvas = canvas
    this.video = video
    this.context = canvas.getContext('2d')
    this.canvas.width = video.clientWidth
    this.canvas.height = video.clientHeight
    let defaultOpts = {
      color: '#fff',
      fontSize: 20,
      speed: 2,
      opcity: 0.3,
      data: []
    }
    Object.assign(this, defaultOpts, { data })

    this.pause = true
    this.danmuku = this.data.map(danmu => new Dnamu(danmu))

    this.render()
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.draw()
    if (!this.pause) {
      requestAnimationFrame(this.render.bind(this))
    }
  }

  draw() {
    let once = true
    let cTime = this.video.currentTime
    this.danmuku.forEach(danmu => {
      if (danmu.time >= cTime) {
        if (once) {
          danmu.init()
          once = false
        }
      }
    })
  }
}

function Danmu(danmu) {
  this.danmu = danmu
  this.value = danmu.value
  this.time = danmu.time
}
