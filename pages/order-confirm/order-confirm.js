let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    address:{}
  },
  onLoad: function (options) {
    Event.on('updateOrderAddress', this.updateOrderAddress, this)
  },
  chooseAddress(){
    Tool.navigateTo('/pages/address/address-list/address-list')
  },
  updateOrderAddress(){
    this.setData({
      address: Storage.getOrderAddress() || {}
    })
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
  }
})