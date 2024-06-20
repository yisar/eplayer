

class Mug {
    constructor(beatMap, container) {
        this.container = container
        this.beatMap = beatMap
        this.gameStatus = 0
        this.buttonX = 85

        this.buttonArray = []
        this.imgNumber = 1
        this.fps = 0
        this.score = 0
        this.str = "0"
        this.app = new PIXI.Application(500, 800)
        this.container.appendChild(this.app.view)
        this.app.view.style.width = "100%"



        this.drawUI()

        const buttonArray = this.buttonArray


        container.onkeydown = function (e) {
            if (e && e.keyCode == 68) {
                buttonArray[0].keyDown()
            } else if (e && e.keyCode == 70) {
                buttonArray[1].keyDown()
            } else if (e && e.keyCode == 74) {
                buttonArray[2].keyDown()
            } else if (e && e.keyCode == 75) {
                buttonArray[3].keyDown()
            }
        }
        container.onkeyup = function (e) {
            if (e && e.keyCode == 68) {
                buttonArray[0].keyUp()
            } else if (e && e.keyCode == 70) {
                buttonArray[1].keyUp()
            } else if (e && e.keyCode == 74) {
                buttonArray[2].keyUp()
            } else if (e && e.keyCode == 75) {
                buttonArray[3].keyUp()
            }
        }

        this.app.ticker.add(this.animate.bind(this))
    }

    animate() {
        if (this.gameStatus == 0) {
            return
        }
        this.fps++
        //创建动物

        const head = this.beatMap[0]


        if (head && this.fps == head.fps) {
            console.log(this.fps)
            this.beatMap.shift()
            let button = this.buttonArray[head.button - 1]
            button.createAnimal()
        }

        //图片移动
        for (let i = 0; i < this.buttonArray.length; i++) {
            let button = this.buttonArray[i]
            button.animalMove()
            button.deleteAnimal()
            button.scoreMove()
        }

        if (!head) {
            this.over()
        }
    }

    drawUI() {
        //游戏元素图层
        let gameCeng = new PIXI.Container()
        this.app.stage.addChild(gameCeng)
        //游戏背景
        let bg = new PIXI.Sprite.fromImage("res/beijing.png")
        gameCeng.addChild(bg)
        //ui图层
        let uiCeng = new PIXI.Container()
        this.app.stage.addChild(uiCeng)
        this.uiCeng = uiCeng

        //游戏对象层
        let gameObjectCeng = new PIXI.Container()
        gameCeng.addChild(gameObjectCeng)

        //line 图层
        let lineCeng = new PIXI.Container()
        gameObjectCeng.addChild(lineCeng)

        //兔子图片图层
        let animalCeng = new PIXI.Container()
        gameObjectCeng.addChild(animalCeng)

        //score图层
        let scoreCeng = new PIXI.Container()
        gameObjectCeng.addChild(scoreCeng)

        //点击位置
        let touming = new PIXI.Sprite.fromImage("res/touming.png")
        lineCeng.addChild(touming)
        touming.y = 600
        touming.x = 250
        touming.anchor.set(0.5, 0.5)


        for (let i = 0; i < 4; i++) {
            let button = new Button(this.imgNumber, gameObjectCeng, uiCeng, lineCeng, animalCeng, this.buttonX, this)
            this.buttonX = button.bjt.x + 110
            this.imgNumber++
            this.buttonArray.push(button)
        }


        let style = {
            font: 'bold 40px 微软雅黑',//加粗 倾斜 字号 字体名称
            fill: '#F7EDCA',//颜色
            stroke: '#4a1850',//描边颜色
            strokeThickness: 5,//描边宽度
            dropShadow: true,//开启阴影
            dropShadowColor: '#000000',//阴影颜色
            dropShadowAngle: Math.PI / 6,//阴影角度
            dropShadowDistance: 6,//投影距离
            wordWrap: true,//开启自动换行(注：开启后在文本中空格处换行，如文本中没有空格则不换行)
            wordWrapWidth: 150,//自动换行宽度
        }

        let text = new PIXI.Text("得分 ", style)
        uiCeng.addChild(text)
        text.x = 30
        text.y = 30

        //创建文本
        let scoreTxt = new PIXI.Text(this.str, style)
        this.scoreTxt = scoreTxt
        uiCeng.addChild(scoreTxt)
        scoreTxt.x = 130
        scoreTxt.y = 30

        let startBtn = new PIXI.Sprite.fromImage("res/kaishianniu.png")
        uiCeng.addChild(startBtn)
        startBtn.interactive = true
        startBtn.on("click", () => {
            startBtn.visible = false
            this.gameStatus = 1
        })
        startBtn.on("touchstart", () => {
            startBtn.visible = false
            this.gameStatus = 1
        })
        startBtn.x = 200
        startBtn.y = 400

    }

    over() {
        let gameoverPanel = new PIXI.Sprite.fromImage("res/beiban.png")
        this.uiCeng.addChild(gameoverPanel)
        gameoverPanel.x = 20
        gameoverPanel.y = 100
        gameoverPanel.alpha = 0.9

        let style = {
            font: 'bold 40px 微软雅黑',//加粗 倾斜 字号 字体名称
            fill: '#F7EDCA',//颜色
        }

        //得分
        let scoreTxt = new PIXI.Text(this.score, style)
        gameoverPanel.addChild(scoreTxt)
        scoreTxt.x = 210
        scoreTxt.y = 110

        let restartBtn = new PIXI.Sprite.fromImage("res/fanhuianniu.png")
        gameoverPanel.addChild(restartBtn)
        restartBtn.x = 185
        restartBtn.y = 330
        restartBtn.interactive = true
        restartBtn.on("click", function () {
            window.location.reload()
        })
        restartBtn.on("touchstart", function () {
            window.location.reload()
        })
        this.gameStatus = 0

    }

}

