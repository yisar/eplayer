<p align="center"><img src="http://ww1.sinaimg.cn/large/0065Zy9egy1fvcjfzaa1lj30dw0dwwhe.jpg" alt="eplayer logo" width="200px"></p>

# eplayer [![NPM version](https://img.shields.io/npm/v/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer) [![NPM downloads](https://img.shields.io/npm/dm/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

:dart: A web-components html5 video player facing future.

#### who use eplayer？

[eplayer.js.org - demo](https://eplayer.js.org/)

[clicli.us - C 站](https://www.clicli.us/)

[ayypd.cn - 爱看动漫网](http://www.ayypd.cn/)

### Use

0. ep 基于 web-component，为了兼容，需要事先引入 polyfill

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs"></script>
```

1. 插入 `e-player` 标签，没错，只需要将平时用的 `video` 换成 `e-player` 即可

```html
<e-player src="./001.mp4"></e-player>
```

type 属性可选，默认为 mp4，支持 hls 和 flv

2. 注册 `customElement`，注意 `type=module`，使用 es6 的 import

```html
<script type="module">
  import { Eplayer } from 'https://unpkg.com/eplayer'
  //注册 customElement
  customElements.define('e-player', Eplayer)
</script>
```

3. 可选定制 css，用于穿透 shadow-dom 预留的默认样式

```css
e-player {
  /* 主题色 默认为 clicli 同款青*/
  --theme: #00fff6;
  /* 进度条底色 一般不用设置 */
  --progress: rgba(255, 255, 255, 0.3);
  /* 进度条偏移颜色 一般不用设置 */
  --buffer: rgba(255, 255, 255, 0.6);
  /* 图标颜色 一般不用设置 */
  --icons: rgba(255, 255, 255, 0.6);
}
```

#### hls

原生支持 `mp4` 和 `mkv` ,如果需要支持 `m3u8`，需要先引入 `hls.js`

```html
<script src="https://unpkg.com/hls.js"></script>
```

## Npm

```shell
yarn add eplayer -S
```

同样的注册 customElement，但是注意，customElement 只能注册一次，然后还没完，往下看：

#### Vue

vue 默认是不支持 web-components 的，它无法主动判断含有`-`的是 vue 组件还是 web 组件

所以需要手动配置，忽略掉`e-player`

```JavaScript
Vue.config.ignoredElements = [
  'e-player'
]
```

然后，同样需要引入上面的几个文件，然后 bind 一下 src 和 type

```html
<e-player :src="url" :type="type"></e-player>
```

可以封装成 vue 组件来使用：[vue-web-components-wrapper](https://github.com/vuejs/vue-web-component-wrapper)

#### React / Fre

react 直接支持 customElement，直接在 render 函数中`e-player`标签

同样的，JSX 并不把它当作 vnode tree 的孩子，需要手动操作 dom，通常使用 ref

```Javascript
export function Eplayer(...props){
  const $ep = useRef(null)
  useEffect(()=>{
    ep.shadowRoot.video.load() //重载
  },[type,srcf])
  return <e-player ref={$ep} src={src} type={type}></e-player>
}
```

#### ssr

ssr 服务端没有 web-components 的 API，通常 web-components 的 ssr 都会通过一些库去模拟这些 API

eplayer 不推荐这么做，请直接和正常的 html 引入方式一样，引入 cdn

#### 移动端

暂时不支持移动端，急需 pr 嘿嘿

#### Screenshot

![](https://ws1.sinaimg.cn/mw690/0065Zy9egy1g0noauajzej31jm0vakjl.jpg)
