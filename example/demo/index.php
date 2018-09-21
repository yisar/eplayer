<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>传统引入demo</title>
</head>
<script src="./hls.min.js"></script>
<script src="./eplayer.js"></script>

<style>
	#main{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
  }
  #text{
    text-align: center;
  }
  #player{
    height: 550px;
		width: 800px;
  }
</style>

<body>
  <div id="main">
    <div id="text">
      <p><span style="font-size:36px">Eplayer Demo</span></p>
      调用方式为:  你的域名/?url=m3u8地址<br>
      接口例如： http://demo.ynxiu.cn/?url=<br>
      <a href="http://demo.ynxiu.cn/?url=https://v1.165zy.com/20180405/sU1RBo4D/index.m3u8">演示地址</a>（有可能会失效，请自己上传到服务器测试）
    </div>
    <p></p>
    <div id="player"></div>
    <script>
      var el = document.getElementById('player')
      new Eplayer(el, {
        src: "<?php echo $_GET['url'];?>",
        themeColor: "linear-gradient(90deg,#ff9900,#f5f7fa)"
      });
    </script>
  </div>
</body>

</html>