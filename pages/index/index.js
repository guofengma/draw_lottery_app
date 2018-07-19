//index.js
//获取应用实例
const app = getApp()
let { Tool, RequestFactory, Storage } = global
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
        last_z: 0,
        isShakeBox:false,
        isNotice:false,
        code: '',
<<<<<<< HEAD
        isWzj:false,
        iscardZJL:false,
        ishongbao:false,
        isMaterial:false,
        isShowModelTitle: '',
        isMaterialUrl:'',
        isMaterialName: '',
        iscardName: '',
        iscardUrl: '',
        ishongbaoName: '',
    },
    onLoad: function() {
      this.getIsNumberHttp()
=======
        userId:'',
        visiable:false,
    },
    onLoad: function() {
      this.setData({
        userId: Storage.memberId() || '',
      })
>>>>>>> 3e11a4d72c257e0efe2210c25dd472c0c2f68a4c
    },
    onReady: function() {
      
    },
    bindinputCode(e){
      this.setData({
        code: e.detail.value
      })
    },
    SecurityCodeRequestHttp () { // 防伪码验证
      let data = {
        activityId:17,
        code: this.data.code
      };
      let r = RequestFactory.SecurityCodeRequest(data);
      r.finishBlock = (req) => {
        console.log(req.responseObject)
        wx.showModal({
          title: '兑换成功',
          content: '',
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
      this.getIsNumberHttp()
    },
    getIsNumberHttp () { // 查询摇奖次数
      let data = {
        activityId: 17
      };
      let r = RequestFactory.shakeNumberRequest(data);
      r.finishBlock = (req) => {
        console.log(req.responseObject)
        let num = req.responseObject.data
        this.setData({
          isNumber: num
        })
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    shakeStartRequestHttp () { //  摇一摇
      let data = {
        activityId: 17
      };
      let r = RequestFactory.shakeStartRequest(data);
      r.finishBlock = (req) => {
        console.log(req)
      };
      r.failBlock = (req) => {
        console.log(req.responseObject)
        if (req.responseObject.code === 600) {
          this.setData({
            isShowModelTitle: '很遗憾，未中奖',
            isShakeBox: true,
            isWzj: true
          })
        }
      };
      // Tool.showErrMsg(r);
      r.addToQueue();
    },
    isShowSake: false,
    onShow: function () {
      this.isShowSake = true
      let lastTime = 0; //此变量用来记录上次摇动的时间
      let x = 0,
        y = 0,
        z = 0,
        lastX = 0,
        lastY = 0,
        lastZ = 0; //此组变量分别记录对应x、y、z三轴的数值和上次的数值
      let shakeSpeed = 140; //设置阈值
      let that = this;
      function shake(acceleration) {
        let nowTime = new Date().getTime(); //记录当前时间
        //如果这次摇的时间距离上次摇的时间有一定间隔 才执行
        if (nowTime - lastTime > 100) {
          let diffTime = nowTime - lastTime; //记录时间段
          lastTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
          x = acceleration.x; //获取x轴数值，x轴为垂直于北轴，向东为正
          y = acceleration.y; //获取y轴数值，y轴向正北为正
          z = acceleration.z; //获取z轴数值，z轴垂直于地面，向上为正
          //计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
          let speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
          if (speed > shakeSpeed) { //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
            wx.stopAccelerometer()
            wx.showLoading({
              title: '摇奖中...'
            })
            setTimeout(() => {
              let data = {
                activityId: 17
              };
              let r = RequestFactory.shakeStartRequest(data);
              r.finishBlock = (req) => {
                console.log('进入异步')
                console.log(req.responseObject)
                let num = that.data.isNumber--
                if (req.responseObject.data.ptype === 1) { // 实物
                  that.setData({
                    isNumber: num,
                    isShowModelTitle: '恭喜你，中奖啦',
                    isShakeBox: true,
                    isMaterial: true,
                    isMaterialUrl: req.responseObject.data.imgUrl,
                    isMaterialName: req.responseObject.data.awardName
                  })
                } else if (req.responseObject.data.ptype === 2) { // 字卡
                  that.setData({
                    isNumber: num,
                    isShowModelTitle: '恭喜你，中奖啦',
                    isShakeBox: true,
                    iscardZJL: true,
                    iscardUrl: req.responseObject.data.imgUrl,
                    iscardName: req.responseObject.data.awardName
                  })
                } else if (req.responseObject.data.ptype === 3) { // 红包
                  that.setData({
                    isNumber: num,
                    isShowModelTitle: '恭喜你，中奖啦',
                    isShakeBox: true,
                    ishongbao: true,
                    // isMaterialUrl: req.responseObject.data.imgUrl,
                    ishongbaoName: req.responseObject.data.awardName
                  })
                }
                wx.hideLoading()
              };
              r.failBlock = (req) => {
                console.log('进入异步')
                console.log(req.responseObject)
                if (req.responseObject.code === 600) {
                  console.log(req.responseObject)
                  let num = that.data.isNumber--
                  that.setData({
                    isNumber: num,
                    isShowModelTitle: '很遗憾，未中奖',
                    isShakeBox: true,
                    isWzj: true
                  })
                  wx.hideLoading()
                }
              };
              r.addToQueue();
            }, 1500)
          }
          lastX = x; //赋值，为下一次计算做准备
          lastY = y; //赋值，为下一次计算做准备
          lastZ = z; //赋值，为下一次计算做准备
        }
      }
      wx.onAccelerometerChange(shake)
    },
    onHide: function () {
      this.isShowSake = true
    },
    closeBindshakeBox:function () { // 摇一摇弹框
      this.setData({
        isShakeBox: false
      })
      this.getIsNumberHttp();
      wx.startAccelerometer()
    },
    closeView(e) { // 显示天天签到
      this.setData({
        isTrue: !this.data.isTrue
      })
    },
    showNotice: function (e) { // 显示公告
      this.setData({
        isNotice: !this.data.isNotice
      })
    },
    goPage(){
      Tool.navigateTo('/pages/activity-detail/activity-detail')
    },
    awardClicked(){
      Tool.navigateTo('/pages/my/my')
    },
    getPhoneNumber(e) {
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
        console.log('用户拒绝了你的请求')
      } else {
        this.setData({
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          visiable: !this.data.visiable,
        })
      }
    },
    agreeGetUser(e) {
      if (!this.data.canIUse) {
        this.getUserInfo()
      }
      this.setData({
        visiable: !this.data.visiable
      })
      if (e.detail.userInfo !== undefined) {
        this.getLogin(e.detail.userInfo)
      }
    },
    requetLogin() {
      let params = {
        encryptedData: this.data.encryptedData,
        iv: this.data.iv,
        openId: Storage.getWxOpenid() || '',
        name: this.data.userInfo.nickName,
        headImgUrl: this.data.userInfo.avatarUrl
      }
      let r = global.RequestFactory.appWechatLogin(params);
      r.finishBlock = (req) => {
        Tool.loginOpt(req)
        console.log(req)
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    getUserInfo() {
      wx.getUserInfo({
        success: res => {
          this.getLogin(res.userInfo)
        },
        fail: function () {
          
        }
      })
    },
    getLogin(userInfo) {
      this.setData({
        userInfo: userInfo
      })
      Storage.setWxUserInfo(userInfo)
      this.requetLogin()
    }
})