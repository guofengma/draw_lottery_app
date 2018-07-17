let { Tool, RequestFactory, Event } = global

Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  addressLineClicked(){
    // 返回到订单页面
  },
  goPage(){
    Tool.navigateTo('/pages/address/edit-address/edit-address')
  },
  onUnload: function () {

  }
})