//获取显示对象的世界坐标
function getWorldPosition(displayObject) {
    let x = displayObject.transform.worldTransform.tx
    let y = displayObject.transform.worldTransform.ty
    return { "x": x, "y": y }
}


function Button(imgNumber, gameObjectCeng, uiCeng, lineCeng, animalCeng, buttonX, that) {
    //背景
    this.bjt = new PIXI.Sprite.fromImage("res/bjt" + imgNumber + ".png")
    gameObjectCeng.addChild(this.bjt)
    this.bjt.anchor.set(0.5, 1)
    this.bjt.x = buttonX
    this.bjt.y = 800
    this.bjt.visible = false
    //按钮
    this.button = new PIXI.Sprite.fromImage("res/anniu" + imgNumber + ".png")
    uiCeng.addChild(this.button)
    this.button.anchor.set(0.5, 0.5)
    this.button.y = 754
    this.button.x = this.bjt.x
    this.type = imgNumber
    //点击位置中心点
    this.kong = new PIXI.Sprite.fromImage("res/kong.png")
    lineCeng.addChild(this.kong)
    this.kong.anchor.set(0.5, 0.5)
    this.kong.x = this.bjt.x
    this.kong.y = 600

    this.button.interactive = true
    this.animalArray = []
    this.createAnimal = function () {
        //调用创建动物对象
        let animal = new Animal(this.type, this.button.x)
        animalCeng.addChild(animal.animal)
        this.animalArray.push(animal)

    }
    //动物对象进行移动
    this.animalMove = function () {
        for (let i = 0; i < this.animalArray.length; i++) {
            let animal = this.animalArray[i]
            animal.move()
        }
    }
    //删除动物
    this.show = true
    this.deleteAnimal = function () {
        for (let i = this.animalArray.length - 1; i >= 0; i--) {
            let animal = this.animalArray[i]
            if (this.kong.y + 46 < animal.animal.y && this.show == true) {
                this.scoreAction("miss")
                this.show = false
            }
            if (animal.animal.y > 800) {
                this.show = true
                animalCeng.removeChild(animal.animal)
                this.animalArray.splice(i, 1)
            }
        }
    }
    let soft = this
    //鼠标按下
    this.button.on("mousedown", function () {
        soft.buttonClick()
    })
    //鼠标抬起
    this.button.on("mouseup", function () {
        soft.bjt.visible = false
    })

    this.button.on("click", function () {

    })
    //移动端点击
    this.button.on("touchstart", function () {
        soft.buttonClick()
    })
    //移动端抬起
    this.button.on("touchend", function () {
        soft.bjt.visible = false
    })
    //点击事件
    this.buttonClick = function () {
        soft.bjt.visible = true

        for (let i = 0; i < soft.animalArray.length; i++) {
            if (soft.kong.y - 10 < soft.animalArray[i].animal.y && soft.kong.y + 10 > soft.animalArray[i].animal.y) {
                that.score += 10
                that.scoreTxt.text = that.score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
                this.scoreAction("perfect")

            } else if (soft.kong.y - 20 < soft.animalArray[i].animal.y && soft.kong.y + 20 > soft.animalArray[i].animal.y) {
                that.score += 5
                that.scoreTxt.text = that.score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
                this.scoreAction("good")
            } else if (soft.kong.y - 30 < soft.animalArray[i].animal.y && soft.kong.y + 30 > soft.animalArray[i].animal.y) {
                that.score += 1
                that.scoreTxt.text = that.score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
                this.scoreAction("bad")
            }

        }
    }
    //键盘点击事件
    this.keyDown = function () {
        this.buttonClick()
    }

    this.keyUp = function () {
        soft.bjt.visible = false
    }
    //记录点击之后结果
    this.scoreArray = []
    this.scoreAction = function (name) {
        let score = new PIXI.Sprite.fromImage("res/" + name + ".png")
        gameObjectCeng.addChild(score)
        score.y = 540
        score.x = this.bjt.x
        score.anchor.set(0.5, 0.5)
        score.alpha = 1
        this.scoreArray.push(score)
    }
    //成绩效果图片移动
    this.scoreMove = function () {
        for (let i = 0; i < this.scoreArray.length; i++) {
            let score = this.scoreArray[i]
            score.alpha -= 0.01
            score.y -= 2
        }
        for (let i = this.scoreArray.length - 1; i >= 0; i--) {
            let score = this.scoreArray[i]
            if (score.y <= 400) {
                gameObjectCeng.removeChild(score)
                this.scoreArray.splice(i, 1)
            }
        }
    }
}

//动物对象
function Animal(type, animalX) {
    let number = Math.floor(Math.random() * 5 + 1)
    if (type == 1) {
        this.animal = new PIXI.Sprite.fromImage("res/lan" + number + ".png")
    }
    if (type == 2) {
        this.animal = new PIXI.Sprite.fromImage("res/lv" + number + ".png")
    }
    if (type == 3) {
        this.animal = new PIXI.Sprite.fromImage("res/hong" + number + ".png")
    }
    if (type == 4) {
        this.animal = new PIXI.Sprite.fromImage("res/huang" + number + ".png")
    }
    this.animal.anchor.set(0.5, 0.5)
    this.animal.x = animalX
    this.animal.y = 0
    //动物对象移动
    this.move = function () {
        this.animal.y += 3.33
    }

}

new Mug([{ "fps": 180, "button": 2 }, { "fps": 221, "button": 1 }, { "fps": 332, "button": 3 }, { "fps": 373, "button": 4 },], document.body)