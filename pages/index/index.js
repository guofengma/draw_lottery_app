//index.js
//获取应用实例
const app = getApp()
let { Tool, RequestFactory, Storage, Event } = global
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
        isShakeBox: false,
        isNotice: true,
        code: '',
        isAuthorize: false,
        visiable: false,
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
        src: '',
        isStop: true,
        audioCtx: '',
        setTime: '',
        setAniTime: '',
        animationData: {},
        winnerBlock: [],
        offsetTop: {},
        activeStartTime: '',
    },
    onLoad: function() {
        this.setData({ // storage 中获取userId
            userId: Storage.memberId() || '',
        })
        this.onStartMusic() // 播放音乐
            // this.getWinnerRequest() // 获取中奖名单
        this.ani() // 旋转动画
            // let that = this
            // setTimeout(function(){
            //   that.getIsNumberHttp() // 获取抽奖次数
            // },5000)
        this.getActivtyId()
        Event.on('didLogin', this.didLogin, this);
    },
    onReady: function() {

    },
    getActivtyId() { // 获取活动Id
        let r = global.RequestFactory.getActivityId();
        r.finishBlock = (req) => {
            Storage.setActivityId(req.responseObject.data.id)
            this.setData({
                activityId: req.responseObject.data.id,
                activeStartTime: req.responseObject.data.startTime
            })
            this.getIsNumberHttp() // 获取抽奖次数
            this.getWinnerRequest() // 获取中奖名单
            this.selectComponent("#showNotice").noticeRequestHttp()
            this.selectComponent("#sign").signListRequestHttp()
            this.selectComponent("#sign").signReady()
        }
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    catchTouchMove: function(res) {
        return false
    },
    onStartMusic() { // 启动音乐
        console.log('启动音乐')
        this.data.audioCtx = wx.createInnerAudioContext()
        this.data.audioCtx.autoplay = true
        this.data.audioCtx.loop = true
        this.data.audioCtx.src = 'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/wxshakeBg.mp3'
    },
    onStopbgMusic() { // 停止音乐
        // wx.stopBackgroundAudio();
        clearInterval(this.data.setAniTime)
        this.data.audioCtx.pause()
        this.setData({
            isStop: false
        })
    },
    onActionbgMusic() { // 播放音乐
        this.setData({
            isStop: true
        })
        this.onStartMusic()
        this.ani(0)
    },
    bindinputCode(e) { // 获取输入防伪码
        this.setData({
            code: e.detail.value
        })
    },
    ani() { // 旋转动画
        var n = 0;
        var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'linear',
        })
        this.animation = animation
        this.animation.rotate(0).step()
        this.setData({
                animationData: animation.export()
            })
            //连续动画需要添加定时器,所传参数每次+1就行
        this.data.setAniTime = setInterval(function() {
            n = n + 1;
            // console.log(n);
            this.animation.rotate(180 * (n)).step()
            this.setData({
                animationData: this.animation.export()
            })
        }.bind(this), 1000)
    },
    didLogin() { // 获取 token
        this.selectComponent("#topBar").getUserId()
        this.setData({
            isAuthorize: Storage.didAuthorize() || '',
        })
    },
    SecurityCodeRequestHttp() { // 防伪码验证
        let data = {
            activityId: Storage.getActivityId() || '',
            code: this.data.code
        };
        let r = RequestFactory.SecurityCodeRequest(data);
        r.finishBlock = (req) => {
            console.log(req.responseObject)
            wx.showModal({
                    title: '兑换成功'
                })
                // let num = req.responseObject.data
                // this.setData({
                //   isNumber: 
                // })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
        this.getIsNumberHttp();
    },
    getIsNumberHttp() { // 查询摇奖次数
        let data = {
            activityId: Storage.getActivityId() || ''
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
    getWinnerRequest() { // 获取公告中奖名单
        let data = {
            activityId: Storage.getActivityId() || ''
        };
        let r = RequestFactory.winnerRequest(data);
        r.finishBlock = (req) => {
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
                let str = res.telephone
                let telIphone = str.substr(0, 3) + "****" + str.substr(7)
                arr[t].push({
                    index: index + 1,
                    tphone: telIphone
                });
            })
            this.setData({
                winnerBlock: arr
            })
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    isShowSake: false,
    onShow: function() { // 进行摇一摇
        let that = this;
        setTimeout(() => {
            console.log(that.data.isNumber)
            let num = parseInt(that.data.isNumber)
            console.log('进入延时')
            if (num === 0) {
                // wx.showToast({
                //     title: '没有次数了',
                // })
            } else {
                that.isShowSake = true
                let lastTime = 0; //此变量用来记录上次摇动的时间
                let x = 0,
                    y = 0,
                    z = 0,
                    lastX = 0,
                    lastY = 0,
                    lastZ = 0; //此组变量分别记录对应x、y、z三轴的数值和上次的数值
                let shakeSpeed = 140; //设置阈值
                let audioCtx = wx.createAudioContext('myAudio');
                // console.log('音乐停了')
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
                            that.data.audioCtx.pause()
                            setTimeout(() => {
                                let data = {
                                    activityId: Storage.getActivityId() || ''
                                };
                                let r = RequestFactory.shakeStartRequest(data);
                                r.finishBlock = (req) => {
                                    console.log('进入异步成功')
                                    console.log(req.responseObject)
                                    let num = that.data.isNumber--
                                        audioCtx = wx.createAudioContext('myAudioShake');
                                    audioCtx.setSrc('https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/success.mp3');
                                    audioCtx.play();
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
                                    console.log('停止背景音乐')
                                    console.log('进入异步失败操作')
                                    console.log(req.responseObject)
                                    audioCtx = wx.createAudioContext('myAudioShake');
                                    audioCtx.setSrc('https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/fail.mp3');
                                    audioCtx.play();
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
            }
        }, 1500)
    },
    onHide: function() {
        this.isShowSake = false // 设置第一次进入
    },
    closeBindshakeBox: function() { // 摇一摇弹框
        this.setData({
            isShakeBox: false
        })
        if (this.data.isNumber === 0) {
            wx.stopAccelerometer()
            wx.showToast({
                title: '没有摇奖次数了',
            })
        } else {
            this.getIsNumberHttp();
            wx.startAccelerometer();
            this.onActionbgMusic();
        }
    },
    closeView(e) { // 显示天天签到
        let currentTime = new Date().getTime();
        let getStartTime = this.data.activeStartTime
        if (getStartTime < currentTime) {
            wx.showModal({
                title: '活动未开启',
                content: '',
            })
        } else {
            if (this.getIsLogin()) {
                this.setData({
                    isTrue: !this.data.isTrue
                })
            }
        }
    },
    showNotice: function(e) { // 显示公告
        this.setData({
            isNotice: !this.data.isNotice
        })
        if (this.data.isNotice) {
            this.selectComponent("#showNotice").noticeRequestHttp()
        }
    },
    goPage() { // 跳转detail
        Tool.navigateTo('/pages/activity-detail/activity-detail')
    },
    awardClicked() { // 跳转我的奖品
        if (this.getIsLogin()) {
            Tool.navigateTo('/pages/my/my')
        }
    },
    getIsLogin() { // 退出之后跳转登录
        let cookies = Storage.getUserCookie() || false
        if (!cookies) {
            Tool.navigateTo('/pages/login/login')
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
        let sysInfo = global.Storage.sysInfo()
        let params = {
                encryptedData: this.data.encryptedData,
                iv: this.data.iv,
                openId: Storage.getWxOpenid() || '',
                name: this.data.userInfo.nickName,
                headImgUrl: this.data.userInfo.avatarUrl,
                loginAddress: '',
                sex: this.data.userInfo.gender
            }
            // 手机型号
        params.mobile = sysInfo.model

        // 手机系统类型
        params.systemType = 3

        // 微信版本
        params.wxVersion = sysInfo.version

        // 系统版本
        params.systemVersion = sysInfo.system

        let r = global.RequestFactory.appWechatLogin(params);
        r.finishBlock = (req) => {
            Tool.loginOpt(req)
        }
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    getUserInfo() { // 获取授权
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
    onUnload: function() {
        Event.off('didLogin', this.didLogin);
    },
})