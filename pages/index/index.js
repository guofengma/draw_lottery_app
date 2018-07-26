//index.js
//获取应用实例
let {Tool, RequestFactory, Storage, Event} = global
Page({
    data: {
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
        isNotice: false,
        isFixed:false,
        hasNotice: false,
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
        animationData: {},
        winnerBlock: [],
        offsetTop: {},
        activeStartTime: '',
        activeEndTime: '',
        SignActivtyId: false,
        disabled: false,
        isPlusNumber: false,
        isReduceNumber: false,
        isDrawn: true,
        preHint: '', // 开始提示
        sufHint: '', // 结束提示
        actStauts: '',
        isDisplay: true,
        shakeStartMusicSrc: '',
        shakeStopMusicSrc: '',
        isShowNotice: false,
    },
    onLoad: function () {
        this.setData({ // storage 中获取userId
            userId: Storage.memberId() || '',
        });
        Tool.isIPhoneX(this);
        // this.onStartMusic() // 播放音乐
        this.ani(); // 旋转动画
        this.getActivtyId();
        //this.selectComponent("#sign").signReady();
        Event.on('didLogin', this.didLogin, this);
        // istotal()
        let data = {
            page: 1
        };
        let r = global.RequestFactory.noticeRequest(data);
        r.finishBlock = (req) => {
            let datas = req.responseObject.data;
            let totals = datas.total;
            if (totals == 0) {
                this.setData({
                    isNotice: false,
                    hasNotice:false
                });
            } else {
                this.setData({
                    isNotice: true,
                    hasNotice:true
                });
                this.selectComponent("#showNotice").noticeRequestHttp()
            }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    onReady: function () {

    },
    istotal(e) {
        let num = e.detail
        console.log(num)
    },
    getActivtyId() { // 获取活动Id
        let r = global.RequestFactory.getActivityId();
        r.finishBlock = (req) => {
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
            console.log(this.data.shakeStartMusicSrc)
            console.log(this.data.shakeStopMusicSrc)
            // if (this.getIsLogin(false)) {
            // let currentTime = new Date().getTime(); // 当前时间
            let currentTime = this.data.activeEndTime
            let getStartTime = this.data.activeStartTime //活动开始时间
            if (getStartTime > currentTime) {
                console.log('活动未开启')
                this.setData({
                    SignActivtyId: true
                })
            } else {
                console.log('这？')
                this.setData({
                    SignActivtyId: false // 活动开启
                })
            }
            console.log(this.data.SignActivtyId)
            // }
            //this.getIsNumberHttp() // 获取抽奖次数
            this.getWinnerRequest() // 获取中奖名单
            // this.selectComponent("#showNotice").noticeRequestHttp()
        }
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    catchTouchMove: function (res) {
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
        clearInterval(this.data.setAniTime)
        this.setData({
            isStop: false
        })
    },
    onActionbgMusic() { // 播放音乐
        this.setData({
            isStop: true
        })
        // this.onStartMusic()
        // this.ani(0)
    },
    bindinputCode(e) { // 获取输入防伪码
        this.setData({
            code: e.detail.value
        })
    },
    bindFocus() {
        // 活动未开启input 无法输入
        let currentTime = this.data.activeEndTime
        let getStartTime = this.data.activeStartTime //活动开始时间
        // console.log(getStartTime > currentTime)
        if (getStartTime > currentTime) {
            console.log('活动未开启')
            this.setData({
                disabled: true
            })
            wx.showModal({  // 活动未开启
                title: '',
                content: this.data.preHint,
            })
        } else {
            console.log('这？')
            this.setData({
                disabled: false,
                isDisplay: false
            })
        }
    },
    bindBlur() {
        let currentTime = this.data.activeEndTime
        let getStartTime = this.data.activeStartTime //活动开始时间
        console.log(getStartTime > currentTime)
        if (getStartTime > currentTime) {
            console.log('活动未开启')
            this.setData({
                disabled: true
            })
            wx.showModal({  // 活动未开启
                title: '',
                content: this.data.preHint,
            })
        } else {
            this.setData({
                disabled: false,
                isDisplay: false
            })
        }
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
        this.data.setAniTime = setInterval(function () {
            n = n + 1;
            this.animation.rotate(180 * (n)).step()
            this.setData({
                animationData: this.animation.export()
            })
        }.bind(this), 1000)
    },
    didLogin() { // 获取 token
        this.selectComponent("#topBar").getUserId()
        this.getIsNumberHttp() // 获取抽奖次数
        this.setData({
            isAuthorize: Storage.didAuthorize() || '',
        })
    },
    SecurityCodeRequestHttp() { // 防伪码验证
        let code = this.data.code;
        this.setData({
            userId: Storage.memberId() || ''
        })
        // console.log(this.data.userId)
        let currentTime = this.data.activeEndTime
        let getStartTime = this.data.activeStartTime //活动开始时间
        if (getStartTime > currentTime) {
            Tool.showAlert('活动未开启')
        } else {
            if (this.data.userId == '' || this.data.userId == null) {
                return
            }
            if (this.data.code === '' || this.data.code === null) {
                console.log('code为空')
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
                    console.log(req.responseObject)
                    // Tool.showModal('兑换成功')
                    wx.showToast({
                        title: '兑换成功',
                    })
                    this.setData({
                        isPlusNumber: true
                    })
                    this.getIsNumberHttp()
                    wx.startAccelerometer();
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
            // console.log(req.responseObject)
            let num = req.responseObject.data
            this.setData({
                isNumber: num,
            })
            setTimeout(() => {
                that.setData({
                    isPlusNumber: false
                })
            }, 1500)
            wx.startAccelerometer();
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
            if (Tool.isEmpty(req.responseObject.data)) {

            } else {
                console.log(req.responseObject.data[0].telephone)
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
                        console.log('wei NUll')
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
                                // console.log(telIphone)
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
    isShowSake: false,
    onShow: function () { // 进行摇一摇
        let that = this;
        setTimeout(() => {
            let num = parseInt(that.data.isNumber)
            // if(num == 0) {
            //   Tool.showAlert('没有次数')
            // } else {

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
                        setTimeout(() => {
                            let data = {
                                activityId: Storage.getActivityId() || ''
                            };
                            let r = RequestFactory.shakeStartRequest(data);
                            r.finishBlock = (req) => {
                                console.log('进入异步成功')
                                console.log(req.responseObject)
                                console.log(typeof req.responseObject.ptype)
                                let num = that.data.isNumber--
                                audioCtx = wx.createAudioContext('myAudioShake');
                                audioCtx.setSrc(this.data.shakeStartMusicSrc);
                                audioCtx.play();
                                if (req.responseObject.data.pType == 1 || req.responseObject.data.pType == '1') { // 实物
                                    that.setData({
                                        isNumber: num,
                                        isShowModelTitle: '恭喜你，中奖啦',
                                        isShakeBox: true,
                                        isMaterial: true,
                                        isReduceNumber: true,
                                        isMaterialUrl: req.responseObject.data.imgUrl,
                                        isMaterialName: req.responseObject.data.awardName
                                    })
                                } else if (req.responseObject.data.pType == 2 || req.responseObject.data.pType == '2') { // 字卡
                                    that.setData({
                                        isNumber: num,
                                        isShowModelTitle: '恭喜你，中奖啦',
                                        isShakeBox: true,
                                        iscardZJL: true,
                                        isReduceNumber: true,
                                        iscardUrl: req.responseObject.data.imgUrl,
                                        iscardName: req.responseObject.data.awardName
                                    })
                                } else if (req.responseObject.data.pType == 3 || req.responseObject.data.pType == '3') { // 红包
                                    that.setData({
                                        isNumber: num,
                                        isShowModelTitle: '恭喜你，中奖啦',
                                        isShakeBox: true,
                                        ishongbao: true,
                                        isReduceNumber: true,
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
                                let start = () => {
                                    wx.startAccelerometer();
                                }
                                if (req.responseObject.code === 600) {
                                    console.log(req.responseObject)
                                    audioCtx = wx.createAudioContext('myAudioShake');
                                    audioCtx.setSrc(this.data.shakeStopMusicSrc);
                                    audioCtx.play();
                                    let num = that.data.isNumber--
                                    that.setData({
                                        isNumber: num,
                                        isShowModelTitle: '很遗憾，未中奖',
                                        isShakeBox: true,
                                        isWzj: true,
                                        isReduceNumber: true,
                                        isDrawn: false
                                    })
                                    wx.hideLoading()
                                    // that.getIsNumberHttp()
                                } else {
                                    Tool.showAlert(req.responseObject.msg, start)
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
            this.getWinnerRequest() // 获取中奖名单
            // }
        }, 1500)
    },
    onHide: function () {
        this.isShowSake = false // 设置第一次进入
    },
    closeBindshakeBox: function () { // 摇一摇弹框
        let that = this
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
        setTimeout(() => {
            that.setData({
                isReduceNumber: false
            })
        }, 1500)
    },
    closeView(e) { // 显示天天签到
        this.setData({
            isTrue: !this.data.isTrue,
            isFixed:!this.data.isFixed
        })
      
        // this.selectComponent("#sign").signListRequestHttp()
        // this.selectComponent("#sign").signReady()
        wx.startAccelerometer()
    },
    showNotice: function (e) { // 显示公告
        this.setData({
            isNotice: !this.data.isNotice
        })
        if (this.data.isNotice) {
            this.selectComponent("#showNotice").noticeRequestHttp()
        }
        let currentTime = this.data.activeEndTime
        let getStartTime = this.data.activeStartTime //活动开始时间
        if (getStartTime > currentTime) { // 没开始

        } else {
            this.getIsSign()
        }
    },
    getIsSign() { // 用户是否签到
        let data = {
            activityId: Storage.getActivityId() || ''
        }
        let r = RequestFactory.signIsTrueRequest(data);
        r.finishBlock = (req) => {
            console.log(req.responseObject.data.userId)
            let userId = req.responseObject.data.userId
            if (userId == null || userId == 'null') {
                console.log('未签到')
                this.setData({
                    isTrue: true
                })
                if (this.data.isAuthorize) {
                    // this.selectComponent("#sign").signListRequestHttp()
                    // this.selectComponent("#sign").signReady()
                }
            } else {
                console.log('已签到')
                this.setData({
                    isTrue: false
                })
            }
        }
        Tool.showErrMsg(r)
        r.addToQueue();
    },
    goPage() { // 跳转detail
        if (this.getIsLogin()) {
            Tool.navigateTo('/pages/activity-detail/activity-detail')
        }
    },
    awardClicked() { // 跳转我的奖品
        if (this.getIsLogin()) {
            Tool.navigateTo('/pages/my/my')
        }
        // this.data.audioCtx.pause()
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
        wx.getUserInfo({
            success: res => {
                this.getLogin(res.userInfo)
            },
            fail: function () {

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
    onUnload: function () {
        Event.off('didLogin', this.didLogin);
    },
})