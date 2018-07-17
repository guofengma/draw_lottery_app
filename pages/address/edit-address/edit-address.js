let { Tool, RequestFactory, Event } = global

Page({
  data: {
  
  },

  onLoad: function (options) {
  
  },
  onUnload: function () {
  
  },
  setDefault(e) {
    let id = this.getAddressId(e).id
    // let r = RequestFactory.setDefaultAddress({ id: id });
    // r.finishBlock = (req) => {
    //   this.queryUserAddressList()
    // };
    // r.addToQueue();
  },
  getAddressId(e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.addressList[index].id
    return { index, id }
  },
  deleteAddress(e) {
    let item = this.getAddressId(e)
    // let r = RequestFactory.deleteUserAddress({ id: item.id });
    // r.finishBlock = (req) => {
    //   let list = this.data.addressList
    //   list.splice(item.index, 1)
    //   this.setData({
    //     addressList: list
    //   })
    // };
    // r.addToQueue();
  },
  editAddress(e) {
    // let index = this.getAddressId(e).index
    // let list = this.data.addressList[index]
    // this.newAddress(list,2)
  },
  newAddress(list, types=1) {
    let page = '/pages/address/new-address/new-address?type=' + types

    if (types){
      page = page + '&address=' + JSON.stringify(list)
    }
    Tool.navigateTo(page)
  },
})