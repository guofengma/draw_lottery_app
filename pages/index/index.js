//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isTrue:false,
    isNumber: 0,
    last_update: 0,
    last_x: 0,
    last_y: 0,
    last_z: 0
  },
  onLoad: function () {
    
  },
  onShow:function () {
  },
  closeView(e) {
    this.setData({
      isTrue: !this.data.isTrue
    })
  },
  onReady: function () {
    var that = this;
    var x = 0, y = 0, z = 0, lastX = 0, lastY = 0, lastZ = 0;
    var shakeSpeend = 110; // 设置阀值 控制速度
    var lastTime = 0;
    function shake(res) {
      console.log(1)
      var newTime = new Date().getTime();
      if (newTime - lastTime > 100) {
        var diffTime = newTime - lastTime;
        lastTime = newTime;
        x = res.x;
        y = res.y;
        z = res.z;
        var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000; // 记录速度
        if (speed > shakeSpeend) {
          // 开始请求接口来获取中奖信息
          // wx.stopAccelerometer()
          console.log('m')
          // wx.playBackgroundAudio({ // 音乐
          //   dataUrl: '',
          //   title: '',
          //   coverImgUrl: ''
          // })
          wx.showLoading({
            title: '摇奖中...'
          })
          // wx.request({
          //   url: '',
          //   success:function (data) {
          setTimeout(function () {
            // wx.playBackgroundAudio({ // 音乐
            //   dataUrl: '',
            //   title: '',
            //   coverImgUrl: ''
            // })
            wx.hideLoading()
          }, 2000)
          //     lastX = x; //赋值，为下一次计算做准备 
          //     lastY = y; 
          //     lastZ = z;
          //   }
          // })
        }
      }
    }
    wx.onAccelerometerChange(shake)
  }
  
})
