export class Init {
  constructor(el, data) {
    let html = `
    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_8so67ueev32.css">
    <style>
      #player {
        background:#000;
        width: 100%;
        height: 100%;
        position: relative;
      }
      #player video {
        width: 100%;
        height: 100%;
      }
      #player .panel {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      #player .wrap {
        height: 100%;
        width: 100%;
      }
      #player .panels .epicon {
        font-size: 80px
      }
      #player .controls {
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: 0 15px;
        box-sizing: border-box;
      }
      #player .option {
        position: relative;
        display:flex;
        align-items: center;
        padding: 10px 0;
      }
      #player .option-left{
        display: flex;
        flex: 1;
        align-items: center;
      }
      #player .option-right{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end
      }
      #player .progress-bar {
        width: 100%;
        position: relative;
        cursor: pointer;
      }
      #player .volume-progress-bar {
        width: 100px;
        position: relative;
        cursor: pointer;
      }
      #player .volume-progress {
        height: 5px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      #player .progress {
        height: 5px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      #player .dot {
        padding: 20px;
        position: absolute;
        top: -18px;
        left: -18px;
      }
      #player .dot i {
        height: 13px;
        width: 13px;
        background: ${data.themeColor};
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left:50%;
        transform:translate(-50%,-50%)
      }
      #player .volume {
        display: flex;
        align-items: center;
        padding-right: 15px;
      }
      #player .current-progress {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        position: absolute;
        top: 0;
      }
      #player .buffer {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        opacity:.4;
        position: absolute;
        top: 0;
      }
      #player .time {
        text-align: center;
        font-size: 12px;
        color: #fff;
        padding-left: 15px;
      }
      #player .epicon:hover {
        color: #fff;
      }
      #player .epicon {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: 0.3s;
        font-size: 24px;
      }
      #player .ep-volume-down,.ep-volume-up,.ep-volume-off {
        padding-right: 15px
      }
      #player .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin:-20px 0 0 -20px;
        width: 40px;
        height: 40px;
        border: 5px solid;
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
    <div id="player">
      <video src="${data.src}" id="video"></video>
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


