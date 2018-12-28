const FONTCDN = 'https://at.alicdn.com/t/font_836948_6lbb2iu59.css'
class Eplayer {
  constructor(data) {
    customElements.define(
      'e-player',
      class extends HTMLElement {
        constructor() {
          super()
          this.data = data
          this.init()
        }
        waiting() {
          this.$('.loading').style.display = 'block'
        }
        canplay() {
          this.$('.loading').style.display = 'none'
          this.$('.total').innerHTML = getTimeStr(this.video.duration)
        }
        play() {
          if (this.video.paused) {
            this.video.play()
            this.$('.ep-video').style.display = 'none'
            this.$('.is-play').classList.remove('ep-play')
            this.$('.is-play').classList.add('ep-pause')
          } else {
            this.video.pause()
            this.$('.ep-video').style.display = 'block'
            this.$('.is-play').classList.remove('ep-pause')
            this.$('.is-play').classList.add('ep-play')
          }
          return false
        }
        volume() {
          if (this.video.muted) {
            this.video.muted = false
            this.$('.is-volume').classList.remove('ep-volume-off')
            this.$('.is-volume').classList.add('ep-volume')
          } else {
            this.video.muted = true
            this.$('.is-volume').classList.remove('ep-volume')
            this.$('.is-volume').classList.add('ep-volume-off')
          }
          return false
        }
        update() {
          let cTime = getTimeStr(this.video.currentTime)
          if (this.video.buffered.length) {
            let bufferEnd = this.video.buffered.end(
              this.video.buffered.length - 1
            )
            this.$('.buffer').style.width =
              (bufferEnd / this.video.duration) *
                this.$('.progress').clientWidth +
              'px'
          }
          let offset =
            (this.video.currentTime / this.video.duration) *
            this.$('.bg').clientWidth
          this.$('.now').innerHTML = cTime
          this.$('.current').style.width = offset + 'px'
          this.$('.dot').style.left = offset + 4 + 'px'
        }
        progress(e) {
          let offset = e.offsetX / this.$('.progress').offsetWidth
          this.video.currentTime = this.video.duration * offset
          return false
        }
        down(e) {
          this.disX = e.clientX - this.$('.dot').offsetLeft
          document.onmousemove = e => this.move(e)
          document.onmouseup = () => {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
        move(e) {
          let offset = e.clientX - this.disX
          if (offset < 4) offset = 4
          if (offset > this.$('.progress').clientWidth + 4)
            offset = this.$('.progress').clientWidth + 4
          this.$('.current').style.width = offset - 4 + 'px'
          this.$('.dot').style.left = offset + 'px'
          this.video.currentTime =
            (offset / (this.$('.progress').clientWidth + 4)) *
            this.video.duration
        }
        alow() {
          clearTimeout(this.timer)
          this.$('.controls').style.bottom = 0
          this.$('.dot').style.bottom = 39 + 'px'
          this.$('.ep-video').style.bottom = 70 + 'px'
          this.timer = setTimeout(() => {
            this.$('.controls').style.bottom = -43 + 'px'
            this.$('.dot').style.bottom = -43 + 'px'
            this.$('.ep-video').style.bottom = 25 + 'px'
          }, 5000)
        }
        end() {
          this.$('.is-play').classList.remove('ep-pause')
          this.$('.is-play').classList.add('ep-play')
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
          } else {
            let rfs =
              this.requestFullScreen ||
              this.webkitRequestFullScreen ||
              this.mozRequestFullScreen ||
              this.msRequestFullscreen

            return rfs.call(this)
          }
        }
        init() {
          let link = document.createElement('link')
          link.setAttribute('href', FONTCDN)
          link.setAttribute('rel', 'stylesheet')
          document.head.appendChild(link)
          let html = `
            <style>
              @import "${FONTCDN}";
              *{
                padding:0;
                margin:0;
              }
              .eplayer,video{
                height:100%;
                width:100%;
                color:var(--icon,rgba(255,255,255,0.6));
                font-size:12px;
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
                padding:10px;
                background:linear-gradient(transparent,rgba(0,0,0,.4));
                cursor: pointer; 
                transition: .3s ease-out;      
              }
              .progress{
                position:relative;
                bottom:15px;
                left:0;
                right:0;
              }
              .options{
                display:flex;
                align-items:center;
              }
              .epicon{
                color:var(--icon,rgba(255,255,255,0.6));
                padding:0 10px;
              }
              .epicon{
                font-size:18px;
                transition: .3s;
              }
              .epicon:hover{
                color:#fff;
              }
              .time{
                position:relative;
                top:-2px;
              }
              .time b{
                font-weight:normal;
              }
              .line{
                padding:0 1px;
                margin-bottom: -2px
              }
              .line i{
                width:4px;
                border-radius:4px;
                display: inline-block;
                background: var(--icon,rgba(255,255,255,0.6));
                height: 12px;
                transform:scaleX(0.7);
                transition: .3s;
              }
              .line:hover i{
                height:14px;
                background:var(--corlor,#f13e7b);
              }
              .active i{
                background:var(--corlor,#f13e7b);
              }
              .left{
                flex:1;
              }
              .right{
                flex:1;
                display:flex;
                align-items:center;
                justify-content: flex-end;
              }
              .bg,.current,.buffer{
                left:0;
                height:4px;
                transform:scaleY(0.7);
                position:absolute;
                top:0;
              }
              .bg{
                right:0;
                background:rgba(255,255,255,.2);
              }
              .current{
                background:var(--corlor,#f13e7b);
              }
              .buffer{
                background:rgba(255,255,255,.4);
              }
              .dot{
                position:absolute;
                left:10px;
                bottom:39px;
                border-radius: 50%;
                display: block;
                background:var(--corlor,#f13e7b);
                padding: 4px;
                cursor:pointer;
                transition: .1s ease-out;
              }
              @keyframes loading{
                0%{
                  transform: rotate(0deg);
                }
                100%{
                  transform: rotate(360deg);
                }  
              }
              .loading {
                position: absolute;
                top: 50%;
                left: 50%;
                margin:-20px 0 0 -20px;
                width: 40px;
                height: 40px;
                box-shadow: 0px 2px rgba(255,255,255,.8);
                border-radius: 50%;
                animation: loading 1s linear infinite;
              }
              .ep-video {
                position: absolute;
                bottom: 25px;
                right: 20px;
                font-size:40px;
                color:rgba(255,255,255,.6);
                cursor: pointer; 
              }
            </style>
            <div class="eplayer">
              <video id="video" src="${this.data.url}">
                <source src="${this.data.url}" type="video/${
            this.data.type ? this.data.type : 'mp4'
          }">
              </video>
              <div class="controls" style="bottom:-45px">
                <div class="progress">
                  <b class="bg"></b>
                  <b class="buffer"></b>
                  <b class="current" style="width:0"></b>
                </div>
                <div class="options">
                  <div class="left">
                    <i class="epicon ep-play is-play"></i>
                    <span class="time">
                      <b class="now">00:00</b> / <b class="total">00:00</b>
                    </span>
                  </div>
                  <div class="right">
                    <i class="epicon ep-volume is-volume"></i>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <span class="line"><i></i></span>
                    <i class="epicon ep-full"></i>
                  </div>
                </div>
              </div>
              <i class="dot" style="left:4px;bottom:-45px"></i>
              <div class="loading"></div>
              <div class="epicon ep-video"></div>
            </div>
          `
          let template = document.createElement('template')
          template.innerHTML = html
          this.attachShadow({
            mode: 'open'
          }).appendChild(template.content.cloneNode(true))
          this.video = this.$('video')
          this.video.volume = 0.5
          setVolume(this.video.volume * 10, this.$('.line'))

          this.$('.is-volume').onclick = () => this.volume()
          this.$('.line').forEach((item, index) => {
            item.onclick = () => {
              this.video.volume = index / 10
              setVolume(index + 1, this.$('.line'))
            }
          })
          this.$('.dot').onmousedown = e => this.down(e)
          this.$('.progress').onclick = e => this.progress(e)
          this.video.onwaiting = () => this.waiting()
          this.video.oncanplay = () => this.canplay()
          this.video.ontimeupdate = () => this.update()

          this.$('.eplayer').onmousemove = () => this.alow()
          this.$('.ep-full').onclick = () => this.full()
          this.$('.ep-video').onclick = this.$('.is-play').onclick = () =>
            this.play()
          this.video.onended = () => this.ended()
        }

        $(node) {
          let dom = this.shadowRoot.querySelectorAll(node)
          return dom.length > 1 ? dom : dom[0]
        }
      }
    )
  }
}

function getTimeStr(time) {
  var h = Math.floor(time / 3600)
  var m = Math.floor((time % 3600) / 60)
  var s = Math.floor(time % 60)
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}

function setVolume(index, node) {
  for (let j = index; j < node.length; j++) {
    node[j].classList.remove('active')
  }
  for (let i = 0; i < index; i++) {
    node[i].classList.add('active')
  }
}

function isFullScreen() {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  )
}
