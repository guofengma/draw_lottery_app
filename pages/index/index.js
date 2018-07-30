//index.js
//获取应用实例
let {Tool, RequestFactory, Storage, Event} = global
Page({
    data: {
        userInfo: {},// 用户个人信息保存
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isNumber:0,
        last_update: 0,
        isTrue: false,
        last_x: 0,
        last_y: 0,
        last_z: 0,
        isShakeBox: false,
        isNotice: false,// 是否显示公告
        hasNotice: false,
        isShowNotice: false,
        isFixed: false,
        code: '',
        isWzj: false,
        iscardZJL: false,
        ishongbao: false,
        isMaterial: false,
        isShowModelTitle: '',
        isMaterialUrl: '',
        isMaterialName: '',
        iscardName: '',
        iscardUrl: '',
        ishongbaoUrl: '',
        ishongbaoName: '',
        animationData: {},
        winnerBlock: [],
        offsetTop: {},
        activeStartTime: '',
        activeEndTime: '',
        disabled: false,
        isPlusNumber: false, // 是否加+1 
        isReduceNumber: false, // 是否减1
        isNumberPlus: '', // 加1动画
        isNumberReduce: '',// 减1动画
        isDrawn: true,
        preHint: '', // 开始提示
        sufHint: '', // 结束提示
        actStauts: '',
        isDisplay: true,
        shakeStartMusicSrc:'', // 中奖
        shakeStopMusicSrc: '', // 未中奖
        audioCtx: '', // 音乐
        SignActivtyId: false, // 活动是否开始了
        isAcitivityEnd:false, //活动是否结束
        isAcitivityPause:false, //活动是否暂停
        isAuthorize: false, // 是否注册登录过 没有注册过显示获取手机的按钮
        visiable: false, // 是否显示获取头像权限的按钮
        lastTime:0,//上一次摇动时间
        isAjax:true,
        showMyNum:false, //没有中奖次数提示框
        scaleani:{}
    },
    onLoad: function () {
      this.setData({ // storage 中获取userId
          userId: Storage.memberId() || '',
          isAuthorize: Storage.didAuthorize() || '',
      });
      Tool.isIPhoneX(this); // 判断是否是iPhone X
      this.getActivtyId();
      this.getNoticeNumRequst() // 获取公告
      Event.on('didLogin', this.didLogin, this);
      Tool.isEmpty(null)
    },
    getActivtyId(callBack) { // 获取活动Id
        let r = global.RequestFactory.getActivityId();
        r.finishBlock = (req) => {
          if (req.responseObject.data == null || req.responseObject.data == 'null'){
              return false
          }else {
            Storage.setActivityId(req.responseObject.data.id)
            Storage.setActivityCode(req.responseObject.data.code)
            this.setData({
                activityId: req.responseObject.data.id,
                activeStartTime: req.responseObject.data.startTime,
                activeEndTime: req.responseObject.data.endTime,
                preHint: req.responseObject.data.preHint,
                sufHint: req.responseObject.data.sufHint,
                actStauts: req.responseObject.data.actStauts,
                shakeStartMusicSrc: req.responseObject.data.winMusic,
                shakeStopMusicSrc: req.responseObject.data.loseMusic,
            })
            let currentTime = new Date().getTime(); // 当前时间
            let getStartTime = this.data.activeStartTime //活动开始时间
            if (getStartTime > currentTime) { // 活动未开启
                this.setData({
                    SignActivtyId: false,
                    isDisplay: true,
                    disabled: false
                })
            } else {
              let isAcitivityPause = false 
              if (req.responseObject.data.actStauts ==3) { // 活动暂停
                isAcitivityPause = true 
              }
              this.setData({
                isAcitivityPause: isAcitivityPause,  
                SignActivtyId: true, // 活动开启
                isDisplay: false,
                disabled: true
              })
            }
            if (req.responseObject.data.endTime > currentTime){
              this.setData({
                isAcitivityEnd: false,  // 活动未结束
                isDisplay: false,
                disabled: true
              })
            } else{
              this.setData({
                isAcitivityEnd: true, // 活动已结束
                isDisplay:true,
                disabled:false
              })
            }
            if (callBack !== undefined || Storage.memberId()){
                this.selectComponent("#topBar").getUserId()
                this.getIsNumberHttp()
            }
              //this.getIsNumberHttp() // 获取抽奖次数
              this.getWinnerRequest() // 获取中奖名单
            // this.selectComponent("#showNotice").noticeRequestHttp()
          }
        }
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    catchTouchMove: function (res) { // swipei 滑动
        return false
    },
    ani (){
      let animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.scale(4).step()
      this.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.scale(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 1000)
    },
    bindinputCode(e) { // 获取输入防伪码
      this.setData({
          code: e.detail.value
      })
    },
    bindFocus() {
      // 活动未开启input 无法输入
      let currentTime = new Date().getTime()
      let getStartTime = this.data.activeStartTime //活动开始时间
      if (this.data.SignActivtyId) { // 活动开启
        this.setData({
          disabled: false,
          isDisplay: false
        })
      } else if (this.data.isAcitivityEnd) { // 活动已结束   
        Tool.showAlert(this.data.preHint)
      } else if (this.data.isAcitivityPause) {
        Tool.showAlert('活动已暂停')
        this.setData({
          disabled: false,
          isDisplay: true
        })
      } else {
        this.setData({
          disabled: true
        })
        Tool.showAlert(this.data.sufHint)
      }

    },
    bindBlur() {
      let currentTime = new Date().getTime()
      let getStartTime = this.data.activeStartTime //活动开始时间
      if (this.data.SignActivtyId) {
        this.setData({
          disabled: false,
          isDisplay: false
        })
      } else if (this.data.isAcitivityEnd) { // 活动已结束
        console.log('结束')
        Tool.showAlert(this.data.sufHint)
      } else if (this.data.isAcitivityPause) {
        Tool.showAlert('活动已暂停')
        this.setData({
          disabled: false,
          isDisplay: true
        })
      } else {
        console.log('开启')
        this.setData({
          disabled: true
        })
        Tool.showAlert(this.data.preHint) 
      }
    },
    SecurityCodeRequestHttp() { // 防伪码验证
      let code = this.data.code;
      this.setData({
          userId: Storage.memberId() || ''
      })
      let currentTime = this.data.activeEndTime
      let getStartTime = this.data.activeStartTime //活动开始时间
      if (!this.data.SignActivtyId) { // 未开启
        Tool.showAlert(this.data.preHint)
      } else if (this.data.isAcitivityEnd) {
        Tool.showAlert(this.data.sufHint)
      } else if (this.data.isAcitivityPause) {
        this.setData({
          disabled: false,
          isDisplay: true
        })
        Tool.showAlert('活动已暂停')
      }else {
          if (this.data.userId == '' || this.data.userId == null) {
              return
          }
          if (this.data.code === '' || this.data.code === null) {
            wx.showModal({
                title: '',
                content: '请输入16位防伪码',
            })
          } else {
            let data = {
                activityId: Storage.getActivityId() || '',
                code: this.data.code
            };
            let r = RequestFactory.SecurityCodeRequest(data);
            r.finishBlock = (req) => {
              // Tool.showAlert('兑换成功')
              this.setData({
                isPlusNumber: true,
                disabled: true
              })
              this.ani()
              this.getIsNumberHttp()
            };
            Tool.showErrMsg(r);
            r.addToQueue();
          }
      }
    },
    getIsNumberHttp() { // 查询摇奖次数
        let data = {
            activityId: Storage.getActivityId() || ''
        };
        let that = this
        let r = RequestFactory.shakeNumberRequest(data);
        r.finishBlock = (req) => {
          let num = req.responseObject.data
          this.setData({
              isNumber: num,
          })
          setTimeout(() => {
            that.setData({
              isPlusNumber: false,
              isNumberPlus: '',
            })
          },1000)
          this.toAccelerometer()
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    isShowSake: false,
    toAccelerometer(isShowAlert=true){ // 监听摇一摇
      let that = this;
      this.isShowSake = true
      let SignActivtyId = this.data.SignActivtyId
      let isAcitivityEnd = this.data.isAcitivityEnd
      let lastTime = this.data.lastTime; //此变量用来记录上次摇动的时间
      let x = 0, y = 0, z = 0,
          lastX = 0,
          lastY = 0,
          lastZ = 0; //此组变量分别记录对应x、y、z三轴的数值和上次的数值
      let shakeSpeed = 110; //设置阈值
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
          if (speed > shakeSpeed && that.data.isAjax) { 
            //如果计算出来的速度超过了阈值，那么就算作用户成功摇一摇
            if (!that.data.SignActivtyId) { // 活动未开启
              Tool.showAlert(that.data.preHint)
              wx.stopAccelerometer();
              return
            } 
            if (that.data.isAcitivityEnd) { // 活动已结束
              Tool.showAlert(that.data.sufHint)
              wx.stopAccelerometer();
              return
            }
            if (that.data.isAcitivityPause) {
              Tool.showAlert('活动已暂停')
              wx.stopAccelerometer();
              return
            }
            if (that.data.isNumber <= 0) {
              //Tool.showAlert('没有摇奖次数了')
              that.showMyNumClicked()
              wx.stopAccelerometer();
              return
            } 
            // 一次cookie 都没有表示从未注册登录过
            let isLogin = Storage.getUserCookie() || false
            if (!isLogin) {
              Tool.showAlert('请先登录')
              wx.stopAccelerometer();
              return
            } 
            that.setData({
              lastTime: nowTime,
              isAjax: false
            })
            wx.stopAccelerometer()
            wx.showLoading({
              title: '摇奖中...'
            })
            let data = {
              activityId: Storage.getActivityId() || ''
            };
            let r = RequestFactory.shakeStartRequest(data);
            r.finishBlock = (req) => {
              that.data.audioCtx = wx.createAudioContext('myAudioShake');
              that.data.audioCtx.setSrc(that.data.shakeStartMusicSrc);
              that.data.audioCtx.play();
              let isName = ''
              let Dname = req.responseObject.data.dictionaryName == null ? '' : req.responseObject.data.dictionaryName
              isName = '"' + Dname +'"'+req.responseObject.data.awardName
              console.log(isName)
              let num = that.data.isNumber--
              let isName = ''
              let Dname = req.responseObject.data.dictionaryName == null ? '' : req.responseObject.data.dictionaryName
              isName = '"' + Dname + '"' + req.responseObject.data.awardName
              console.log(isName)
              if (req.responseObject.data.pType == 1 || req.responseObject.data.pType == '1') { // 实物
                that.setData({
                  isNumber: num,
                  isShowModelTitle: '恭喜你，中奖啦',
                  isShakeBox: true,
                  isMaterial: true,
                  iscardZJL: false,
                  isWzj: false,
                  ishongbao: false,
                  isReduceNumber: true,
                  isNumberReduce:'isNumberReduce',
                  isMaterialUrl: req.responseObject.data.imgUrl,
                  isMaterialName: isName
                })
                that.ani()
              } else if (req.responseObject.data.pType == 2 || req.responseObject.data.pType == '2') { // 字卡
                that.setData({
                  isNumber: num,
                  isShowModelTitle: '恭喜你，中奖啦',
                  isShakeBox: true,
                  iscardZJL: true,
                  ishongbao: false,
                  isWzj: false,
                  isMaterial: false,
                  isReduceNumber: true,
                  isNumberReduce: 'isNumberReduce',
                  iscardUrl: req.responseObject.data.imgUrl,
                  iscardName: isName
                })
                that.ani()
              } else if (req.responseObject.data.pType == 3 || req.responseObject.data.pType == '3') { // 红包
                that.setData({
                  isNumber: num,
                  isShowModelTitle: '恭喜你，中奖啦',
                  isShakeBox: true,
                  ishongbao: true,
                  isMaterial: false,
                  iscardZJL: false,
                  isWzj: false,
                  isReduceNumber: true,
                  isNumberReduce: 'isNumberReduce',
                  ishongbaoUrl: req.responseObject.data.imgUrl,
                  ishongbaoName: isName
                })
                that.ani()
              }
              wx.hideLoading()
              wx.stopAccelerometer();
              that.getWinnerRequest()  // 中奖一次以后更新中奖名单
              that.setData({
                isAjax: true
              })
            };
            r.failBlock = (req) => {
              let start = () => {
                wx.startAccelerometer();
              }
              if (that.data.isNumber==0) return
              let num = that.data.isNumber--
              if (req.responseObject.code === 600) {
                that.data.audioCtx = wx.createAudioContext('myAudioShake');
                that.data.audioCtx.setSrc(that.data.shakeStopMusicSrc);
                that.data.audioCtx.play();
                that.setData({
                  isNumber: num,
                  isShowModelTitle: '很遗憾，未中奖',
                  isShakeBox: true,
                  isWzj: true,
                  iscardZJL: false,
                  ishongbao: false,
                  isMaterial: false,
                  isReduceNumber: true,
                  isNumberReduce: 'isNumberReduce',
                  isDrawn: false
                })
                that.ani()
                wx.hideLoading()
                wx.stopAccelerometer();
                that.setData({
                  isAjax: true
                })
              } else {
                Tool.showAlert(req.responseObject.msg, start)
              }
            };
            r.addToQueue();
          }
          lastX = x; //赋值，为下一次计算做准备
          lastY = y; //赋值，为下一次计算做准备
          lastZ = z; //赋值，为下一次计算做准备
        }
      }
      wx.onAccelerometerChange((e) => {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        if (currentPage.onAccelerometerChange) {
          currentPage.onAccelerometerChange(e)
        }
        shake(e)
      })
    },
    closeBindshakeBox() { // 摇一摇弹框
      let that = this
      this.setData({
          isShakeBox: false
      })
      that.data.audioCtx.pause()
      this.getIsNumberHttp();
      
      
      setTimeout(()=>{
        that.setData({
          isReduceNumber: false
        })
      },1000)
    },
    closeView(e) { // 显示天天签到
        this.setData({
            isTrue: !this.data.isTrue,
            isFixed:!this.data.isFixed
        })
        if (this.data.isTrue){
          this.selectComponent("#sign").signListRequestHttp()
        }
        // wx.startAccelerometer()
    },
    showNoticeClicked(){ // 点击公告按钮
      // 用户第一次登录弹出公告
      Storage.setIsShowNotice(true)
      this.setData({
        isNotice: !this.data.isNotice
      })
      if (this.data.isNotice) {
        this.selectComponent("#showNotice").noticeRequestHttp()
      } 
    },
    showNotice (e) { // 显示公告
      this.showNoticeClicked()
      // 如果活动开始了 
      if (this.data.SignActivtyId){
        this.getIsSign()
      }
    },
    getIsSign() { // 用户是否签到
      let userId = Storage.getUserAccountInfo()? Storage.getUserAccountInfo().id :''
      if (Storage.getUserAccountInfo()){
        userId = Storage.getUserAccountInfo().id ? Storage.getUserAccountInfo().id : ''
      }
      let data = {
        activityId: Storage.getActivityId() || '',
        userId: userId,
      }
      let r = RequestFactory.signIsTrueRequest(data);
      r.finishBlock = (req) => {
        let userId = req.responseObject.data.userId
        let { isTrue, isFixed, isNotice, SignActivtyId, isAcitivityPause, isAcitivityEnd  } = this.data
        if (userId>0){
          this.setData({
            isTrue: false,
            isFixed: false
          })
        } else {
          // 活动开始了 没有结束 没有暂停的情况下显示公告
          if (SignActivtyId && !isAcitivityPause && !isAcitivityEnd){
            isTrue = true
          }
          this.setData({
            isTrue: isTrue,
            isFixed: true,
            isNotice: false
          })
          if (isTrue){
            this.selectComponent("#sign").signListRequestHttp()
          }
        }
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    getWinnerRequest() { // 获取公告中奖名单
      let data = {
        activityId: Storage.getActivityId() || ''
      };
      let r = RequestFactory.winnerRequest(data);
      r.finishBlock = (req) => {
        if (Tool.isEmpty(req.responseObject.data)) {

        } else {
          let arrNumber = req.responseObject.data;
          let arrLength = arrNumber.length;
          let arr = [];
          let num;
          arrNumber.forEach((res, index, array) => {
            let t = Math.floor(index / 5);
            if (num !== t) {
              num = t;
              arr[t] = new Array();
            }
            if (res.telephone == null) {
            } else {
              let str = res.telephone
              let strL = str.length
              let telIphone = ''
              if (Tool.isEmpty(str)) {
                console.log('不完整')
              } else {
                if (strL < 11 || strL > 11) {
                  console.log('手机号位数错误')
                } else {
                  telIphone = str.substr(0, 3) + "****" + str.substr(7)
                }
              }
              arr[t].push({
                index: index + 1,
                tphone: telIphone,
                prizeName: res.prizeName
              });
            }

          })
          this.setData({
            winnerBlock: arr
          })
        }
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    getNoticeNumRequst(){ // 请求公告
      let data = {page: 1};
      let r = global.RequestFactory.noticeRequest(data);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data;
        let { isNotice, hasNotice } = this.data.isNotice
        if (!datas) {
          return
        }
        let totals = datas.total;
        if (totals>0) {
          isNotice= Storage.getIsShowNotice()===true? false:true
          this.setData({
            isNotice: isNotice,
            hasNotice: !hasNotice,
          });
          if (isNotice){
            this.selectComponent("#showNotice").noticeRequestHttp()
          }
        }
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
    goPage() { // 跳转detail
      if (this.getIsLogin()) {
        Tool.navigateTo('/pages/activity-detail/activity-detail')
      }
    },
    awardClicked() { // 跳转我的奖品
      this.setData({
        isShakeBox: false
      })
      if (this.getIsLogin()) {
        Tool.navigateTo('/pages/my/my')
      }
    },
    didLogin() { // 获取 token
      this.selectComponent("#topBar").getUserId()
      let callBack = () => {
        this.getIsNumberHttp()
      }
      if (this.data.activityId) {
        this.getIsNumberHttp()
      } else {
        this.getActivtyId(callBack)
      }
      this.setData({
        isAuthorize: Storage.didAuthorize() || '',
      })
    },
    getIsLogin(isGoPage) { // 退出之后跳转登录
      let cookies = Storage.getUserCookie() || false
      if (!cookies) {
        if (isGoPage === undefined) {
            Tool.navigateTo('/pages/login/login')
        }
        return false
      }
      return true
    },
    getPhoneNumber(e) { // 获取手机
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
    agreeGetUser(e) { // 获取授权
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
    requetLogin() { // 登录
      let params = {
          encryptedData: this.data.encryptedData,
          iv: this.data.iv,
          openId: Storage.getWxOpenid() || '',
          name: this.data.userInfo.nickName,
          headImgUrl: this.data.userInfo.avatarUrl,
          loginAddress: Storage.getLocation() || '',
          sex: this.data.userInfo.gender
      }

      let r = global.RequestFactory.appWechatLogin(params);
      r.finishBlock = (req) => {
          Tool.loginOpt(req)
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    },
    getUserInfo() { // 获取授权
      let that = this
      wx.getUserInfo({
        success: res => {
          this.getLogin(res.userInfo)
        },
        fail: function() {

            }
        })
    },   
    getLogin(userInfo) { // 登录
      this.setData({
          userInfo: userInfo
      })
      Storage.setWxUserInfo(userInfo)
      this.requetLogin()
    },
    showMyNumClicked(e){
      this.setData({
        showMyNum:!this.data.showMyNum
      })
      wx.stopAccelerometer();
    },
    onShow: function () { // 进行摇一摇
      this.toAccelerometer(false)
    },
    onHide: function () {
      this.isShowSake = false // 设置第一次进入
      wx.stopAccelerometer()
    },
    onUnload: function () {
      Event.off('didLogin', this.didLogin);
    },
    onShareAppMessage: function (res) {
      let imgUrl = ''
      return {
        title: "天天朵宝",
        path: '/pages/start-page/start-page',
        imgUrl: imgUrl
      }
    },
})