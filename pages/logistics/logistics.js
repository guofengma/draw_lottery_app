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
                let list = datas.Traces;
                let tempList = [];
                this.setData({
                  img: datas.img,
                  deliveryName: datas.deliveryName,
                  LogisticCode: datas.LogisticCode,
                  phone: datas.phone
                })
                if(list.length){
                  list.forEach((item) => {
                    tempList.unshift(item)
                  });
                  this.setData({
                    list: tempList
                  })
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