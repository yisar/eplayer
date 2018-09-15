import { Init } from './init'
import { Hls } from './hls'
import { getTimeStr } from './util'

class Eplayer {
  constructor(el, data) {
    this.el = el
    this.data = data

    new Init(this.el, this.data)

    this.video = document.querySelector('video')
    this.isPlay = document.querySelector('.switch')
    this.totalTime = document.querySelector('.total')
    this.currentTime = document.querySelector('.current')
    this.dot = document.querySelector('.dot')
    this.full = document.querySelector('.full')
    this.progress = document.querySelector('.progress')
    this.currentProgress = document.querySelector('.current-progress')

    if (data.hls) {
      new Hls(this.video, this.data)
    }

    this.tTime = 0

    this.video.oncanplay = () => this.canplay()
    this.isPlay.onclick = () => this.play()
    this.video.ontimeupdate = () => this.timeupdate()
    this.progress.onclick = e => this.progressClick(e)
    this.video.onended = () => this.ended()
  }

  canplay() {
    this.tTime = this.video.duration
    let tTimeStr = getTimeStr(this.tTime)
    this.totalTime.innerHTML = tTimeStr
  }

  play() {
    if (this.video.paused) {
      this.video.play()
      this.isPlay.classList.remove('ep-play')
      this.isPlay.classList.add('ep-pause')
    } else {
      this.video.pause()
      this.isPlay.classList.remove('ep-pause')
      this.isPlay.classList.add('ep-play')
    }
  }

  timeupdate() {
    let cTime = this.video.currentTime
    let cTimeStr = getTimeStr(cTime)
    this.currentTime.innerHTML = cTimeStr
    let offsetPre = (cTime / this.tTime) * 100 + '%'
    this.currentProgress.style.width = offsetPre
    this.dot.style.left = offsetPre
  }

  progressClick(e) {
    let event = e || window.event
    this.video.currentTime =
      (event.offsetX / this.progress.offsetWidth) * this.video.duration
  }

  ended() {
    this.isPlay.classList.remove('ep-pause')
    this.isPlay.classList.add('ep-play')
    this.currentProgress.style.width = 0
    this.dot.style.left = 0
    this.currentTime.innerHTML = getTimeStr()
    this.video.currentTime = 0
  }
}

export default Eplayer
