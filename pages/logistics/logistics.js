let {Tool, RequestFactory} = global

Page({
    data: {
        phone: '',
        deliveryName: '',
        LogisticCode: '',
        img: '',
        id: '',
        name: '',
        list: []
    },
    onLoad: function (options) {
        this.setData({
            id: options.id || ''
        })
        this.getDelivery()
    },
    getDelivery() {
        let params = {
            usedId: 153
        };
        let r = RequestFactory.getDelivery(params);
        // let {lists} = this.data
        r.finishBlock = (req) => {
            let datas = req.responseObject.data;
            if (datas) {
              if (datas.showapi_res_body && datas.showapi_res_body.data){
              
                this.setData({
                  img: datas.img,
                  expTextName: datas.expTextName,
                  mailNo: datas.showapi_res_body.mailNo,
                  phone: datas.phone
                })
                let list = datas.showapi_res_body.data;
                let tempList = [];
                if (list.length) {
                  list.forEach((item) => {
                    tempList.unshift(item)
                  });
                  this.setData({
                    list: tempList
                  })
                }
              }
               
            }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    makePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone,
            success: () => {
                console.log("成功拨打电话")
            }
        })
    }
})