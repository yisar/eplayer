<p align="center"><img src="http://ww1.sinaimg.cn/large/0065Zy9egy1fvcjfzaa1lj30dw0dwwhe.jpg" alt="eplayer logo" width="200px"></p>


# eplayer   [![NPM version](https://img.shields.io/npm/v/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer) [![NPM downloads](https://img.shields.io/npm/dm/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

:dart: A web-components html5 video player facing future.

#### who use eplayer？

[epayer.js.org - 官网（demo）](https://eplayer.js.org/)

[clicli.us - C 站](https://www.clicli.us/)

### Install
```shell
yarn add eplayer -S
```

### Use
1. 导入进来 js 文件，可以从 lib 目录获取，如果需要支持国产奇葩浏览器，需要同时引入 polyfill
```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.2.1/webcomponents-bundle.js">
<script src="./eplayer.js"></script>
```

2. 插入 `e-player` 标签，没错，只需要将平时用的 `video` 换成 `e-player` 即可

type 属性可选，默认为 mp4

```html
<e-player src="./001.mp4"></e-player>
```
3. 可选设置css，用于穿透 shadow-dom 预留的默认样式，默认为粉色
```css
e-player {
  /* 进度条底色 */
  --progress:rgba(255,255,255,.3);
  /* 进度条偏移颜色 */
  --buffer:#f2e;
  /* 按钮颜色 */
  --dot:#f2e;
  /* 图标颜色 */
  --icons:#fff
}
```

如果，需要支持 `m3u8` 和 `flv`，需要先引入 `hls.js` 和 `flv.js`

这两个文件太大，建议手动 gzip
```html
<script src="./hlv.min.js"></script>
<script src="./flv.min.js"></script>
```
然后，type 属性 对应 `hls` 或 `flv`
```html
<e-player src="./001.m3u8" type="hls"></e-player>
```

#### development

```shell
yarn start
```

#### Screenshot

![](https://ws1.sinaimg.cn/mw690/0065Zy9egy1fymn1nwo3ej30rq0fmtid.jpg)
