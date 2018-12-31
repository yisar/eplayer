## danmuku.js

### Use

```javascript
let data = [{ value: '爱死这破站啦::>_<::', time: 0, color: '#fff' }]
let dm = new Danmuku(canvas, video, data)
//添加弹幕
dm.add({ value: '(⊙o⊙)…', time: 0, color: '#fff' })
```

p.s.

请尽量统一字号，这样有利于计算排版，否则将会出现 Acfun 那种弹幕重叠的状态，很违和 √
