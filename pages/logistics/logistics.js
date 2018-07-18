let { Tool, RequestFactory } = global

Page({
  data: {
    phone:'18758328354'
  },
  onLoad: function (options) {
    this.setData({
      id: options.id || ''
    })
  },
  makePhoneCall () {
    wx.makePhoneCall({
      phoneNumber:this.data.phone,
      success: ()=>{
        console.log("成功拨打电话")
      }
    })
  }
})