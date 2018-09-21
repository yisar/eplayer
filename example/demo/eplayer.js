const OFFSETDOT = 18
copyright()

function getTimeStr(time) {
  var h = Math.floor(time / 3600)
  var m = Math.floor((time % 3600) / 60)
  var s = Math.floor(time % 60)
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}

function isFullScreen() {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  )
}

function copyright() {
  console.log(
    '\n %c EPlayer 0.2.8 %c eplayer.js.org \n',
    'color: #fff; background: linear-gradient(to right,#57a1fc ,#6beaf7); padding:5px;',
    'color: #7192c3; background: #ecfaff; padding:5px 0;'
  )
}

function isSafari(){
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
}

class Init {
  constructor(el, data) {
    let html = `
    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_g9ctpaubgfq.css">
    <style>
      .player {
        background:#000;
        width: 100%;
        height: 100%;
        position: relative;
      }
      .player video {
        width: 100%;
        height: 100%;
      }
      .player .panel {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .player .wrap {
        height: 100%;
        width: 100%;
      }
      .player:hover .controls {
        opacity: 1
      }
      .player .panels .epicon {
        font-size: 80px
      }
      .player .controls {
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: 0 15px;
        box-sizing: border-box;
        opacity: 0;
        transition: .5s ease-out;
      }
      .player .option {
        position: relative;
        display:flex;
        align-items: center;
        padding: 10px 0;
      }
      .player .option-left{
        display: flex;
        flex: 1;
        align-items: center;
      }
      .player .option-right{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end
      }
      .player .progress-bar {
        width: 100%;
        position: relative;
        cursor: pointer;
      }
      .player .volume-progress-bar {
        width: 100px;
        position: relative;
        cursor: pointer;
      }
      .player .volume-progress {
        border-radius:2px;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      .player .progress {
        border-radius:2px;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      .player .dot {
        padding: 20px;
        position: absolute;
        top: -18px;
        left: -18px;
        transition: 0.01s
      }
      .player .dot i {
        height: 13px;
        width: 13px;
        background: ${data.themeColor};
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left:50%;
        transform:translate(-50%,-50%)
      }
      .player .volume {
        display: flex;
        align-items: center;
        padding-right: 15px;
      }
      .player .current-progress {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        position: absolute;
        border-radius:2px;
        top: 0;
        transition: .1s
      }
      .player .buffer {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        opacity:.4;
        position: absolute;
        border-radius:2px;
        top: 0;
        transition: .3s;
      }
      .player .time {
        text-align: center;
        font-size: 12px;
        color: #fff;
        padding-left: 15px;
      }
      .player .epicon:hover {
        color: #fff;
      }
      .player .epicon {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: 0.3s;
        font-size: 20px;
      }
      .player .ep-volume-down,.ep-volume-up,.ep-volume-off {
        padding-right: 15px
      }
      .player .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin:-20px 0 0 -20px;
        width: 40px;
        height: 40px;
        border: 4px solid;
        border-color: rgba(255, 255, 255, 0.8) rgba(255, 255, 255, 0.8) transparent;
        border-radius: 50%;
        box-sizing: border-box;
        animation: loading 1s linear infinite;
      }
      @keyframes loading{
        0%{
          transform: rotate(0deg);
        }
        100%{
          transform: rotate(360deg);
        }  
      }
      @keyframes display{
        0%{
          opacity: 1;
        }
        100%{
          opacity: 0;
        }
      }
    </style>
    <div class="player">
      <video src="${
        data.src
      }" webkit-playsinline playsinline x5-playsinline x-webkit-airplay="allow"></video>
        <div class="panels">
          <div class="loading"></div>
          <i class="epicon ep-play panel" style="display:none;"></i>
        </div>
        <div class="controls">
          <div class="progress-bar">
            <div class="current-progress"></div>
            <div class="buffer"></div>
            <div class="dot">
              <i></i>
            </div>
            <div class="progress"></div>
          </div>
          <div class="option">
            <div class="option-left">
              <div class="control">
                <i class="epicon ep-play switch"></i>
              </div>
              <div class="time">
                <span class="current">00:00</span>
                /
                <span class="total">00:00</span>
              </div>
            </div>
            <div class="option-right"> 
              <div class="volume">
                <i class="epicon ep-volume-up volume-button"></i>
                <div class="volume-progress-bar">
                  <div class="volume-progress"></div>
                  <div class="current-progress"></div>
                  <div class="dot">
                    <i></i>
                  </div>
                </div>
              </div> 
              <div class="control">
                <i class="epicon ep-full full"></i>
              </div>  
            </div>
          </div>
        </div>
    </div>
    `
    el.innerHTML = html
  }
}

 class M3U8 {
  constructor(el, data) {
    this.src = data.src
    this.el = el

    if (Hls.isSupported()) {
      let hls = new Hls()
      hls.loadSource(this.src)
      hls.attachMedia(this.el)
    }
  }
}

class Eplayer {
  constructor(el, data) {
    this.el = el
    this.data = data
    this.h = el.clientHeight
    this.w = el.clientWidth

    new Init(this.el, this.data)

    this.video = document.querySelector('.player video')
    this.loading = document.querySelector('.player .loading')
    this.isPlay = document.querySelector('.player .switch')
    this.panel = document.querySelector('.player .panel')
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

    if (data.src.indexOf('m3u8') !== -1) {
      new M3U8(this.video, this.data)
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
    window.onresize = e => this.windowResize(e)
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