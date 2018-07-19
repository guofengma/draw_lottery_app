let { Tool, RequestFactory } = global
Page({
  data: {
    datas:[
      {
        'icon1': "/img/duo.png", 
        "icon2":'/img/duoactive.png',
        "showImg1":'duo-dark.png',
        "showImg2": 'card-right.png',
        length:0
      },
      {
        'icon1': "/img/duo.png",
        "icon2": '/img/duoactive.png',
        "showImg1": 'duo-dark.png',
        "showImg2": 'duo-bg.png',
        length: 1
      },
      {
        'icon1': "/img/nv.png",
        "icon2": '/img/nvactive.png',
        "showImg1": 'nv-dark.png',
        "showImg2": 'nv-bg.png',
        length: 1
      },
      {
        'icon1': "/img/lang.png",
        "icon2": '/img/langactive.png',
        "showImg1": 'lang-dark.png',
        "showImg2": 'lang-bg.png',
        length: 2
      }
    ],
    disabled: false,
    activeImg:'https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/duo-dark.png',
    imgUrl:"https://dnlcjxt.oss-cn-hangzhou.aliyuncs.com/xcx/"
  },
  onLoad: function (options) {
  
  },
  cardClicked(e){
    let index = e.currentTarget.dataset.index
    let {datas} = this.data
    let activeImg = datas[index].length > 0 ? datas[index].showImg2 : datas[index].showImg1
    this.setData({
      activeImg: this.data.imgUrl+activeImg
    })
  },
})