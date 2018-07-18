let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    lists:[
      {name:"陈我IE我IE",phone:'184583221',address:'哈哈哈哈哈'}
    ]
  },
  onLoad: function (options) {
  
  },
  addressLineClicked(){
    // 返回到订单页面
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
  onUnload: function () {

  }
})