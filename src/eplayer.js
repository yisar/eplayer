import { Init } from './init'
import { Hls } from './hls'
import { getTimeStr, isFullScreen } from './util'

const OFFSETDOT = 18

class Eplayer {
  constructor(el, data) {
    this.el = el
    this.data = data

    new Init(this.el, this.data)

    this.video = document.querySelector('video')
    this.loading = document.querySelector('.loading')
    this.isPlay = document.querySelector('.switch')
    this.panel = document.querySelector('.panel')
    this.totalTime = document.querySelector('.total')
    this.currentTime = document.querySelector('.current')
    this.dot = document.querySelector('.dot')
    this.full = document.querySelector('.full')
    this.progress = document.querySelector('.progress')
    this.currentProgress = document.querySelector('.current-progress')
    this.controls = document.querySelector('.controls')

    if (data.hls) {
      new Hls(this.video, this.data)
    }

    this.tTime = 0
    this.x = 0
    this.l = 0
    this.isDown = false
    this.nl = 0
    this.nx = 0

    this.video.onwaiting = () => this.waiting()
    this.video.oncanplay = () => this.canplay()
    this.isPlay.onclick = () => this.play()
    this.panel.onclick = () => this.play()
    this.video.ontimeupdate = () => this.timeupdate()
    this.progress.onclick = e => this.progressClick(e)
    this.video.onended = () => this.ended()
    this.full.onclick = () => this.fullScreen()
    this.dot.onmousedown = e => this.Dotonmousedown(e)
    this.dot.onmousemove = e => this.Dotonmousemove(e)
    this.dot.onmouseup = e => this.Dotonmouseup(e)
  }

  waiting() {
    this.loading.style.display = 'block'
  }

  canplay() {
    this.tTime = this.video.duration
    this.loading.style.display = 'none'
    let tTimeStr = getTimeStr(this.tTime)
    this.totalTime.innerHTML = tTimeStr
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
      this.panel.style.display = 'block'
      this.panel.classList.remove('wrap')
      this.panel.classList.add('ep-play')
    }
  }

  timeupdate() {
    let cTime = this.video.currentTime
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

    this.video.currentTime =
      (event.offsetX / this.progress.offsetWidth) * this.video.duration
  }

  Dotonmousedown(e) {
    let event = e || window.event
    this.x = event.clientX
    this.l = this.l !== 0 ? this.l : event.offsetX
    this.isDown = true
    return false
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
    return false
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
}

export default Eplayer
