var gameType = 0

var app = new PIXI.Application(500, 800)
document.body.appendChild(app.view)
app.view.style.width = "100%"

//游戏元素图层
var gameCeng = new PIXI.Container()
app.stage.addChild(gameCeng)
//游戏背景
var bg = new PIXI.Sprite.fromImage("res/beijing.png")
gameCeng.addChild(bg)
//ui图层
var uiCeng = new PIXI.Container()
app.stage.addChild(uiCeng)

//游戏对象层
var gameObjectCeng = new PIXI.Container()
gameCeng.addChild(gameObjectCeng)

//line 图层
var lineCeng = new PIXI.Container()
gameObjectCeng.addChild(lineCeng)

//兔子图片图层
var animalCeng = new PIXI.Container()
gameObjectCeng.addChild(animalCeng)

//score图层
var scoreCeng = new PIXI.Container()
gameObjectCeng.addChild(scoreCeng)

//button按钮位置（每次加110）
var buttonX = 85
var imgNumber = 1
//获取音乐播放位置存到数组
var musicArray = [{ "fps": 180, "button": 2 }, { "fps": 221, "button": 3 }, { "fps": 332, "button": 2 }, { "fps": 373, "button": 4 },
{ "fps": 423, "button": 3 }, { "fps": 442, "button": 3 }, { "fps": 479, "button": 2 }, { "fps": 518, "button": 3 },
{ "fps": 626, "button": 4 }, { "fps": 652, "button": 3 }, { "fps": 671, "button": 2 }, { "fps": 707, "button": 3 },
{ "fps": 728, "button": 4 }, { "fps": 768, "button": 3 }, { "fps": 820, "button": 1 }, { "fps": 902, "button": 2 },
{ "fps": 921, "button": 3 }, { "fps": 940, "button": 4 }, { "fps": 962, "button": 3 }, { "fps": 1006, "button": 4 },
{ "fps": 1027, "button": 3 }, { "fps": 1061, "button": 2 }, { "fps": 1105, "button": 3 }, { "fps": 1214, "button": 4 },
{ "fps": 1234, "button": 3 }, { "fps": 1251, "button": 2 }, { "fps": 1292, "button": 3 }, { "fps": 1318, "button": 4 },
{ "fps": 1358, "button": 3 }, { "fps": 1396, "button": 4 }, { "fps": 1512, "button": 1 }, { "fps": 1543, "button": 2 },
{ "fps": 1607, "button": 3 }, { "fps": 1631, "button": 4 }, { "fps": 1656, "button": 3 }, { "fps": 1691, "button": 2 },
{ "fps": 1795, "button": 1 }, { "fps": 1819, "button": 2 }, { "fps": 1839, "button": 3 }, { "fps": 1899, "button": 4 },
{ "fps": 1931, "button": 3 }, { "fps": 1988, "button": 2 }, { "fps": 2017, "button": 1 }, { "fps": 2044, "button": 2 },
{ "fps": 2112, "button": 3 }, { "fps": 2132, "button": 4 }, { "fps": 2156, "button": 2 }, { "fps": 2175, "button": 3 },
{ "fps": 2217, "button": 4 }, { "fps": 2251, "button": 3 }, { "fps": 2277, "button": 4 }, { "fps": 2380, "button": 1 },
{ "fps": 2407, "button": 2 }, { "fps": 2423, "button": 3 }, { "fps": 2478, "button": 1 }, { "fps": 2502, "button": 2 },
{ "fps": 2538, "button": 3 }, { "fps": 2678, "button": 4 }, { "fps": 2723, "button": 3 }, { "fps": 2782, "button": 2 },
{ "fps": 2800, "button": 3 }, { "fps": 2836, "button": 4 }, { "fps": 2867, "button": 3 }, { "fps": 2971, "button": 2 },
{ "fps": 2998, "button": 3 }, { "fps": 3016, "button": 4 }, { "fps": 3050, "button": 2 }, { "fps": 3081, "button": 3 },
{ "fps": 3119, "button": 4 }, { "fps": 3140, "button": 3 }, { "fps": 3176, "button": 2 }, { "fps": 3216, "button": 3 },
{ "fps": 3315, "button": 4 }, { "fps": 3350, "button": 3 }, { "fps": 3378, "button": 2 }, { "fps": 3416, "button": 3 },
{ "fps": 3457, "button": 4 }, { "fps": 3565, "button": 4 }, { "fps": 3605, "button": 3 }, { "fps": 3683, "button": 1 },
{ "fps": 3746, "button": 2 }, { "fps": 3770, "button": 3 }, { "fps": 3790, "button": 4 }, { "fps": 3870, "button": 2 },
{ "fps": 3902, "button": 3 }, { "fps": 3976, "button": 4 }, { "fps": 4010, "button": 3 }, { "fps": 4047, "button": 2 },
{ "fps": 4150, "button": 3 }, { "fps": 4197, "button": 4 }, { "fps": 4268, "button": 1 }, { "fps": 4337, "button": 2 },
{ "fps": 4360, "button": 3 }, { "fps": 4388, "button": 4 }, { "fps": 4465, "button": 3 }, { "fps": 4493, "button": 2 },
{ "fps": 4543, "button": 3 }, { "fps": 4567, "button": 3 }, { "fps": 4603, "button": 3 }, { "fps": 4638, "button": 4 }]
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
        var animal = new Animal(this.type, this.button.x)
        animalCeng.addChild(animal.animal)
        this.animalArray.push(animal)

    }
    //动物对象进行移动
    this.animalMove = function () {

        for (var i = 0; i < this.animalArray.length; i++) {
            var animal = this.animalArray[i]
            animal.move()
        }
    }
    //删除动物
    this.show = true
    this.deleteAnimal = function () {
        for (var i = this.animalArray.length - 1; i >= 0; i--) {
            var animal = this.animalArray[i]
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
    var soft = this
    var num = 1
    //鼠标按下
    this.button.on("mousedown", function () {
        soft.buttonClick()
    })
    //鼠标抬起
    this.button.on("mouseup", function () {
        soft.bjt.visible = false
    })

    this.button.on("click", function () {
        //var str = {"zp":zp,"button":soft.type};
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

        for (var i = 0; i < soft.animalArray.length; i++) {
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
            //soft.bjt.visible = false;
        }
    }
    //键盘点击事件
    this.keyDown = function () {
        soft.bjt.visible = true
        for (var i = 0; i < soft.animalArray.length; i++) {
            if (soft.kong.y - 30 < soft.animalArray[i].animal.y && soft.kong.y + 30 > soft.animalArray[i].animal.y) {
                score++
                scoreTxt.text = score
                animalCeng.removeChild(soft.animalArray[i].animal)
                soft.animalArray.splice(i, 1)
            }
            //soft.bjt.visible = false;
        }
        // var str = {"zp":zp,"button":soft.type};
        // musicArray.push(str);
        // console.log(JSON.stringify(musicArray));
    }

    this.keyUp = function () {
        soft.bjt.visible = false
    }
    //记录点击之后结果
    this.scoreArray = []
    this.scoreAction = function (name) {
        var score = new PIXI.Sprite.fromImage("res/" + name + ".png")
        gameObjectCeng.addChild(score)
        score.y = 540
        score.x = this.bjt.x
        score.anchor.set(0.5, 0.5)
        score.alpha = 1
        this.scoreArray.push(score)
    }
    //成绩效果图片移动
    this.scoreMove = function () {
        for (var i = 0; i < this.scoreArray.length; i++) {
            var score = this.scoreArray[i]
            score.alpha -= 0.01
            score.y -= 2
        }
        for (var i = this.scoreArray.length - 1; i >= 0; i--) {
            var score = this.scoreArray[i]
            if (score.y <= 400) {
                gameObjectCeng.removeChild(score)
                this.scoreArray.splice(i, 1)
            }
        }
    }
}

document.onkeydown = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0]
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
    var e = event || window.event || arguments.callee.caller.arguments[0]
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
var touming = new PIXI.Sprite.fromImage("res/touming.png")
lineCeng.addChild(touming)
touming.y = 600
touming.x = 250
touming.anchor.set(0.5, 0.5)
//动物对象
function Animal(type, animalX) {
    var number = Math.floor(Math.random() * 5 + 1)
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
var buttonArray = []
for (var i = 0; i < 4; i++) {
    var button = new Button()
    buttonX = button.bjt.x + 110
    imgNumber++
    buttonArray.push(button)

}

function SoundManager() {
    var audioObj = {}
    var cacheNum = 3//预留声音最小个数

    //添加声音
    this.addAudio = function (name, url) {
        var audio = new Audio()
        //audio.autoplay = true;
        audio.src = url
        audio.load()
        //audio.pause();
        audio.preload = "auto"
        document.body.appendChild(audio)

        var audioArr = audioObj[name]
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
        var audioArr = audioObj[name]
        var audio = null
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
var soundManager = null
SoundManager.getInstance = function () {
    if (soundManager == null) {
        soundManager = new SoundManager()
    }
    return soundManager
}

SoundManager.getInstance().addAudio("bgm", "res/tkzc.mp3")


function setMusicTime() {
    //音乐播放位置
    var num = audio.currentTime
    //console.log(Math.ceil(num));  
}

//振屏效果
var isZhenping = false
var zhenpingTime = 10
function zhenping() {
    if (isZhenping == true) {
        gameCeng.x = Math.random() * 10 - 5
        gameCeng.y = Math.random() * 10 - 5
        zhenpingTime--
        if (zhenpingTime == 0) {
            gameCeng.x = 0
            gameCeng.y = 0
            isZhenping = false
            zhenpingTime = 10
            over()
        }
    }
}
var audio = null
function setMusic() {
    audio = SoundManager.getInstance().play("bgm")
}

var musicTime = 60
var fps = 179
function animate() {
    if (gameType == 0) {
        return
    }
    fps += 1
    musicTime--
    //一秒校正一次播放位置
    if (musicTime == 0) {
        var number = Math.round(audio.currentTime) * 60
        fps = 180 + number
        //	console.log(number);
        musicTime = 60
    }

    //创建音乐图片
    for (var i = 0; i < musicArray.length; i++) {
        if (fps == musicArray[i].fps) {
            console.log(fps)
            var button = buttonArray[musicArray[i].button - 1]
            button.createAnimal()
        }
    }

    //图片移动
    for (var i = 0; i < buttonArray.length; i++) {
        var button = buttonArray[i]
        button.animalMove()
        button.deleteAnimal()
        button.scoreMove()


    }

    //判断游戏结束
    var button1 = buttonArray[0]
    var button2 = buttonArray[1]
    var button3 = buttonArray[2]
    var button4 = buttonArray[3]
    if (button1.animalArray.length == 0 && button2.animalArray.length == 0 && button3.animalArray.length == 0 && button4.animalArray.length == 0) {
        //震屏
        isZhenping = true
        zhenping()
    }


}
app.ticker.add(animate)

//得分
//设置文本样式
var style = {
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
var str = "0"
var text = new PIXI.Text("得分 ", style)
uiCeng.addChild(text)
text.x = 30
text.y = 30

//创建文本
var scoreTxt = new PIXI.Text(str, style)
uiCeng.addChild(scoreTxt)
scoreTxt.x = 130
scoreTxt.y = 30

//游戏介绍
// var jieshao = new PIXI.Text("")
// startPanel.addChild(jieshao)
// jieshao.x = 90
// jieshao.y = 200

var startBtn = new PIXI.Sprite.fromImage("res/kaishianniu.png")
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

var zystyle = {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold',
    fill: '#ffffaa',
    // 描边
    stroke: '#000000',
    // 描边宽度
    strokeThickness: 2,
    // 字体阴影
    dropShadow: true,
    // 阴影颜色
    dropShadowColor: '#000000',
    dropShadowBlur: 2,
    // 阴影倾斜
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 3,
    // 字体换行
    wordWrap: true,
    wordWrapWidth: 200,
    lineHeight: 22

}


function over() {
    var gameoverPanel = new PIXI.Sprite.fromImage("res/beiban.png")
    uiCeng.addChild(gameoverPanel)
    gameoverPanel.x = 20
    gameoverPanel.y = 100
    gameoverPanel.alpha = 0.9

    var style = {
        font: 'bold 40px 微软雅黑',//加粗 倾斜 字号 字体名称
        fill: '#F7EDCA',//颜色
    }

    //得分
    var scoreTxt = new PIXI.Text(score, style)
    gameoverPanel.addChild(scoreTxt)
    scoreTxt.x = 210
    scoreTxt.y = 110

    var restartBtn = new PIXI.Sprite.fromImage("res/fanhuianniu.png")
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
    var x = displayObject.transform.worldTransform.tx
    var y = displayObject.transform.worldTransform.ty
    return { "x": x, "y": y }
}