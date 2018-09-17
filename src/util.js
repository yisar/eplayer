export function getTimeStr(time) {
  var h = Math.floor(time / 3600)
  var m = Math.floor((time % 3600) / 60)
  var s = Math.floor(time % 60)
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}

export function isFullScreen() {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  )
}

export function copyright() {
  console.log(
    '\n %c EPlayer 0.2.8 %c eplayer.js.org \n',
    'color: #fff; background: linear-gradient(to right,#57a1fc ,#6beaf7); padding:5px;',
    'color: #7192c3; background: #ecfaff; padding:5px 0;'
  )
}

export function isSafari(){
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
}