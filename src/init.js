export class Init {
  constructor(el, data) {
    let html = `
    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_g9ctpaubgfq.css">
    <style>
      .eplayer {
        background:#000;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .eplayer video {
        width: 100%;
        height: 100%;
      }
      .eplayer .panel {
        position: absolute;
        top: 0
      }
      .eplayer .panel .ep-play ,.eplayer .panels .epicon{
        font-size: 80px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .eplayer .wrap {
        height: 100%;
        width: 100%;
      }
      .eplayer .controls {
        width: 100%;
        position: absolute;
        bottom: 0;
        padding: 0 15px;
        box-sizing: border-box;
        transition: .3s ease-out;
      }

      .eplayer .msg{
        display: none;
        position: absolute;
        bottom: 60px;
        left: 20px;
        background: rgba(0,0,0,.8);
        color: #fff;
        padding: 5px 30px;
        border-radius: 4px;
        transition: .5s;
      }
      .eplayer .option {
        position: relative;
        display:flex;
        align-items: center;
        padding: 10px 0;
      }
      .eplayer .option-left{
        display: flex;
        flex: 1;
        align-items: center;
      }
      .eplayer .option-right{
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end
      }
      .eplayer .progress-bar {
        width: 100%;
        position: relative;
        cursor: pointer;
      }
      .eplayer .volume-progress-bar {
        width: 100px;
        position: relative;
        cursor: pointer;
      }
      .eplayer .volume-progress {
        border-radius:2px;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      .eplayer .progress {
        border-radius:2px;
        height: 4px;
        background-color: rgba(255, 255, 255, 0.8);
      }
      .eplayer .dot {
        padding: 20px;
        position: absolute;
        top: -18px;
        left: -18px;
        transition: 0.01s
      }
      .eplayer .dot i {
        height: 13px;
        width: 13px;
        background: ${data.themeColor};
        position: absolute;
        border-radius: 50%;
        top: 50%;
        left:50%;
        transform:translate(-50%,-50%)
      }
      .eplayer .volume {
        display: flex;
        align-items: center;
        padding-right: 15px;
      }
      .eplayer .current-progress {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        position: absolute;
        border-radius:2px;
        top: 0;
        transition: .1s
      }
      .eplayer .buffer {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
        opacity:.4;
        position: absolute;
        border-radius:2px;
        top: 0;
        transition: .3s;
      }
      .eplayer .time {
        text-align: center;
        font-size: 12px;
        color: #fff;
        padding-left: 15px;
      }
      .eplayer .epicon:hover {
        color: #fff;
      }
      .eplayer .epicon {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: 0.3s;
        font-size: 20px;
      }
      .eplayer .ep-volume-down,.ep-volume-up,.ep-volume-off {
        padding-right: 15px
      }
      .eplayer .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin:-20px 0 0 -20px;
        width: 40px;
        height: 40px;
        border: 2px solid;
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
    </style>
    <div class="eplayer">
      <video src="${
        data.src
      }" webkit-playsinline playsinline x5-playsinline x-webkit-airplay="allow"></video>
        <div class="panels">
          <div class="loading"></div>
          <div class="panel wrap">
            <i class="epicon ep-play" style="display:none;"></i>
          </div>
          <div class="msg">
          </div>
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
