import Eplayer from './src/eplayer'

let el = document.getElementById('ep')

let ep = new Eplayer(el, {
  src: 'https://api.dogecloud.com/player/get.m3u8?vcode=6b001ac5f0560207&userId=1&vtype=10&ext=.m3u8',
  themeColor: 'linear-gradient(to right,#0072ff ,#00e7ff)'
})