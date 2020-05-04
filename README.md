<p align="center"><img src="http://ww1.sinaimg.cn/large/0065Zy9egy1fvcjfzaa1lj30dw0dwwhe.jpg" alt="eplayer logo" width="200px"></p>

# eplayer [![Financial Contributors on Open Collective](https://opencollective.com/eplayer/all/badge.svg?label=financial+contributors)](https://opencollective.com/eplayer) [![NPM version](https://img.shields.io/npm/v/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer) [![NPM downloads](https://img.shields.io/npm/dt/eplayer.svg?style=flat-square)](https://npmjs.com/package/eplayer)

:dart: A web-components html5 video player facing future.

#### who use eplayer？

[eplayer.js.org - demo](https://eplayer.js.org/)

[clicli.us - C 站](https://www.clicli.us/)

[ayypd.cn - 爱看动漫网](http://sp.ayypd.cn/)

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
  import Eplayer from 'https://unpkg.com/eplayer?module'
  //注册 customElement
  customElements.define('e-player', Eplayer)
</script>
```

3. 可选定制 css，用于穿透 shadow-dom 预留的默认样式

```css
e-player {
  /* 主题色 默认为 clicli 同款基佬紫*/
  --theme: #00fff6;
  /* 进度条底色 一般不用设置 */
  --progress: rgba(255, 255, 255, 0.3);
  /* 进度条偏移颜色 一般不用设置 */
  --buffer: rgba(255, 255, 255, 0.6);
  /* 图标颜色 一般不用设置 */
  --icons: rgba(255, 255, 255, 0.6);
}
```

4. 可选定制插件，会在右击菜单中出现一个选项，触发点击事件

```js
Eplayer.use('github源码', ep => {
  // ep 为 shdow-root 元素
  window.location.href = 'https://github.com/132yse/eplayer'
})
```

#### hls

原生支持 `mp4` 和 `mkv` ,如果需要支持 `m3u8`，需要先引入 `hls.js`

```html
<script src="https://unpkg.com/hls.js"></script>
```

### Npm

```shell
yarn add eplayer -S
```

同样的注册 customElement，但是注意，customElement 只能注册一次，然后还没完，往下看：

#### omim

omim 是腾讯前端框架 [omi](https://github.com/Tencent/omi) 的组件库分支，eplayer 已经集成进去

[戳我戳我](https://github.com/Tencent/omi/tree/master/packages/omim/demos/player)

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

比如，下面这个 fre 的粒子

```js
function EPlayer({ src, type }) {
  const [url, setUrl] = useState(0)
  useEffect(() => {
    fetch(`https://jx.clicli.us/jx?url=${src}@dogecloud`)
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
      })
  }, [])
  return <e-player src={url} type={type} />
}
```

完整代码在这里：[fre-eplayer](https://github.com/cliclitv/fre-eplayer)

#### Angular

在 `angular.json` 中添加 `webcomponentsjs` 和 `hls.js`

```json
...
"scripts": [
  "node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js",
  "node_modules/hls.js/dist/hls.min.js"
]
...
```

在 `app.component.ts` 中引入 `eplayer`

```ts
import { Component, OnInit } from "@angular/core";
import Eplayer from "eplayer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    customElements.define("e-player", Eplayer);
  }
}
```

在需要使用 `eplayer` 的模块中启用自定义元素的支持

```ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VideoComponent } from "./video.component";

@NgModule({
  declarations: [VideoComponent],
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideoModule {}
```

在相应的 `html` 文件中对 `src` 和 `type` 绑定

```html
<e-player [attr.src]="src" [attr.type]="type"></e-player>
```

完整项目示例: [@cliclitv/pwa](https://github.com/cliclitv/pwa)

#### ssr

ssr 服务端没有 web-components 的 API，通常 web-components 的 ssr 都会通过一些库去模拟这些 API

eplayer 不推荐这么做，请直接和正常的 html 引入方式一样，引入 cdn

#### 移动端

暂时不支持移动端，等我

#### Screenshot

![](https://ww1.sinaimg.cn/mw690/0065Zy9ely1g9srnm3ezpj31jg0v3kjl.jpg)

## Contributors

感谢大家的 pr，阿里嘎多！

<a href="https://github.com/yisar/eplayer/graphs/contributors"><img src="https://opencollective.com/eplayer/contributors.svg?width=890&button=false" /></a>

