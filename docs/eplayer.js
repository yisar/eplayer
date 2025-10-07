class Eplayer extends HTMLElement {
  constructor() {
    super()
    this.doms = {}
    this.src = this.getAttribute('src')
    this.type = this.getAttribute('type')
    this.cover = this.getAttribute('cover')
    this.live = JSON.parse(this.getAttribute('live'))
    this.danmaku = null
    this.subs = []

    // 添加长按右箭头3倍速相关状态
    this.rightKeyHoldTimer = null
    this.rightKeyPressTime = null
    this.originalPlaybackRate = 1
    this.isRightKeyPressed = false
    this.isSpeedModeActive = false

    this.init()
    this.stream()
  }

  static get observedAttributes() {
    return ['src', 'type', 'danma', 'live','cover']
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'src') {
      this.src = this.$('.video').src = newVal
      this.stream()
      this.$('.video').load()
    }
    if (name === 'type') {
      this.type = newVal
      this.stream()
      this.$('.video').load()
    }
    if (name === 'live') {
      this.live = JSON.parse(newVal)
      if (this.live) {
        this.$('.progress').style.display = 'none'
        this.$('.time').style.display = 'none'
      } else {
        this.$('.progress').style.display = 'block'
        this.$('.time').style.display = 'inline-block'
      }
    }
    if (name === 'danmu') {
      this.danmaku.add({
        msg: newVal
      })
    }
    if (name === 'cover') {
      this.cover = newVal
      this.$('.rotate-img').setAttribute('src', newVal)
      this.$('.cover').style.background=`url(${newVal || ''}) center/cover no-repeat #fff`
    }
  }

  $(key) {
    return this.doms[key]
  }

  waiting() {
    this.$('.mark').removeEventListener('click', this.mark.bind(this))
    this.$('.mark').classList.remove('playing')
    this.$('.mark').classList.add('loading')
  }

  stream() {
    switch (this.type) {
      case 'hls':
        if (Hls.isSupported()) {
          let hls = new Hls()
          hls.loadSource(this.src)
          hls.attachMedia(this.video)
        }
        break
    }
  }

  mark() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.play(), 200)
  }

  canplay() {
    this.$('.mark').classList.remove('loading')
    this.$('.mark').classList.add('playing')
    this.$('.mark').addEventListener('click', this.mark.bind(this))
    this.$('.total').innerHTML = getTimeStr(this.video.duration)
  }

  play() {
    console.log(this.$('.img-container'))
    if (this.video.paused) {
      this.video.play()
      this.danmaku.resume()
      this.$('.img-container').classList.add('is-playing')
      this.$('.is-play').setAttribute('icon-id', 'pause')
      this.emit('play')
    } else {
      this.video.pause()
      this.danmaku.pause()
      this.$('.img-container').classList.remove('is-playing')
      this.$('.is-play').setAttribute('icon-id', 'play')
      this.emit('pause')
    }
  }

  volume() {
    if (this.video.muted) {
      this.video.muted = false
      this.$('.is-volume').setAttribute('icon-id', 'volume-ok')
    } else {
      this.video.muted = true
      this.$('.is-volume').setAttribute('icon-id', 'volume-x')
    }
  }

  update() {
    if (this.moving) return
    let cTime = getTimeStr(this.video.currentTime)
    if (this.video.buffered.length) {
      let bufferEnd = this.video.buffered.end(this.video.buffered.length - 1)
      this.$('.buffer').style.width = (bufferEnd / this.video.duration) * 100 + '%'
    }
    let offset = (this.video.currentTime / this.video.duration) * 100
    this.$('.now').innerHTML = cTime
    this.$('.current').style.width = offset + '%'
  }

  progress(e) {
    const progressBarRect = this.$('.progress').getBoundingClientRect()
    let clickX = e.clientX - progressBarRect.left
    clickX = Math.max(0, Math.min(clickX, progressBarRect.width))
    const offsetRatio = clickX / progressBarRect.width

    this.video.currentTime = this.video.duration * offsetRatio
    this.$('.now').innerHTML = getTimeStr(this.video.currentTime)
    this.$('.current').style.width = offsetRatio * 100 + '%'
  }

  down(e) {
    e.preventDefault()
    this.moving = true
    const progressBarRect = this.$('.progress').getBoundingClientRect()
    this.progressBarWidth = progressBarRect.width
    this.initialClientX = e.clientX
    const initialOffsetRatio = this.video.currentTime / this.video.duration
    this.initialOffsetPixels = initialOffsetRatio * this.progressBarWidth

    document.addEventListener('pointermove', this.handleMove)
    document.addEventListener('pointerup', this.handleUp, { once: true })
  }

  handleMove = (e) => {
    if (!this.moving) return

    const deltaX = e.clientX - this.initialClientX
    let newOffsetPixels = this.initialOffsetPixels + deltaX
    newOffsetPixels = Math.max(0, Math.min(newOffsetPixels, this.progressBarWidth))

    this.$('.current').style.width = (newOffsetPixels / this.progressBarWidth) * 100 + '%'

    const newTime = (newOffsetPixels / this.progressBarWidth) * this.video.duration
    this.video.currentTime = Math.max(0, Math.min(newTime, this.video.duration))

    this.$('.now').innerHTML = getTimeStr(this.video.currentTime)
  }

  handleUp = (e) => {
    this.moving = false
    document.removeEventListener('pointermove', this.handleMove)
    delete this.progressBarWidth
    delete this.initialClientX
    delete this.initialOffsetPixels
  }

  move(e) {
    let offset = e.clientX - this.disX + 12
    if (offset < 0) offset = 0
    if (offset > this.$('.progress').clientWidth) {
      offset = this.$('.progress').clientWidth
    }
    this.$('.current').style.width = offset + 'px'
    this.video.currentTime = (offset / this.$('.progress').clientWidth) * this.video.duration
    this.$('.now').innerHTML = getTimeStr(this.video.currentTime)
  }

  alow() {
    clearTimeout(this.timer)
    this.$('.mark').style.cursor = 'default'
    this.$('.eplayer').classList.add('hover')
    if (!this.cover) {
      this.timer = setTimeout(() => {
        this.$('.eplayer').classList.remove('hover')
      }, 5000)
    }
  }

  keydown(e) {
    e.preventDefault()
    switch (e.keyCode) {
      case 37: // 左箭头 - 后退10秒
        this.video.currentTime = Math.max(0, this.video.currentTime - 10)
        break
      case 39: // 右箭头 - 前进10秒 (支持长按3倍速)
        if (!this.isRightKeyPressed) {
          this.isRightKeyPressed = true
          this.rightKeyPressTime = Date.now()
          this.originalPlaybackRate = this.video.playbackRate

          // 设置定时器，如果持续按住超过500ms则开启3倍速
          this.rightKeyHoldTimer = setTimeout(() => {
            this.isSpeedModeActive = true
            this.video.playbackRate = 3
            this.$('.speed').innerText = '3x'
            this.$('.speed-indicator').style.display = 'block'
          }, 500)
        }
        break
      case 38: // 上箭头 - 增加音量5%
        e.preventDefault()
        this.video.volume = Math.min(1, this.video.volume + 0.05)
        break
      case 40: // 下箭头 - 减少音量5%
        e.preventDefault()
        this.video.volume = Math.max(0, this.video.volume - 0.05)
        break
      case 32: // 空格键 - 播放/暂停
        e.preventDefault()
        this.play()
        break
      case 77: // M键 - 静音/取消静音
        this.volume()
        break
      default:
    }
  }

  keyup(e) {
    switch (e.keyCode) {
      case 39: // 右箭头松开
        if (this.isRightKeyPressed) {
          const pressDuration = Date.now() - this.rightKeyPressTime
          this.isRightKeyPressed = false

          // 清除定时器
          if (this.rightKeyHoldTimer) {
            clearTimeout(this.rightKeyHoldTimer)
            this.rightKeyHoldTimer = null
          }

          // 判断是短按还是长按
          if (pressDuration < 500 && !this.isSpeedModeActive) {
            // 短按：只快进10秒
            this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10)
          } else if (this.isSpeedModeActive) {
            // 长按结束：恢复原播放速度并隐藏提示
            this.video.playbackRate = this.originalPlaybackRate
            this.$('.speed').innerText = this.originalPlaybackRate + 'x'
            this.$('.speed-indicator').style.display = 'none'
            this.isSpeedModeActive = false
          }

          // 重置状态
          this.rightKeyPressTime = null
        }
        break
      default:
    }
  }

  ended() {
    // this.$('.is-play').classList.replace('ep-pause', 'ep-play')
  }

  full() {
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

      screen.orientation.lock("portrait-primary")
    } else {
      let el = this.$('.eplayer')
      let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen
      rfs.call(el)
      screen.orientation.lock("landscape-primary")
    }
  }

  panel(e) {
    e.preventDefault()
    const panel = this.$('.panel')
    const eplayer = this.$('.eplayer')
    if (e.button !== 2) {
      panel.style.display = 'none'
    } else {
      panel.style.display = 'block'
      panel.style.height = panel.childElementCount * 24 + 'px'
      if (panel.offsetHeight + e.offsetY + 40 > eplayer.offsetHeight) {
        panel.style.top = ''
        panel.style.bottom = ((eplayer.offsetHeight - e.offsetY) / eplayer.offsetHeight) * 100 + '%'
      } else {
        panel.style.bottom = ''
        panel.style.top = (e.offsetY / eplayer.offsetHeight) * 100 + '%'
      }
      if (panel.offsetWidth + e.offsetX + 10 > eplayer.offsetWidth) {
        panel.style.left = ''
        panel.style.right = ((eplayer.offsetWidth - e.offsetX) / eplayer.offsetWidth) * 100 + '%'
      } else {
        panel.style.right = ''
        panel.style.left = (e.offsetX / eplayer.offsetWidth) * 100 + '%'
      }
    }
  }

  speed(e) {
    this.video.playbackRate === 3 ? (this.video.playbackRate = 1) : (this.video.playbackRate = this.video.playbackRate + 0.25)
    this.$('.speed').innerText = this.video.playbackRate + 'x'
  }

  init() {
    console.log(this.cover)
    let html = `
      <style>
        @import "https://at.alicdn.com/t/c/font_836948_ro9xopmggai.css";
        *{
          padding:0;
          margin:0;
        }
        li{
          list-style:none;
        }
        .eplayer,video{
          font-family:'黑体';
          height:100%;
          width:100%;
          color:var(--icons,rgba(255,255,255,0.6));
          font-size:12px;
          background:var(--bg,#000);       
        }
        .eplayer .cover{
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:url(${this.cover || ''}) center/cover no-repeat #fff;
          filter:blur(8px);
        }

        .eplayer{
          user-select:none;
          position: relative;
          overflow: hidden;
        }
        .controls{
          position:absolute;
          left:0;
          right:0;
          bottom:-34px;
          background:linear-gradient(transparent,rgba(0,0,0,.5));
          transition: bottom .3s ease-out, opacity .3s ease-out;
          opacity: 0;
          pointer-events: none;
          z-index:1000;
        }
        .hover .controls{
          bottom:0;
          opacity: 1;
          pointer-events: auto;
        }
        .progress{
          display:${this.live ? 'none' : 'block'};
          position:relative;
          bottom:5px;
          left:0;
          right:0;
          cursor:pointer;
          transition: .3s ease-out;
        }
        .progress:hover .bg,.progress:hover .current,.progress:hover .buffer{
          height:6px;
        }
          .progress:hover .dot{
          display:block;
        }
        .options{
          display:flex;
          align-items:center;
        }
        .time{
          display:${this.live ? 'none' : 'inline-block'};
          position:relative;
          font-size:15px;
        }
        .left{
          flex:1;
          display:flex;
          align-items:center;
        }
        .right{
          flex:1;
          display:flex;
          align-items:center;
          justify-content: flex-end;
        }
        .bg,.current,.buffer{
          left:0;
          height:3px;
          position:absolute;
          top:0;
          transition: .3s ease-out;
        }
        .bg{
          right:0;
          background:var(--progress,rgba(255,255,255,.3));
        }
        .current{
          background:var(--theme,#946ce6);
        }
        .buffer{
          background:var(--buffer,rgba(255,255,255,.5));
        }
        .dot{
          display:none;
          position:absolute;
          border-radius: 50%;
          background:#fff;
          height: 12px;
          width:12px;
          top:-50%;
          right:0px;
          transform: translate(50%,0);
          cursor:pointer;
          z-index:1;
        }
        @keyframes loading{
          0%{
            transform: rotate(0deg);
          }
          100%{
            transform: rotate(360deg);
          }  
        }
        .playing{
          position: absolute;
          z-index: 1;
          top:0;
          left:0;
          right:0;
          bottom:0;
        }
        .loading {
          position: absolute;
          z-index: 1;
          top: 50%;
          left: 50%;
          margin:-20px 0 0 -20px;
          width: 30px;
          height: 30px;
          z-index:1;
          border-top: 4px solid rgba(255, 255, 255, 0.2);
          border-right: 4px solid rgba(255, 255, 255, 0.2);
          border-bottom: 4px solid rgba(255, 255, 255, 0.2);
          border-left: 4px solid #fff;
          border-radius: 50%;
          animation: loading 1s linear infinite;
        }
        .panel {
          position: absolute;
          bottom: 200px;
          right: 300px;
          background:rgba(0,0,0,.8);
          border-radius:4px;
          cursor: pointer; 
          z-index: 1;
          display:none;
          width:150px;
        }
        .panel li{
          line-height:24px;
          text-align:center;
        }
        .panel li:hover{
          border-radius:4px;
          background:rgba(0,0,0,.8)
        }

        .danmaku {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
          height:100%;
          width:100%;
        }

        .speed-indicator {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(148, 108, 230, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          z-index: 999;
          display: none;
          pointer-events: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        iconpark-icon{
        margin-right:5px;
        cursor:pointer;
        }

        em{
          font-size: 16px;
          font-weight:bold;
          font-style:normal;
          color:#fff;
          margin:0 10px 0 8px;
          cursor: pointer;
        }

                .eplayer .img-container{
          position: absolute;
          z-index: 1;
          height:60%;
          aspect-ratio: 1/1;
          border-radius:50%;
          left:50%;
          top:50%;
          transform:translate(-50%,-50%);
        }

        .rotate-img {
      aspect-ratio: 1/1;
      height: 100%;
      border-radius: 50%;
      animation: rotate 10s linear infinite;
      object-fit: cover;
      animation-play-state: paused; /* 默认暂停 */
    }

    .img-container::after,
    .img-container::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: wave 2s infinite;
      animation-play-state: paused; /* 默认暂停 */
    }

    .img-container::after {
      background: rgba(255, 255, 255, 0.3);
    }

    .img-container::before {
      background: rgba(255, 255, 255, 0.2);
      animation-delay: 1s;
    }

    /* 播放状态 */
    .is-playing .rotate-img,
    .is-playing::after,
    .is-playing::before {
      animation-play-state: running;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes wave {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
      }
    }
      </style>
      
      <div class="eplayer hover">
      <div class="danmaku"></div>
        <video id="video" class="video" src="${this.src || ''}"></video>
        <div class="cover"></div>
        <div class="img-container"><img src="${this.cover || ''}" class="rotate-img"/></div>
        <div class="mark loading"></div>
        <div class="speed-indicator">倍速中</div>
        <div class="controls">
          <div class="progress">
            <b class="bg"></b>
            <b class="buffer"></b>
            <div class="current" style="width:0">
              <div class="dot"></div>
            </div>
          </div>
          <div class="options">
            <div class="left">
              <iconpark-icon icon-id="play" size="2rem" class="is-play"></iconpark-icon>
              <span class="time">
                <b class="now">00:00</b>/<b class="total">00:00</b>
              </span>
            </div>
            <div class="right">
              <em class="speed">1x</em>
              ${this.cover ? `<em class="pip">画中画</em>`:''}
              <iconpark-icon icon-id="volume-ok" size="2rem" class="is-volume"></iconpark-icon>
              ${this.cover ? `<iconpark-icon icon-id="web-fullscreen" size="2rem"></iconpark-icon>`:''}
              ${this.cover ?`<iconpark-icon icon-id="fullscreen" size="2rem" class="fullscreen"></iconpark-icon>`:""}
            </div>
          </div>
        </div>
        <div class="panel"></div>
      </div>
    `
    let template = document.createElement('template')
    template.innerHTML = html
    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true))

    const doms = [
      '.img-container',
      '.video',
      '.mark',
      '.playing',
      '.loading',
      '.total',
      '.now',
      '.time',
      '.current',
      '.buffer',
      '.is-play',
      '.is-volume',
      '.dot',
      '.progress',
      '.controls',
      '.line',
      '.bg',
      '.eplayer',
      '.fullscreen',
      '.panel',
      '.speed',
      '.pip',
      '.danmaku',
      '.speed-indicator',
      '.rotate-img',
      '.cover'
    ]

    for (const key of doms) {
      let dom = this.shadowRoot.querySelectorAll(key)
      this.doms[key] = dom.length > 1 ? [...dom] : dom[0]
    }
  }

  connectedCallback() {
    this.video = this.$('.video')
    this.video.volume = 0.5
    this.danmaku = new Danmaku({
      container: this.$('.danmaku')
    })
    // setVolume(this.video.volume * 10, this.$('.line'))
    this.video.onwaiting = this.waiting.bind(this)
    this.video.oncanplay = this.canplay.bind(this)
    this.video.ontimeupdate = this.update.bind(this)
    this.video.onended = this.ended.bind(this)
    this.delegate('click', {
      '.is-volume': this.volume,
      '.fullscreen': this.full,
      '.is-play': this.play,
      '.ep-speed': this.speed,
      '.speed': this.speed,
      '.bg': this.progress,
      '.buffer': this.progress,
      '.current': this.progress,
      '.pip': this.pip,
    })
    this.delegate('pointerdown', {
      '.dot': this.down,
      '.mark': this.panel,
    })
    this.delegate('dblclick', {
      '.mark': (e) => {
        clearTimeout(this.timer)
        this.full()
      },
    })

    // 使用全局键盘监听以确保按键事件能在任何地方被捕获
    this.keydownHandler = this.keydown.bind(this)
    this.keyupHandler = this.keyup.bind(this)
    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)

    this.delegate('mousemove', this.alow)
  }

  disconnectedCallback() {
    // 清理全局键盘事件监听器
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
    }
    if (this.keyupHandler) {
      document.removeEventListener('keyup', this.keyupHandler)
    }

    // 清理长按定时器和状态
    if (this.rightKeyHoldTimer) {
      clearTimeout(this.rightKeyHoldTimer)
      this.rightKeyHoldTimer = null
    }
    this.isRightKeyPressed = false
    this.isSpeedModeActive = false
    this.rightKeyPressTime = null
  }

  delegate(type, map) {
    const that = this
    if (typeof map === 'function') {
      this.shadowRoot.addEventListener(type, map.bind(that))
    } else {
      this.shadowRoot.addEventListener(type, (e) => {
        for (const key in map) e.target.matches(key) && map[key].call(that, e)
      })
    }
  }

  pip(e) {
    if (!document.pictureInPictureElement) {
      this.video.requestPictureInPicture()
    } else {
      document.exitPictureInPicture()
    }
  }

  emit(name) {
    const fn = Eplayer.subs[name]
    fn && fn.call(this, this.shadowRoot)
  }

}

Eplayer.subs = {}

Eplayer.use = function (name, cb) {
  this.subs[name] = cb
}


function getTimeStr(time) {
  let h = Math.floor(time / 3600)
  let m = Math.floor((time % 3600) / 60)
  let s = Math.floor(time % 60)
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}

function isFullScreen() {
  return document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen
}

; (function () {
  let link = document.createElement('script')
  link.setAttribute('src', 'https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_34101_11.6161dfd06f46009a9dea0fcffc6234bf.js')
  document.head.appendChild(link)
})()

customElements.define('e-player', Eplayer)
