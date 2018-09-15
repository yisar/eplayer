export class Init {
  constructor(el, data) {
    let html = `
    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_ouzixiva2b.css">
    <style>
      #player {
        background:#000;
        width: 800px;
        height: 450px;
        margin: 100px auto;
        position: relative;
      }
      #player video {
        width: 100%;
        height: 100%;
      }
      .panel {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .wrap{
        height: 100%;
        width: 100%;
      }
      .panels .epicon {
        font-size: 80px
      }
      .controls {
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        position: relative;
        bottom: 50px;
      }
      .control{
        padding: 0 15px
      }
      .progress {
        flex: 1;
        height: 5px;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        position: relative;
        cursor: pointer;
      }
      .dot {
        height: 13px;
        width: 13px;
        margin-left:-7px;
        background: ${data.themeColor};
        position: absolute;
        border-radius: 50%;
        top: -4px;
      }
      .current-progress {
        width: 0%;
        height: 100%;
        background: ${data.themeColor};
      }
      .time {
        text-align: center;
        font-size: 12px;
        color: #fff;
        padding-left: 18px;
      }
      .ep-play,
      .ep-pause {
        font-size: 30px;
      }
      .ep-full {
        font-size: 24px;
        padding: 0 8px;
      }
      .epicon:hover {
        color: #fff;
      }
      .epicon {
        color: rgba(255, 255, 255, 0.8);
        cursor: pointer;
        transition: 0.3s;
      }
    </style>

    <video src="${data.src}" id="video"></video>
      <div class="panels">
        <i class="epicon ep-play panel" style:"display:none;"></i>
      </div>
      <div class="controls">
        <div class="control">
          <i class="epicon ep-play switch"></i>
        </div>
        <div class="progress">
          <div class="current-progress"></div>
          <div class="dot"></div>
        </div>
        <div class="time">
          <span class="current">00:00</span>
          /
          <span class="total">00:00</span>
        </div>
        <div class="control">
          <i class="epicon ep-full full"></i>
        </div>  
      </div>
    `
    el.innerHTML = html
  }
}
