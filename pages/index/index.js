//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isNumber: 0,
    last_update: 0,
    isTrue: false,
    last_x: 0,
    last_y: 0,
    last_z: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onShow:function () {
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    var that = this;
    // wx.onAccelerometerChange(shake)
  },
  shake: function () {
    function shake(res) {
      var x = 0, y = 0, z = 0, lastX = 0, lastY = 0, lastZ = 0;
      var shakeSpeend = 110; // 设置阀值 控制速度
      var lastTime = 0;
      console.log(1);
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
  }
})
