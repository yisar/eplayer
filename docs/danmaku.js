const SPEED_ARG = 0.009

const defaultDanmakuData = {
    msg: '',
    fontSize: 24,
    fontColor: '#ffffff',
    rollTime: 0,
}

class Danmaku {
    constructor(options) {
        this._container = options.container
        this._totalWidth = null
        this._totalHeight = null
        this._trackSize = 12
        this._renderTimer = null
        this._queue = []
        this._tracks = null
        this._autoId = 0
        this._paused = true
        this.resize()
        this._resetTracks()
        console.log(this._container)
    }

    resize() {
        this._totalWidth = this._container.offsetWidth
        this._totalHeight = this._container.offsetHeight
        this.clearScreen()
    }

    clearScreen() {
        this._clearDanmakuNodes()
        this._resetTracks()
    }

    _resetTracks() {
        const count = Math.floor(this._totalHeight / this._trackSize / 3)
        this._tracks = new Array(count)
        for (let i = 0; i < count; i++) {
            this._tracks[i] = []
        }
    }

    // 循环弹幕节点
    _eachDanmakuNode(fn) {
        let child = this._container.firstChild
        let id, y
        while (child) {
            if (child.nodeType === 1) {
                y = child.getAttribute('data-y')
                id = child.getAttribute('data-id')
                if (y && id) { fn(child, Number(y), Number(id)) }
            }
            child = child.nextSibling
        }
    }

    _clearDanmakuNodes() {
        const nodes = []
        this._eachDanmakuNode((node) => {
            nodes.push(node)
        })
        nodes.forEach((node) => {
            this._container.removeChild(node)
        })
    }

    _parseData(data) {
        return Object.assign({
            autoId: ++this._autoId,
            fontSize: Math.floor(Math.random() * 20) + 20
        }, defaultDanmakuData, data)
    }

    add(data) {
        this._queue.push(this._parseData(data))
        // 如果队列轮询已经停止，则启动
        if (!this._renderTimer) { this._render() }
    }

    // 把弹幕数据加到合适的轨道
    _addToTrack(data) {
        // 单条轨道
        let track
        // 轨道的最后一项弹幕数据
        let lastItem
        // 弹幕已经走的路程
        let distance
        // 弹幕数据最终坐落的轨道索引
        // 有些弹幕会占多条轨道，所以 y 是个数组
        let y = []

        const now = Date.now()

        for (let i = 0; i < this._tracks.length; i++) {
            track = this._tracks[i]

            if (track.length) {
                // 轨道被占用，要计算是否会重叠
                // 只需要跟轨道最后一条弹幕比较即可
                lastItem = track[track.length - 1]

                // 计算已滚动距离
                distance = lastItem.rollSpeed * (now - lastItem.startTime) / 1000

                // 通过速度差，计算最后一条弹幕全部消失前，是否会与新增弹幕重叠
                // 如果不会重叠，则可以使用当前轨道
                if (
                    (distance > lastItem.width) &&
                    (
                        (data.rollSpeed <= lastItem.rollSpeed) ||
                        ((distance - lastItem.width) / (data.rollSpeed - lastItem.rollSpeed) >
                            (this._totalWidth + lastItem.width - distance) / lastItem.rollSpeed)
                    )
                ) {
                    y.push(i)
                } else {
                    y = []
                }

            } else {
                // 轨道未被占用
                y.push(i)
            }

            // 有足够的轨道可以用时，就可以新增弹幕了，否则等下一次轮询
            if (y.length >= data.useTracks) {
                data.y = y
                y.forEach((i) => {
                    this._tracks[i].push(data)
                })
                break
            }
        }
    }

    // （弹幕飘到尽头后）从轨道中移除对应数据
    _removeFromTrack(y, id) {
        y.forEach((i) => {
            const track = this._tracks[i]
            for (let j = 0; j < track.length; j++) {
                if (track[j].autoId === id) {
                    track.splice(j, 1)
                    break
                }
            }
        })
    }

