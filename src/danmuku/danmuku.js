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

    this.paused = true
    this.danmuku = this.data.map(danmu => new Danmu(danmu, this))

    this.render()
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.draw()
    if (!this.paused) {
      requestAnimationFrame(this.render.bind(this))
    }
  }

  draw() {
    let cTime = this.video.currentTime
    this.danmuku.forEach(danmu => {
      if (!danmu.flag && danmu.time <= cTime) {
        if (!danmu.once) {
          danmu.init()
          danmu.oy = danmu.y
          danmu.once = true
        }
        danmu.x -= danmu.speed
        danmu.render()
        if (danmu.x <= danmu.width * -1) {
          danmu.flag = true
        }
      }
    })
  }

  add(danmu) {
    this.danmuku.push(new Danmu(danmu, this))
  }

  play() {
    this.paused = false
    this.render()
  }

  pause() {
    this.paused = true
  }

  reset() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let cTime = this.video.currentTime
    this.danmuku.forEach(danmu => {
      danmu.flag = false
      if (cTime < danmu.time) {
        danmu.paused = false
      } else {
        danmu.flag = true
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
    this.speed = this.danmu.speed || vm.speed

    let span = document.createElement('span')
    span.innerText = this.value
    span.style.font = this.fontSize + 'px "微软雅黑"'
    span.style.position = 'absolute'
    document.body.appendChild(span)
    this.width = span.clientWidth
    document.body.removeChild(span)

    this.x = this.vm.canvas.width
    let r = this.vm.canvas.height * Math.random()
    this.y = r - (r % this.fontSize)

    if (this.y < this.fontSize) this.y = this.fontSize
    if (this.y > this.vm.canvas.height - this.fontSize)
      this.y = this.vm.canvas.height - this.fontSize
  }

  this.render = () => {
    this.vm.context.font = this.fontSize + 'px "微软雅黑"'
    this.vm.context.fillStyle = this.color
    this.vm.context.fillText(this.value, this.x, this.y)
  }
}
