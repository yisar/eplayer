export class Hls {
  constructor(el, data) {
    this.src = data.src
    this.el = el

    const Hls = require('hls.js')

    if (Hls.isSupported()) {
      let hls = new Hls()
      hls.loadSource(this.src)
      hls.attachMedia(this.el)
    }
  }
}
