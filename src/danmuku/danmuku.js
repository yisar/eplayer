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
    this.danmuku = this.data.map(danmu => new Dnamu(danmu, this))

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

function Danmu(danmu, vm) {
  this.danmu = danmu
  this.value = danmu.value
  this.time = danmu.time
  this.vm = vm
  this.init = () => {
    this.opcity = this.danmu.opcity || vm.opcity
    this.color = this.danmu.color || vm.color
    this.fontSize = this.danmu.fontSize || vm.fontSize

    let span = document.createElement('span')
    span.innerText = this.value
    span.style.font = this.fontSize + 'px "微软雅黑"'
    span.style.position = 'absolute'
    document.body.appendChild(span)
    this.width = span.clientWidth
    document.body.removeChild(span)

    this.x = this.ctx.canvas.width
    this.y = this.ctx.canvas.height * Math.random()

    if (this.y < this.fontSize) this.y = this.fontSize
    if (this.y > this.ctx.canvas.height - this.fontSize)
      this.y = this.ctx.canvas.height - this.fontSize
  }
}
