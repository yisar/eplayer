## danmuku.js

### Install
```
yarn add danmu
```

### Use

```javascript
import Danmu from 'danmu'

let data = [{ value: '爱死这破站啦::>_<::', time: 0, color: '#fff' }]
let dm = new Danmu(canvas, video, data)
// 开飞
dm.play()
// 暂停
dm.pause()
// 添加
dm.add({ value: '(⊙o⊙)…', time: 0, color: '#fff' })
// 重置
dm.reset()
```

p.s.

请尽量统一字号，这样有利于排版算法计算，否则将会出现 Acfun 那种弹幕重叠的状态，很违和 √
