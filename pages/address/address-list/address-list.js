let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    lists:[
      {name:"陈我IE我IE",phone:'184583221',address:'哈哈哈哈哈'}
    ],
    door:0, // 2 朵地址
    showDefault:true,
  },
  onLoad: function (options) {
    let showDefault = this.data.showDefault
    if (options.door==2){
      showDefault = false
    }
    this.setData({
      door: options.door || 0,
      showDefault: showDefault
    })
    this.queryUserAddressList()
    Event.on('updateAdressList', this.queryUserAddressList, this)
  },
  addressLineClicked(e){
    let {door} = this.data
    let index = e.currentTarget.dataset.index
    let address = this.data.lists[index]
    if(door==1){
      // 返回到订单页面
    } else if(door==2){
      // 新增朵地址
      this.updateUserCheckedAddress(address)
    }
  },
  goPage(){
    Tool.navigateTo('/pages/address/edit-address/edit-address')
  },
  addressLineClicked(e){
    let index = e.currentTarget.dataset.index
    let {lists} = this.data
    Storage.setOrderAddress(lists[index])
    Event.emit('updateOrderAddress')
    Tool.navigationPop()
  },
  queryUserAddressList() {
    let r = RequestFactory.queryUserAddressList();
    r.finishBlock = (req) => {
      if (req.responseObject.data.length > 0) {
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    r.addToQueue();
  },
  onUnload: function () {

  }
})