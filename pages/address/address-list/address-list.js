let { Tool, RequestFactory, Event, Storage } = global

Page({
  data: {
    addressList:[],
    door:0, // 2 朵地址
  },
  onLoad: function (options) {
    let showDefault = this.data.showDefault ||''
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
  updateOrderAddress(address){
    address.showDefault = false
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
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  queryUserAddressList() {
    let str = this.data.door == 1 ? "efault_status" :"duo_is"
    let params = {
      sort:str
    }
    let r = RequestFactory.queryUserAddressList(params);
    r.finishBlock = (req) => { 
      let datas = req.responseObject.data
      if (datas.length > 0) {
        datas.forEach((item)=>{
          if(this.data.door!=2){
            item.showDefault = item.default_status == 1 ? true : false
          }
        })
        this.setData({
          addressList: req.responseObject.data
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onUnload: function () {

  }
})