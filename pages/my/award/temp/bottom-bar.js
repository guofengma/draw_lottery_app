let { Tool, Storage, RequestFactory } = global;

Component({
  properties: {
    index:Number
  },
  data: {
    page:[
      "pages/my/award/award-goods/award-goods",
      "pages/my/award/card/card",
      "pages/my/award/red-envelopes/red-envelopes"
    ],
    isShowRedPackage:false
  },
  methods: {
    goPage(e){
      let index = e.currentTarget.dataset.index
      let {page} = this.data

      if (Tool.getCurrentPageUrl() == page[index] ) return

      Tool.redirectTo("/"+page[index])   
    },
    getRedPackageNum() {
      let params = {
        activityId: Storage.getActivityId() || ''
      }
      let r = RequestFactory.getRedPackageNum(params);
      r.finishBlock = (req) => {
        let datas = req.responseObject.data>0? true:false
        this.setData({
          isShowRedPackage: datas
        })
        Storage.setRedPackageNum(datas)
      };
      Tool.showErrMsg(r)
      r.addToQueue();
    }
  },
  ready: function () {
    Tool.isIPhoneX(this)
    // 如果没有红包的话 就一直请求是否有红包 有红包的话 不再进行请求
    if (!Storage.getRedPackageNum()){
      this.getRedPackageNum()
    }
  }
})
