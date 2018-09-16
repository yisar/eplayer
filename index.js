import Eplayer from './src/eplayer'

let el = document.getElementById('player')

let ep = new Eplayer(el, {
  src: 'https://new.jsyunbf.com/20180809/sT5p3w5X/index.m3u8',
  themeColor: 'linear-gradient(to right,#0072ff ,#00e7ff)',
  hls:true
})


