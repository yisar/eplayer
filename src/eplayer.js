import { Init } from './init'
import { Hls } from './hls'
import { Flv } from './flv'
import { getTimeStr, isFullScreen, copyright, isMoblie } from './util'

const OFFSETDOT = 18
copyright()

class Eplayer {
  constructor(el, data) {
    this.el = el
    this.data = data
    this.h = el.clientHeight
    this.w = el.clientWidth
    this.cTime = 0

    new Init(this.el, this.data)

    this.video = document.querySelector('.player video')
    this.loading = document.querySelector('.player .loading')
    this.isPlay = document.querySelector('.player .switch')
    this.panel = document.querySelector('.player .panel')
    this.playBtn = document.querySelector('.player .panel .ep-play')
    this.totalTime = document.querySelector('.player .total')
    this.currentTime = document.querySelector('.player .current')
    this.dot = document.querySelector('.player .progress-bar .dot')
    this.vdot = document.querySelector('.player .volume .dot')
    this.full = document.querySelector('.player .full')
    this.progress = document.querySelector('.player .progress')
    this.currentProgress = document.querySelector('.player .current-progress')
    this.currentVolumeProgress = document.querySelector(
      '.player .volume .current-progress'
    )
    this.volumeBtn = document.querySelector('.player .volume-button')
    this.controls = document.querySelector('.player .controls')
    this.buffer = document.querySelector('.player .buffer')
    this.volumeProgress = document.querySelector('.player .volume-progress')

    new Hls(this.video, this.data)

    new Flv(this.video, this.data)

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
    this.dot.ontouchstart = e => this.Dotonmousedown(e)
    this.el.onmousemove = e => this.Dotonmousemove(e)
    this.el.ontouchmove = e => this.Dotonmousemove(e)
    this.el.onmouseup = e => this.Dotonmouseup(e)
    this.el.ontouchend = e => this.Dotonmouseup(e)
    this.vdot.onmousedown = e => this.Volumeonmousedown(e)
    this.vdot.ontouchstart = e => this.Volumeonmousedown(e)
    this.vdot.onmousemove = e => this.Volumeonmousemove(e)
    this.vdot.ontouchmove = e => this.Volumeonmousemove(e)
    this.vdot.onmouseup = e => this.Volumeonmouseup(e)
    this.vdot.ontouchend = e => this.Volumeonmouseup(e)
    this.volumeBtn.onclick = () => this.isVolume()
    window.onresize = e => this.windowResize(e)
  }

  waiting() {
    this.loading.style.display = 'block'
  }

  canplay() {
    this.tTime = this.video.duration
    this.loading.style.display = 'none'
    this.playBtn.style.display = 'block'
    let tTimeStr = getTimeStr(this.tTime)
    if (tTimeStr) this.totalTime.innerHTML = tTimeStr
    let vWidth = this.volumeProgress.clientWidth
    this.video.volume = 0.5
    this.currentVolumeProgress.style.width = this.video.volume * vWidth + 'px'
    this.vdot.style.left = this.video.volume * vWidth - OFFSETDOT + 'px'
    this.vl = this.video.volume * vWidth
  }

  play() {
    if (this.video.paused) {
      this.video.currentTime = this.cTime
      this.video.play()
      this.isPlay.classList.remove('ep-play')
      this.isPlay.classList.add('ep-pause')
      this.playBtn.classList.remove('ep-play')
    } else {
      this.video.pause()
      this.video.currentTime = this.cTime
      this.isPlay.classList.remove('ep-pause')
      this.isPlay.classList.add('ep-play')
      this.playBtn.classList.add('ep-play')
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
    this.cTime = this.video.currentTime
    if (this.video.buffered.length) {
      this.bufferEnd = this.video.buffered.end(this.video.buffered.length - 1)
      this.buffer.style.width =
        (this.bufferEnd / this.video.duration) * this.progress.clientWidth +
        'px'
    }

    let cTimeStr = getTimeStr(this.cTime)
    this.currentTime.innerHTML = cTimeStr
    let offsetCom = this.cTime / this.tTime
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
    if (e.changedTouches) {
      this.x = e.changedTouches[0].clientX
    } else {
      this.x = e.clientX
    }
    this.l = this.l ? this.l : 0

    this.isDown = true
  }

  Dotonmousemove(e) {
    this.controls.style.opacity = 1
    setTimeout(() => {
      this.controls.style.opacity = 0
    }, 6000)
    if (this.isDown) {
      if (e.changedTouches) {
        this.nx = e.changedTouches[0].clientX
      } else {
        this.nx = e.clientX
      }

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
    this.video.currentTime =
      (this.nl / this.progress.offsetWidth) * this.video.duration
    this.isDown = false
  }

  Volumeonmousedown(e) {
    if (e.changedTouches) {
      this.vx = e.changedTouches[0].clientX
    } else {
      this.vx = e.clientX
    }
    this.vl = this.vl !== 0 ? this.vl : 0
    this.isDown = true
    e.stopPropagation()
  }

  Volumeonmousemove(e) {
    if (this.isDown) {
      if (e.changedTouches) {
        this.vnx = e.changedTouches[0].clientX
      } else {
        this.vnx = e.clientX
      }
      console.log(this.vx, this.vl, this.vnx)
      this.vnl = this.vnx - (this.vx - this.vl)
      if (this.vnl <= 0) this.vnl = 0
      if (this.vnl >= this.volumeProgress.clientWidth)
        this.vnl = this.volumeProgress.clientWidth
      this.vdot.style.left = this.vnl - OFFSETDOT + 'px'
      this.currentVolumeProgress.style.width = this.vnl + 'px'
      this.vx = this.vnx
      this.vl = this.vnl
    }
    e.stopPropagation()
  }

  Volumeonmouseup(e) {
    this.isDown = false
    this.video.volume = this.vnl / this.volumeProgress.clientWidth
    e.stopPropagation()
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
    } else {
      let rfs =
        this.el.requestFullScreen ||
        this.el.webkitRequestFullScreen ||
        this.el.mozRequestFullScreen ||
        this.el.msRequestFullscreen

      return rfs.call(this.el)
    }
  }

  windowResize(e) {
    if (isFullScreen()) {
      this.el.style.height = '100%'
      this.el.style.width = '100%'
    } else {
      this.el.style.height = this.h + 'px'
      this.el.style.width = this.w + 'px'
    }
  }
}

export default Eplayer
