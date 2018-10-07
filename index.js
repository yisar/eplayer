import Eplayer from './src/eplayer'

let el = document.getElementById('ep')

let ep = new Eplayer(el, {
  src: 'https://gss3.baidu.com/6LZ0ej3k1Qd3ote6lo7D0j9wehsv/tieba-smallvideo/3_7c75cc27d8640ccda5a08e63cc9c9346.mp4',
  themeColor: 'linear-gradient(to right,#0072ff ,#00e7ff)'
})