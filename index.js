import Eplayer from './src/eplayer'

let el = document.getElementById('player')

let ep = new Eplayer(el, {
  src: '001.mp4',
  themeColor: '#FF005E',
  hls: true
})


