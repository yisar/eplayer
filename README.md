<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1fva3l3izvtj30dw0dwjs1.jpg" alt="eplayer logo" width="150px"></p>

[![NPM version](https://img.shields.io/npm/v/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)
[![NPM downloads](https://img.shields.io/npm/dm/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

# eplayer

A simple html5 video player

#### Install

```shell
npm i eplayer -S
```

#### Use

dom:
```html
<div id=player></div>
```
js:
```javascript
import Eplayer from 'eplayer'

const el = document.getElementById('player')

new Eplayer(el, {
  src: '001.mp4',
  themeColor: '#000'
})
```

if m3u8 need supported，please install `hls.js` first

```shell
npm i hls.js -S
```

and `hls` value turns to `true`

```javascript
new Eplayer(el, {
  src: '002.m3u8',
  hls: true
})
```

#### Screenshot
![111](http://wx2.sinaimg.cn/mw690/0060lm7Tly1fva41qp5zkj30rl0fhk7u.jpg)