let { Tool, RequestFactory} = global
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  wxLogin() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let code = res.code
        if (code) {
          let params = {
            code: code,
            loginAddress: ''
          }
          let r = RequestFactory.getWeChatOpenId(params);
          r.finishBlock = (req) => {
            Tool.loginOpt(req)
            Tool.navigationPop()
          }
          Tool.showErrMsg(r)
          r.addToQueue();
        }
      }
    })
  },
})