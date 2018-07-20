let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    address:{}
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      list: Storage.getOrderList() || ''
    })
    this.queryUserAddressList()
    Event.on('updateOrderAddress', this.updateOrderAddress, this)
  },
  chooseAddress(){
    Tool.navigateTo('/pages/address/address-list/address-list?door=1')
  },
  updateOrderAddress(){
    this.setData({
      address: Storage.getOrderAddress() || {}
    })
  },
  queryUserAddressList() {
    let params = {
      sort: "efault_status"
    }
    let r = RequestFactory.queryUserAddressList(params);
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.length > 0) {
        this.setData({
          address: req.responseObject.data[0]
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  makeOrder(){
    let params = {
      addressId: this.data.address.id,
      id: this.data.list.id
    }
    let r = RequestFactory.makeOrder(params);
    r.finishBlock = (req) => {
      Tool.navigateTo('/pages/order-confirm/submit-order/submit-order')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onUnload: function () {
    Event.off('updateOrderAddress', this.updateOrderAddress)
  }
})