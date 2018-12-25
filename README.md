<p align="center"><img src="http://ww1.sinaimg.cn/large/0065Zy9egy1fvcjfzaa1lj30dw0dwwhe.jpg" alt="eplayer logo" width="200px"></p>

[![NPM version](https://img.shields.io/npm/v/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

[![NPM downloads](https://img.shields.io/npm/dm/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

# eplayer

:dart: A simple and lovely html5 video player

#### who use eplayer？

[clicli.us - C 站](https://www.clicli.us/)

### Install
```shell
yarn add eplayer -S
```

### Use

dom，这是一个 web-components 组件

```html
<e-player></e-player>
```
css，可选，用于穿透 shadow-dom 预留的默认样式，默认为蓝色
```css
e-player{
  /* 进度条底色 */
  --progress:rgba(255,255,255,.3)
  /* 进度条偏移颜色 */
  --buffer:#f2e
  /* 按钮颜色 */
  --button:#f2e
  /* 图标颜色 */
  --icon:#fff
}
```

js，需要定义一个 `customElements`，并将 Ep 类传入

```javascript
import Eplayer from 'eplayer'

customElements.define('e-player',new Eplayer({
  src: '001.mp4',
  type:'mp4'
})
```

if m3u8 need supported，please install `hls.js` first

```shell
npm i hls.js -S
```

#### development

```shell
yarn start
```

#### Screenshot

![free eplayer](http://wx3.sinaimg.cn/mw690/0060lm7Tly1fvbny9g6ycj30rr0fmtol.jpg)
