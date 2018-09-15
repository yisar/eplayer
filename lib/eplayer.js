'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getTimeStr = getTimeStr;
exports.isFullScreen = isFullScreen;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getTimeStr(time) {
  var h = Math.floor(time / 3600);
  var m = Math.floor(time % 3600 / 60);
  var s = Math.floor(time % 60);
  h = h >= 10 ? h : '0' + h;
  m = m >= 10 ? m : '0' + m;
  s = s >= 10 ? s : '0' + s;
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s;
}

function isFullScreen() {
  return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
}

var Init = function Init(el, data) {
  _classCallCheck(this, Init);

  var html = '\n    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_ouzixiva2b.css">\n    <style>\n      #player {\n        background:#000;\n        width: 800px;\n        height: 450px;\n        margin: 100px auto;\n        position: relative;\n      }\n      #player video {\n        width: 100%;\n        height: 100%;\n      }\n      .panel {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%,-50%);\n      }\n      .wrap{\n        height: 100%;\n        width: 100%;\n      }\n      .panels .epicon {\n        font-size: 80px\n      }\n      .controls {\n        display: flex;\n        align-items: center;\n        width: 100%;\n        height: 40px;\n        position: relative;\n        bottom: 50px;\n      }\n      .control{\n        padding: 0 15px\n      }\n      .progress {\n        flex: 1;\n        height: 5px;\n        width: 100%;\n        background-color: rgba(255, 255, 255, 0.8);\n        position: relative;\n        cursor: pointer;\n      }\n      .dot {\n        height: 13px;\n        width: 13px;\n        margin-left:-7px;\n        background: ' + data.themeColor + ';\n        position: absolute;\n        border-radius: 50%;\n        top: -4px;\n      }\n      .current-progress {\n        width: 0%;\n        height: 100%;\n        background: ' + data.themeColor + ';\n      }\n      .time {\n        text-align: center;\n        font-size: 12px;\n        color: #fff;\n        padding-left: 18px;\n      }\n      .ep-play,\n      .ep-pause {\n        font-size: 30px;\n      }\n      .ep-full {\n        font-size: 24px;\n        padding: 0 8px;\n      }\n      .epicon:hover {\n        color: #fff;\n      }\n      .epicon {\n        color: rgba(255, 255, 255, 0.8);\n        cursor: pointer;\n        transition: 0.3s;\n      }\n      .loading{\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        margin:-20px 0 0 -20px;\n        width: 40px;\n        height: 40px;\n        border: 5px solid;\n        border-color: rgba(255, 255, 255, 0.8) rgba(255, 255, 255, 0.8) transparent;\n        border-radius: 50%;\n        box-sizing: border-box;\n        animation: loading 1s linear infinite;\n      }\n      @keyframes loading{\n          0%{\n              transform: rotate(0deg);\n          }\n          100%{\n              transform: rotate(360deg);\n          }\n      }\n    </style>\n\n    <video src="' + data.src + '" id="video"></video>\n      <div class="panels">\n        <div class="loading"></div>\n        <i class="epicon ep-play panel" style="display:none;"></i>\n      </div>\n      <div class="controls">\n        <div class="control">\n          <i class="epicon ep-play switch"></i>\n        </div>\n        <div class="progress">\n          <div class="current-progress"></div>\n          <div class="dot"></div>\n        </div>\n        <div class="time">\n          <span class="current">00:00</span>\n          /\n          <span class="total">00:00</span>\n        </div>\n        <div class="control">\n          <i class="epicon ep-full full"></i>\n        </div>  \n      </div>\n    ';
  el.innerHTML = html;
};

var Hls = function Hls(el, data) {
  _classCallCheck(this, Hls);

  this.src = data.src;
  this.el = el;

  var _Hls = require('hls.js');

  if (_Hls.isSupported()) {
    var hls = new _Hls();
    hls.loadSource(this.src);
    hls.attachMedia(this.el);
  }
};

var Eplayer = function () {
  function Eplayer(el, data) {
    var _this = this;

    _classCallCheck(this, Eplayer);

    this.el = el;
    this.data = data;

    new Init(this.el, this.data);

    this.video = document.querySelector('video');
    this.loading = document.querySelector('.loading');
    this.isPlay = document.querySelector('.switch');
    this.panel = document.querySelector('.panel');
    this.totalTime = document.querySelector('.total');
    this.currentTime = document.querySelector('.current');
    this.dot = document.querySelector('.dot');
    this.full = document.querySelector('.full');
    this.progress = document.querySelector('.progress');
    this.currentProgress = document.querySelector('.current-progress');

    if (data.hls) {
      new Hls(this.video, this.data);
    }

    this.tTime = 0;

    this.video.onwaiting = function () {
      return _this.waiting();
    };
    this.video.oncanplay = function () {
      return _this.canplay();
    };
    this.isPlay.onclick = function () {
      return _this.play();
    };
    this.panel.onclick = function () {
      return _this.play();
    };
    this.video.ontimeupdate = function () {
      return _this.timeupdate();
    };
    this.progress.onclick = function (e) {
      return _this.progressClick(e);
    };
    this.video.onended = function () {
      return _this.ended();
    };
    this.full.onclick = function () {
      return _this.fullScreen();
    };
  }

  _createClass(Eplayer, [{
    key: 'waiting',
    value: function waiting() {
      this.loading.style.display = 'block';
    }
  }, {
    key: 'canplay',
    value: function canplay() {
      this.tTime = this.video.duration;
      this.loading.style.display = 'none';
      var tTimeStr = getTimeStr(this.tTime);
      this.totalTime.innerHTML = tTimeStr;
    }
  }, {
    key: 'play',
    value: function play() {
      if (this.video.paused) {
        this.video.play();
        this.isPlay.classList.remove('ep-play');
        this.isPlay.classList.add('ep-pause');
        this.panel.classList.remove('ep-play');
        this.panel.classList.add('wrap');
      } else {
        this.video.pause();
        this.isPlay.classList.remove('ep-pause');
        this.isPlay.classList.add('ep-play');
        this.panel.style.display = 'block';
        this.panel.classList.remove('wrap');
        this.panel.classList.add('ep-play');
      }
    }
  }, {
    key: 'timeupdate',
    value: function timeupdate() {
      var cTime = this.video.currentTime;
      var cTimeStr = getTimeStr(cTime);
      this.currentTime.innerHTML = cTimeStr;
      var offsetPre = cTime / this.tTime * 100 + '%';
      this.currentProgress.style.width = offsetPre;
      this.dot.style.left = offsetPre;
    }
  }, {
    key: 'progressClick',
    value: function progressClick(e) {
      var event = e || window.event;
      this.video.currentTime = event.offsetX / this.progress.offsetWidth * this.video.duration;
    }
  }, {
    key: 'ended',
    value: function ended() {
      this.isPlay.classList.remove('ep-pause');
      this.isPlay.classList.add('ep-play');
      this.currentProgress.style.width = 0;
      this.dot.style.left = 0;
      this.currentTime.innerHTML = getTimeStr();
      this.video.currentTime = 0;
    }
  }, {
    key: 'fullScreen',
    value: function fullScreen() {
      if (isFullScreen()) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        var rfs = this.el.requestFullScreen || this.el.webkitRequestFullScreen || this.el.mozRequestFullScreen || this.el.msRequestFullscreen;

        return rfs.call(this.el);
      }
    }
  }]);

  return Eplayer;
}();

exports.default = Eplayer;