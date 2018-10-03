import Eplayer from './src/eplayer'

let el = document.getElementById('ep')

let ep = new Eplayer(el, {
  src: './demo.flv',
  themeColor: 'linear-gradient(to right,#0072ff ,#00e7ff)'
})