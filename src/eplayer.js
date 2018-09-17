import { Init } from './init'
import { Hls } from './hls'
import { getTimeStr, isFullScreen, copyright, isSafari } from './util'

const OFFSETDOT = 18
copyright()

class Eplayer {
  constructor(el, data) {
    this.el = el
    this.data = data
    this.height = el.clientHeight
    this.width = el.clientWidth

    new Init(this.el, this.data)

    this.video = document.querySelector('#player video')
    this.loading = document.querySelector('#player .loading')
    this.isPlay = document.querySelector('#player .switch')
    this.panel = document.querySelector('#player .panel')
    this.totalTime = document.querySelector('#player .total')
    this.currentTime = document.querySelector('#player .current')
    this.dot = document.querySelector('#player .progress-bar .dot')
    this.vdot = document.querySelector('#player .volume .dot')
    this.full = document.querySelector('#player .full')
    this.progress = document.querySelector('#player .progress')
    this.currentProgress = document.querySelector('#player .current-progress')
    this.currentVolumeProgress = document.querySelector(
      '#player .volume .current-progress'
    )
    this.volumeBtn = document.querySelector('#player .volume-button')
    this.controls = document.querySelector('#player .controls')
    this.buffer = document.querySelector('#player .buffer')
    this.volumeProgress = document.querySelector('#player .volume-progress')

    if (data.hls) {
      new Hls(this.video, this.data)
    }

    if (isSafari()) {
      this.loading.style.display = 'none'
      this.panel.style.display = 'block'
    }

    this.tTime = 0
    this.x = 0
    this.l = 0
    this.nl = 0
    this.nx = 0
    this.vx = 0
    this.vl = 0
    this.vnl = 0
    this.vnx = 0
    this.bufferEnd = 0
    this.isDown = false

    this.video.onwaiting = () => this.waiting()
    this.video.oncanplay = () => this.canplay()
    this.isPlay.onclick = () => this.play()
    this.panel.onclick = () => this.play()
    this.video.ontimeupdate = () => this.timeupdate()
    this.progress.onclick = this.currentProgress.onclick = this.buffer.onclick = e =>
      this.progressClick(e)
    this.volumeProgress.onclick = this.currentVolumeProgress.onclick = e =>
      this.volumeClick(e)
    this.video.onended = () => this.ended()
    this.full.onclick = () => this.fullScreen()
    this.dot.onmousedown = e => this.Dotonmousedown(e)
    this.dot.onmousemove = e => this.Dotonmousemove(e)
    this.dot.onmouseup = e => this.Dotonmouseup(e)
    this.vdot.onmousedown = e => this.Volumeonmousedown(e)
    this.vdot.onmousemove = e => this.Volumeonmousemove(e)
    this.vdot.onmouseup = e => this.Volumeonmouseup(e)
    this.volumeBtn.onclick = () => this.isVolume()
  }

  waiting() {
    this.loading.style.display = 'block'
  }

  canplay() {
    this.tTime = this.video.duration
    this.loading.style.display = 'none'
    this.panel.style.display = 'block'
    let tTimeStr = getTimeStr(this.tTime)
    this.totalTime.innerHTML = tTimeStr
    let vWidth = this.volumeProgress.clientWidth
    this.video.volume = 0.7
    this.currentVolumeProgress.style.width = this.video.volume * vWidth + 'px'
    this.vdot.style.left = this.video.volume * vWidth - OFFSETDOT + 'px'
    this.vl = this.video.volume * vWidth
  }

  play() {
    if (this.video.paused) {
      this.video.play()
      this.isPlay.classList.remove('ep-play')
      this.isPlay.classList.add('ep-pause')
      this.panel.classList.remove('ep-play')
      this.panel.classList.add('wrap')
    } else {
      this.video.pause()
      this.isPlay.classList.remove('ep-pause')
      this.isPlay.classList.add('ep-play')
      this.panel.classList.remove('wrap')
      this.panel.classList.add('ep-play')
    }
  }

