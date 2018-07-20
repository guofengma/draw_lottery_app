let { Tool, RequestFactory } = global
Page({
  data: {
    id:''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.findFeedbackById(options.id)
  },
  findFeedbackById(params) {
    let r = RequestFactory.findFeedbackById({ id: params});
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      this.setData({
        list: datas
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})