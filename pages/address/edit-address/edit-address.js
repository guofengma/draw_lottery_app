let { Tool, RequestFactory, Event } = global

Page({
  data: {
    addressList:[],
    door:''
  },

  onLoad: function (options) {
    Tool.isIPhoneX(this)
    this.setData({
      door: options.door || '',
    })
    this.queryUserAddressList() 
    Event.on('updateAdressList', this.queryUserAddressList, this)
  },
  onUnload: function () {
  
  },
  setDefault(e) {
    let id = this.getAddressId(e).id
    let params ={
      defaultStatus:1,
      id: id
    }
    let r = RequestFactory.updateUserAddress(params);
    r.finishBlock = (req) => {
      this.queryUserAddressList()
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  getAddressId(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.addressList[index].id
    return { index, id }
  },
  deleteAddress(e) {
    let callBack = ()=>{
      let item = this.getAddressId(e)
      let r = RequestFactory.deleteUserAddress({ id: item.id });
      r.finishBlock = (req) => {
        let list = this.data.addressList
        list.splice(item.index, 1)
        this.setData({
          addressList: list
        })
        Event.emit('updateAdressList')
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
    Tool.showComfirm('确认删除该地址吗?', callBack)
  },
  editAddress(e) {
    let index = this.getAddressId(e).index
    let list = this.data.addressList[index]
    this.newAddress(list,2)
  },
  newAddress(list, types=1) {

    let page = '/pages/address/new-address/new-address?type=' + types+"&door="+this.data.door

    if (types==2){
      page = page + '&address=' + JSON.stringify(list)
    }
    Tool.navigateTo(page)
  },
  queryUserAddressList() {
    let r = RequestFactory.queryUserAddressList({},this.data.door);
    r.finishBlock = (req) => {
      if (req.responseObject.data.length > 0) {
        this.setData({
          addressList: req.responseObject.data
        })
      } else {
        this.setData({
          addressList: []
        })
      }
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  onUnload: function () {
    Event.off('updateAdressList', this.queryUserAddressList)
  }
})