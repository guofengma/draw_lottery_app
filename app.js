//app.js
import TCGlobal, {
  Storage,
  Tool,
  Event,
  Touches,
  RequestFactory
} from './tools/tcglobal';

App({
  onLaunch: function () {
    //设置全局变量
    global.TCGlobal = TCGlobal;
    global.Storage = Storage;
    global.Tool = Tool;
    global.Event = Event;
    global.Touches = Touches;
    global.RequestFactory = RequestFactory;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
     * 调用微信接口，获取设备信息接口
     */
  getSystemInfo: function (cb) {
    let that = this
    try {
      //调用微信接口，获取设备信息接口
      let res = wx.getSystemInfoSync()
      res.screenHeight = res.screenHeight * res.pixelRatio;
      res.screenWidth = res.screenWidth * res.pixelRatio;
      res.windowHeight = res.windowHeight * res.pixelRatio;
      res.windowWidth = res.windowWidth * res.pixelRatio;
      let rate = 750.0 / res.screenWidth;
      res.rate = rate;
      res.screenHeight = res.screenHeight * res.rate;
      res.screenWidth = res.screenWidth * res.rate;
      res.windowHeight = res.windowHeight * res.rate;
      res.windowWidth = res.windowWidth * res.rate;
      console.log('getSystemInfo');
      Storage.setSysInfo(res);
      that.getUserInfos(that.globalData.code)
      that.globalData.systemInfo = res
      typeof cb == "function" && cb(that.globalData.systemInfo)
    }
    catch (e) {

    }
  }

})