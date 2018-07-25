let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    datas:[
      {
        name:null,
        'icon1': "/img/duo.png", 
        "icon2":'/img/duo-active.png',
        "showImg1":'duo-dark.png',
        "showImg2": 'card-right.png',
        'number':0
      },
      {
        'name':'朵',
        'icon1': "/img/duo.png",
        "icon2": '/img/duoactive.png',
        "showImg1": 'duo-dark.png',
        "showImg2": 'duo-bg.png',
        'number': 1
      },
      {
        'name': '女',
        'icon1': "/img/nv.png",
        "icon2": '/img/nvactive.png',
        "showImg1": 'nv-dark.png',
        "showImg2": 'nv-bg.png',
        'number': 1
      },
      {
        name:'郎',
        'icon1': "/img/lang.png",
        "icon2": '/img/langactive.png',
        "showImg1": 'lang-dark.png',
        "showImg2": 'lang-bg.png',
        'number': 1
      }
    ],
    disabled: false,
    activeImg:'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/duo-dark.png',
    imgUrl:"https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/",
    activityId:'',
    cardNum:0,//集卡人数
    show:false,
    showBtn: false, // 是否展示地址按钮
    timer:null,
    isStop:false,// 是否停止动画
    showTips1:false, // 是否显示合成字卡的手势 
    showTips2: false, // 是否显示选择地址提示手势
  },
  onLoad: function (options) {
    this.setData({
      activityId:Storage.getActivityId() || ''
    })
    // this.queryActivityWordCard()
    // this.getCardNumber()
    // this.tipsImg()
    let disabled = this.getCardNum() < 3 ? false : true
    let { showTips1 } = this.data
    if (this.data.datas[0].number == 0 && !disabled) {
      console.log(1111)
      showTips1 = true
      this.tipsImg()
    }
    this.setData({
      disabled: disabled,
      showTips1: showTips1
    })
  },
  cardClicked(e){
    let index = e.currentTarget.dataset.index
    let {datas} = this.data
    let activeImg = datas[index].number > 0 ? datas[index].showImg2 : datas[index].showImg1
    this.setData({
      activeImg: this.data.imgUrl+activeImg
    })
  },
  getCardNumber(){
    let params = {
      activityId: this.data.activityId
    }
    let r = RequestFactory.getCardNumber(params);
    r.finishBlock = (req) => {
      this.setData({
        cardNum: req.responseObject.data || 0
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  queryActivityWordCard() {
    let params = {
      activityId: this.data.activityId
    }
    let r = RequestFactory.queryActivityWordCard(params);
    r.finishBlock = (req) => {
      let list = req.responseObject.data || []
      let {datas} = this.data
      list.forEach((item)=>{
        datas.forEach((item0) => {
          if (item0.name == item.awardName){
            Object.assign(item0, item0, item)
          }
        })
      })
      let { activeImg } = this.data
      let { showBtn } = this.data
      if (datas[0].number>0) {
        activeImg = this.data.imgUrl + datas[0].showImg2
        showBtn = true
      }
      let disabled = this.getCardNum()<3? false:true
      let { showTips1 } = this.data.showTips1
      if (datas[0].number == 0 && !disabled) {
        showTips1 = true
        this.tipsImg()
      }
      this.setData({
        datas: datas,
        disabled: disabled,
        activeImg: activeImg,
        showBtn: showBtn,
        showTips1: showTips1
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getCardNum(){
    let num = 0
    let { datas } = this.data
    for (let i = 1; i < datas.length; i++) {
      if (datas[i].number > 0) {
        num++
      }
    }
    return num
  },
  configListCard(){
    let num = this.getCardNum()
    if (num < 3) return
    this.setData({
      showTips1: false
    })
    let params = {
      activityId: this.data.activityId
    }
    let r = RequestFactory.configListCard(params);
    r.finishBlock = (req) => {
      let { datas } = this.data
      if (datas[0].number == 0) {
        this.setData({
          showTips2: true,
          isStop: false,
        })
        this.tipsImg()
      }
      this.queryActivityWordCard()
      this.modelClicked()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  modelClicked(){
    this.setData({
      show: !this.data.show,
      showBtn:true
    })
  },
  chooseAddress(){
    this.setData({
      showTips2: false
    })
    Tool.navigateTo('/pages/address/address-list/address-list?door=2')
  },
  tipsImg(){ //动画效果
    clearInterval(this.data.timer)
    let animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.setData({
      animationData: animation.export()
    })
    let n = 0
    let m = true
    let timer = setInterval(function () {
      if (this.data.isStop) {
        clearInterval(this.data.timer)
        return
      }
      n = n + 1;
      if (m) {
        this.animation.translateY(30).step()
        m = !m;
      } else {
        this.animation.translateY(0).step()
        m = !m;
      }
      this.setData({
        animationData: this.animation.export(),
        timer: timer
      })

    }.bind(this), 1000)
  },
  onUnload(){
    clearInterval(this.data.timer)
  }
})