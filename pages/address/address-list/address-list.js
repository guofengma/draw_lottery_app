let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    addressList:[],
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
    let address = this.data.addressList[index]
    if(door==1){
      // 返回到订单页面
      this.updateOrderAddress(address)
    } else if(door==2){
      // 新增朵地址
      this.updateUserCheckedAddress(address)
    }
  },
  goPage(){
    Tool.navigateTo('/pages/address/edit-address/edit-address')
  },
  updateOrderAddress(e){
    Storage.setOrderAddress(address)
    Event.emit('updateOrderAddress')
    Tool.navigationPop()
  },
  updateUserCheckedAddress(address){
    let params = {
      id: address.id
    }
    let r = RequestFactory.updateUserCheckedAddress(params);
    r.finishBlock = (req) => {
      Event.emit('updateAdressList')
      Tool.navigationPop()
    };
    r.addToQueue();
  },
  queryUserAddressList() {
    let str = this.data.door == 1 ? "efault_status" :"duo_is"
    let params = {
      sort:str
    }
    let r = RequestFactory.queryUserAddressList(params);
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