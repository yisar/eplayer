let gameType = 0

let app = new PIXI.Application(500, 800)
document.body.appendChild(app.view)
app.view.style.width = "100%"

//游戏元素图层
let gameCeng = new PIXI.Container()
app.stage.addChild(gameCeng)
//游戏背景
let bg = new PIXI.Sprite.fromImage("res/beijing.png")
gameCeng.addChild(bg)
//ui图层
let uiCeng = new PIXI.Container()
app.stage.addChild(uiCeng)

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

//button按钮位置（每次加110）
let buttonX = 85
let imgNumber = 1
//获取音乐播放位置存到数组
let musicArray = [{ "fps": 180, "button": 2 }, { "fps": 221, "button": 1 }, { "fps": 332, "button": 3 }, { "fps": 373, "button": 4 },]
//button 对象
function Button() {
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
    let num = 1
    //鼠标按下
    this.button.on("mousedown", function () {
        soft.buttonClick()
    })
    //鼠标抬起
    this.button.on("mouseup", function () {
        soft.bjt.visible = false
    })

    this.button.on("click", function () {
        //let str = {"zp":zp,"button":soft.type};
        //musicArray.push(str);
        //console.log(JSON.stringify(musicArray));

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
                score += 10
                scoreTxt.text = score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
                this.scoreAction("perfect")

            } else if (soft.kong.y - 20 < soft.animalArray[i].animal.y && soft.kong.y + 20 > soft.animalArray[i].animal.y) {
                score += 5
                scoreTxt.text = score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
                this.scoreAction("good")
            } else if (soft.kong.y - 30 < soft.animalArray[i].animal.y && soft.kong.y + 30 > soft.animalArray[i].animal.y) {
                score += 1
                scoreTxt.text = score
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

document.onkeydown = function (event) {
    let e = event
    //console.log(e.keyCode + " - " + self.keyCode);
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
document.onkeyup = function (event) {
    let e = event || window.event || arguments.callee.caller.arguments[0]
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

//点击位置
let touming = new PIXI.Sprite.fromImage("res/touming.png")
lineCeng.addChild(touming)
touming.y = 600
touming.x = 250
touming.anchor.set(0.5, 0.5)
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

//button对象数组
let buttonArray = []
for (let i = 0; i < 4; i++) {
    let button = new Button()
    buttonX = button.bjt.x + 110
    imgNumber++
    buttonArray.push(button)

}

function SoundManager() {
    let audioObj = {}
    let cacheNum = 3//预留声音最小个数

    //添加声音
    this.addAudio = function (name, url) {
        let audio = new Audio()
        //audio.autoplay = true;
        audio.src = url
        audio.load()
        //audio.pause();
        audio.preload = "auto"
        document.body.appendChild(audio)

        let audioArr = audioObj[name]
        if (audioArr == null) {
            audioArr = []
        }
        audioArr.push(audio)
        audioObj[name] = audioArr
        if (audioArr.length < cacheNum) {
            //自动添加该音色
            this.addAudio(name, audio.src)
        }

    }

    //播放声音
    this.play = function (name, loop = false) {
        let audioArr = audioObj[name]
        let audio = null
        if (audioArr.length > 0) {
            audio = audioArr[0]
            audioArr.splice(0, 1)
            if (loop == true) {
                audio.loop = true
            }
            audio.play()
            audio.onended = function () {
                //console.log(audio + "音频播放完成" + audio.src);
                audioArr.push(audio)
            }
            if (audioArr.length < cacheNum) {
                //console.log("缓存数量不够了！");
                //自动添加该音色
                this.addAudio(name, audio.src)
            }
        } else {
            //console.log("没有该声音的缓存");
        }
        return audio
    }

}
let soundManager = null
SoundManager.getInstance = function () {
    if (soundManager == null) {
        soundManager = new SoundManager()
    }
    return soundManager
}

SoundManager.getInstance().addAudio("bgm", "https://mp4.ziyuan.wang/view.php/67c796ed2dad70c429bda73a647704f0.mp4")

function setMusicTime() {
    //音乐播放位置
    let num = audio.currentTime
    //console.log(Math.ceil(num));  
}


let audio = null
function setMusic() {
    audio = SoundManager.getInstance().play("bgm")
}

let fps = 179
function animate() {
    if (gameType == 0) {
        return
    }
    fps += 1
    //创建动物
    for (let i = 0; i < musicArray.length; i++) {
        if (fps == musicArray[i].fps) {
            console.log(fps)
            let button = buttonArray[musicArray[i].button - 1]
            button.createAnimal()
        }
    }

    //图片移动
    for (let i = 0; i < buttonArray.length; i++) {
        let button = buttonArray[i]
        button.animalMove()
        button.deleteAnimal()
        button.scoreMove()
    }

    //判断游戏结束
    let button1 = buttonArray[0]
    let button2 = buttonArray[1]
    let button3 = buttonArray[2]
    let button4 = buttonArray[3]
    const empty = button1.animalArray.length == 0 && button2.animalArray.length == 0 && button3.animalArray.length == 0 && button4.animalArray.length == 0
    if (empty) {
        over()
    }


}
app.ticker.add(animate)

//得分
//设置文本样式
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

var score = 0
//文本
let str = "0"
let text = new PIXI.Text("得分 ", style)
uiCeng.addChild(text)
text.x = 30
text.y = 30

//创建文本
let scoreTxt = new PIXI.Text(str, style)
uiCeng.addChild(scoreTxt)
scoreTxt.x = 130
scoreTxt.y = 30

//游戏介绍
// let jieshao = new PIXI.Text("")
// startPanel.addChild(jieshao)
// jieshao.x = 90
// jieshao.y = 200

let startBtn = new PIXI.Sprite.fromImage("res/kaishianniu.png")
uiCeng.addChild(startBtn)
startBtn.interactive = true
startBtn.on("click", gameStart)
startBtn.on("touchstart", gameStart)
startBtn.x = 177
startBtn.y = 400
function gameStart(event) {
    //event.data.originalEvent.preventDefault();
    startBtn.visible = false
    setMusic()
    gameType = 1

}


function over() {
    let gameoverPanel = new PIXI.Sprite.fromImage("res/beiban.png")
    uiCeng.addChild(gameoverPanel)
    gameoverPanel.x = 20
    gameoverPanel.y = 100
    gameoverPanel.alpha = 0.9

    let style = {
        font: 'bold 40px 微软雅黑',//加粗 倾斜 字号 字体名称
        fill: '#F7EDCA',//颜色
    }

    //得分
    let scoreTxt = new PIXI.Text(score, style)
    gameoverPanel.addChild(scoreTxt)
    scoreTxt.x = 210
    scoreTxt.y = 110

    let restartBtn = new PIXI.Sprite.fromImage("res/fanhuianniu.png")
    gameoverPanel.addChild(restartBtn)
    restartBtn.x = 180
    restartBtn.y = 330
    restartBtn.interactive = true
    restartBtn.on("click", function () {
        window.location.reload()
    })
    restartBtn.on("touchstart", function () {
        window.location.reload()
    })
    gameType = 0

}

//获取显示对象的世界坐标
function getWorldPosition(displayObject) {
    let x = displayObject.transform.worldTransform.tx
    let y = displayObject.transform.worldTransform.ty
    return { "x": x, "y": y }
}