  isVolume() {
    if (this.video.muted) {
      this.video.muted = false
      this.volumeBtn.classList.remove('ep-volume-off')
      this.volumeBtn.classList.add('ep-volume-up')
    } else {
      this.video.muted = true
      this.volumeBtn.classList.remove('ep-volume-up')
      this.volumeBtn.classList.add('ep-volume-off')
    }
  }

  timeupdate() {
    let cTime = this.video.currentTime
    if (this.video.buffered.length) {
      this.bufferEnd = this.video.buffered.end(this.video.buffered.length - 1)
      this.buffer.style.width =
        (this.bufferEnd / this.video.duration) * this.progress.clientWidth +
        'px'
    }

    let cTimeStr = getTimeStr(cTime)
    this.currentTime.innerHTML = cTimeStr
    let offsetCom = cTime / this.tTime
    if (!this.isDown) {
      this.currentProgress.style.width =
        offsetCom * this.progress.clientWidth + 'px'
      this.dot.style.left =
        offsetCom * this.progress.clientWidth - OFFSETDOT + 'px'
      this.l = offsetCom * this.progress.clientWidth
    }
  }

  progressClick(e) {
    let event = e || window.event
    if (!this.isDown) {
      this.video.currentTime =
        (event.offsetX / this.progress.offsetWidth) * this.video.duration
    }
  }

  volumeClick(e) {
    let event = e || window.event
    if (!this.isDown) {
      this.vdot.style.left = event.offsetX - OFFSETDOT + 'px'
      this.currentVolumeProgress.style.width = event.offsetX + 'px'
      this.video.volume = event.offsetX / this.volumeProgress.offsetWidth
    }
  }

  Dotonmousedown(e) {
    let event = e || window.event
    this.x = event.clientX
    this.l = this.l ? this.l : event.offsetX
    this.isDown = true
  }

  Dotonmousemove(e) {
    if (this.isDown) {
      let event = e || window.event

      this.nx = event.clientX
      this.nl = this.nx - (this.x - this.l)
      if (this.nl <= 0) this.nl = 0
      if (this.nl >= this.progress.clientWidth)
        this.nl = this.progress.clientWidth
      this.dot.style.left = this.nl - OFFSETDOT + 'px'
      this.currentProgress.style.width = this.nl + 'px'
      this.x = this.nx
      this.l = this.nl
    }
  }

  Dotonmouseup(e) {
    let event = e || window.event
    this.video.currentTime =
      (this.nl / this.progress.offsetWidth) * this.video.duration
    this.isDown = false
  }

  Volumeonmousedown(e) {
    let event = e || window.event
    this.vx = event.clientX
    this.vl = this.vl !== 0 ? this.vl : event.offsetX
    this.isDown = true
  }

  Volumeonmousemove(e) {
    if (this.isDown) {
      let event = e || window.event

      this.vnx = event.clientX
      this.vnl = this.vnx - (this.vx - this.vl)
      if (this.vnl <= 0) this.vnl = 0
      if (this.vnl >= this.volumeProgress.clientWidth)
        this.vnl = this.volumeProgress.clientWidth
      this.vdot.style.left = this.vnl - OFFSETDOT + 'px'
      this.currentVolumeProgress.style.width = this.vnl + 'px'
      this.vx = this.vnx
      this.vl = this.vnl
    }
  }

  Volumeonmouseup(e) {
    let event = e || window.event
    this.isDown = false
    this.video.volume = this.vnl / this.volumeProgress.clientWidth
  }

  ended() {
    this.isPlay.classList.remove('ep-pause')
    this.isPlay.classList.add('ep-play')
    this.currentProgress.style.width = 0
    this.dot.style.left = 0
    this.currentTime.innerHTML = getTimeStr()
    this.video.currentTime = 0
    this.x = this.l = this.nx = this.nl = 0
    this.isDown = false
  }

  fullScreen() {
    if (isFullScreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      this.el.style.height = this.height + 'px'
      this.el.style.width = this.width + 'px'
    } else {
      let rfs =
        this.el.requestFullScreen ||
        this.el.webkitRequestFullScreen ||
        this.el.mozRequestFullScreen ||
        this.el.msRequestFullscreen
      this.el.style.height = '100%'
      this.el.style.width = '100%'

      return rfs.call(this.el)
    }
  }
}

export default Eplayer
