let {Tool, RequestFactory} = global

Page({
    data: {
        phone: '',
        expTextName: '',
        mailNo: '',
        status: '',
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
            usedId: this.data.id
        };
        let r = RequestFactory.getDelivery(params);
        // let {lists} = this.data
        r.finishBlock = (req) => {
            let datas = req.responseObject.data;
            if (datas) {
                if (datas.showapi_res_body) {
                    this.setData({
                        img: datas.img,
                        expTextName: datas.showapi_res_body.expTextName,
                        mailNo: datas.showapi_res_body.mailNo,
                        status: datas.showapi_res_body.status,
                        phone: datas.phone
                    });
                    if (datas.showapi_res_body.data) {
                        let list = datas.showapi_res_body.data;
                        let tempList = [];
                        if (list.length) {
                            list.forEach((item) => {
                                tempList.push(item)
                            });
                            this.setData({
                                list: tempList
                            })
                        }
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