    // 通过 y 和 id 获取弹幕数据
    _findData(y, id) {
        const track = this._tracks[y]
        for (let j = 0; j < track.length; j++) {
            if (track[j].autoId === id) {
                return track[j]
            }
        }
    }

    // 轮询渲染
    _render() {
        if (this._paused) { return }
        try {
            this._renderToDOM()
        } finally {
            this._renderEnd()
        }
    }

    _renderToDOM() {
        let count = Math.floor(this._tracks.length / 3), i = 0

        while (count && i < this._queue.length) {
            const data = this._queue[i]
            let node = data.node

            if (!node) {
                // 弹幕节点基本样式
                data.node = node = document.createElement('div')
                node.innerText = data.msg
                node.style.position = 'absolute'
                node.style.left = '100%'
                node.style.whiteSpace = 'nowrap'
                node.style.color = data.fontColor
                node.style.fontSize = data.fontSize + 'px'
                node.style.willChange = 'transform'
                this._container.appendChild(node)

                data.useTracks = Math.ceil(node.offsetHeight / this._trackSize)
                // 占用的轨道数多于轨道总数，则忽略此数据
                if (data.useTracks > this._tracks.length) {
                    this._queue.splice(i, 1)
                    this._container.removeChild(node)
                    continue
                }

                data.width = node.offsetWidth
                data.totalDistance = data.width + this._totalWidth
                data.rollTime = data.rollTime ||
                    Math.floor(data.totalDistance * SPEED_ARG * (Math.random() * 0.3 + 0.7))
                data.rollSpeed = data.totalDistance / data.rollTime
            }

            this._addToTrack(data)

            if (data.y) {
                this._queue.splice(i, 1)

                node.setAttribute('data-id', data.autoId)
                node.setAttribute('data-y', data.y[0])
                node.style.top = data.y[0] * this._trackSize + 'px'
                node.style.transition = `transform ${data.rollTime}s linear`
                node.style.transform = `translateX(-${data.totalDistance}px)`
                node.addEventListener('transitionstart', () => {
                    data.startTime = Date.now()
                }, false)
                node.addEventListener('transitionend', () => {
                    this._removeFromTrack(data.y, data.autoId)
                    this._container.removeChild(node)
                    this._queue = this._queue.filter(item => item.autoId != data.autoId)
                }, false)

                data.startTime = Date.now() + 80

            } else {
                // 当前弹幕要排队，继续处理下一条
                i++
            }

            count--
        }
    }
    // 轮询结束后，根据队列长度继续执行或停止执行
    _renderEnd() {
        if (this._queue.length > 0) {
            this._renderTimer = requestAnimationFrame(() => {
                this._render()
            })
        } else {
            this._renderTimer = null
        }
    }

    pause() {
        if (this._paused) { return }
        this._paused = true

        this._eachDanmakuNode((node, y, id) => {
            const data = this._findData(y, id)
            if (data) {
                // 获取已滚动距离
                const transform = getComputedStyle(node, null).getPropertyValue('transform')
                data.rolledDistance = -Number(new DOMMatrix(transform).m41)

                // 移除动画，计算出弹幕所在的位置，固定样式
                node.style.transition = ''
                node.style.transform = `translateX(-${data.rolledDistance}px)`
            }
        })
    }

    // 继续滚动弹幕
    resume() {
        if (!this._paused) { return }

        this._eachDanmakuNode((node, y, id) => {
            const data = this._findData(y, id)
            if (data) {
                data.startTime = Date.now()
                // 重新计算滚完剩余距离需要多少时间
                data.rollTime = (data.totalDistance - data.rolledDistance) / data.rollSpeed
                node.style.transition = `transform ${data.rollTime}s linear`
                node.style.transform = `translateX(-${data.totalDistance}px)`
            }
        })

        this._paused = false

        if (!this._renderTimer) { this._render() }
    }
}