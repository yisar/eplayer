export class Flv {
  constructor(el, data) {
    this.src = data.src
    this.el = el

    const flvjs = require('flv.js').default

    if (flvjs.isSupported()) {
      let flvPlayer = flvjs.createPlayer({
        type: 'flv',
        url: this.src
      })
      flvPlayer.attachMediaElement(this.el)
      flvPlayer.load()
    }
  }
}
