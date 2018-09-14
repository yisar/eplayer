export function getTimeStr(time) {
  var h = Math.floor(time / 3600)
  var m = Math.floor((time % 3600) / 60)
  var s = Math.floor(time % 60)
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s
}
