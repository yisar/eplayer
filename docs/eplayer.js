class Eplayer extends HTMLElement {
  constructor() {
    super()
    this.doms = {}
    this.src = this.getAttribute('src')
    this.type = this.getAttribute('type')
    this.live = JSON.parse(this.getAttribute('live'))
    this.danmaku = null

    this.init()
    this.stream()
  }

  static get observedAttributes() {
    return ['src', 'type', 'danma', 'live']
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
    if (name === 'danma') {
      this.danmaku.add({
        msg: newVal
      })
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
    if (this.video.paused) {
      this.video.play()
      this.danmaku.resume()
      this.$('.is-play').setAttribute('icon-id', 'pause')
    } else {
      this.video.pause()
      this.danmaku.pause()
      this.$('.is-play').setAttribute('icon-id', 'play')
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
    let offset = e.offsetX / this.$('.progress').offsetWidth
    this.video.currentTime = this.video.duration * offset
  }

  down(e) {
    this.disX = e.clientX - this.$('.cycle').offsetLeft
    document.onpointermove = (e) => this.move(e)
    document.onpointerup = () => {
      document.onpointermove = null
      document.onpointerup = null
    }
  }

  move(e) {
    let offset = e.clientX - this.disX + 7
    if (offset < 0) offset = 0
    if (offset > this.$('.progress').clientWidth) {
      offset = this.$('.progress').clientWidth
    }
    this.$('.current').style.width = offset + 'px'
    this.video.currentTime = (offset / this.$('.progress').clientWidth) * this.video.duration
    document.onpointermove = null
    setTimeout((document.onpointermove = (e) => e && this.move(e)), 30)
  }

  alow() {
    // this.$('.controls').style.bottom = 0
    this.$('.mark').style.cursor = 'default'
  }

  keydown(e) {
    switch (e.keyCode) {
      case 37:
        this.video.currentTime -= 10
        break
      case 39:
        this.video.currentTime += 10
        break
      case 38:
        try {
          this.video.volume = parseInt(this.video.volume * 100) / 100 + 0.05
        } catch (e) { }
        break
      case 40:
        try {
          this.video.volume = parseInt(this.video.volume * 100) / 100 - 0.05
        } catch (e) { }
        break
      case 32:
        this.play()
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
    this.video.playbackRate === 2 ? (this.video.playbackRate = 1) : (this.video.playbackRate = this.video.playbackRate + 0.5)
    this.$('.speed').innerText = this.video.playbackRate + 'x'
  }

  init() {
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
          background:#000
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
          bottom:0;
          background:linear-gradient(transparent,rgba(0,0,0,.5));
          transition: .3s ease-out;
          bottom:-34px;
          z-index:1;   
        }
          .eplayer:hover .controls{
          bottom:0;
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
          .progress:hover .dot,.progress:hover .cycle{
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
          z-index: 999;
          height:100%;
          width:100%;
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
        
      </style>
      
      <div class="eplayer">
      <div class="danmaku"></div>
        <video id="video" class="video" src="${this.src || ''}"></video>
        <div class="mark loading"></div>
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
              <em>倍速</em>
              <em class="pip">画中画</em>
              <iconpark-icon icon-id="volume-ok" size="2rem" class="is-volume"></iconpark-icon>
              <iconpark-icon icon-id="web-fullscreen" size="2rem"></iconpark-icon>
              <iconpark-icon icon-id="fullscreen" size="2rem" class="fullscreen"></iconpark-icon>
            </div>
          </div>
        </div>
        <iconpark-icon icon-id="play"></iconpark-icon>
        <div class="panel"></div>
      </div>
    `
    let template = document.createElement('template')
    template.innerHTML = html
    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true))

    const doms = [
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
      '.cycle',
      '.progress',
      '.controls',
      '.line',
      '.bg',
      '.eplayer',
      '.fullscreen',
      '.panel',
      '.speed',
      '.pip',
      '.danmaku'
    ]

    for (const key of doms) {
      let dom = this.shadowRoot.querySelectorAll(key)
      this.doms[key] = dom.length > 1 ? [...dom] : dom[0]
    }


    for (const name in Eplayer.plugins) {
      const cb = Eplayer.plugins[name]
      let node = document.createElement('li')
      node.innerText = name
      let panel = this.$('.panel')
      panel.appendChild(node)
      node.addEventListener('click', () => cb(this.shadowRoot))
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
      '.pip': this.pip,
    })
    this.delegate('pointerdown', {
      '.cycle': this.down,
      '.mark': this.panel,
    })
    this.delegate('dblclick', {
      '.mark': (e) => {
        clearTimeout(this.timer)
        this.full()
      },
    })
    this.delegate('keydown', this.keydown)
    this.delegate('pointerdown', this.alow)
    this.$('.eplayer').oncontextmenu = () => false
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

}

Eplayer.plugins = {}

Eplayer.use = function (name, cb) {
  this.plugins[name] = cb
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

Eplayer.use('github源码', (ep) => {
  window.location.href = 'https://github.com/132yse/eplayer'
})

customElements.define('e-player', Eplayer)
