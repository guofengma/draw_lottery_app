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
    getDelivery(params){
        let r = RequestFactory.getDelivery(params);
        let { lists } = this.data
        r.finishBlock = (req) => {
            let datas = req.responseObject.data
            if (datas.resultCount > 0) {
                datas.data.forEach((item) => {
                    item.createTime = Tool.formatTime(item.create_time)
                })
                this.setData({
                    lists: lists.concat(datas.data),
                    totalPage: datas.total
                })
            }
        };
        Tool.showErrMsg(r)
        r.addToQueue();
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