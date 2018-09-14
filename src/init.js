export class Init {
  constructor(el, data) {
    let html = `
    <video src="${data.src}" id="video"></video>
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
