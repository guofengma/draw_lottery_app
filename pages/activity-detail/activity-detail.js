//获取应用实例
import WxParse from '../../libs/wxParse/wxParse.js';

let { Tool, Storage } = global
Page({
  data: {
    current:0,
  },
  onLoad: function (options) {
    Tool.isIPhoneX(this); // 判断是否是iPhone X
    this.setData({
      info: Storage.getActivityDetail() || ''
    })
    this.initHtml()
  },
  changeInf(e){
    let index=e.currentTarget.dataset.index;
    this.setData({
      current:index
    })
    this.initHtml()
  },
  initHtml(){
    if (!this.data.info) return
    let html = ''
    if (this.data.current == 0) {
      html = this.data.info.introduce
    } else {
      html = this.data.info.awardContent
    }
    if (html === null) {
      html = ''
    }
    WxParse.wxParse('article', 'html', html, this, 5);
  }
})