let { Tool, RequestFactory, Storage, Event} = global

Page({
  data: {
    lists:[],
    hidden:false,
    activeList:{index:"",id:"",content:""}
  },
  onLoad: function (options) {
    this.queryDictionaryDetailsType()
  },
  queryDictionaryDetailsType(){
    let r = RequestFactory.queryDictionaryDetailsType({ dType: 3 });
    r.finishBlock = (req) => {
      this.setData({
        lists: req.responseObject.data|| []
      })
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  },
  chooseType(){
    this.setData({
      hidden: !this.data.hidden
    })
  },
  chooseType(){
    this.setData({
      hidden: !this.data.hidden
    })
  },
  cellClicked(e){
    let index = e.currentTarget.dataset.index
    let id = this.data.lists[index].dKey
    let content = this.data.lists[index].dValue
    this.setData({
      activeList: {index,id,content}
    })
    this.chooseType()
  },
  uploadImage(e) {
    this.setData({
      originalImg: e.detail.originalImg,
      smallImg: e.detail.smallImg,
    })
  },
  formSubmit(e) {
    let params = e.detail.value
    if (Tool.isEmptyStr(params.name)){
      Tool.showAlert("请填写用户姓名");
      return
    }
    if (Tool.isEmptyStr(this.data.activeList.id)) {
      Tool.showAlert("请选择反馈的问题类型");
      return
    }
    if (!Tool.checkPhone(params.telphone)) {
      Tool.showAlert("请输入正确的电话号码");
      return
    }
    if (Tool.isEmptyStr(params.feedback)) {
      Tool.showAlert("请描述相关问题信息");
      return
    }
    let obj = {
      activityCode: Storage.getActivityId() || '',
      originalImg: JSON.stringify(this.data.originalImg) || JSON.stringify([]),
      smallImg: JSON.stringify(this.data.smallImg) || JSON.stringify([]),
      'type': this.data.activeList.id
    }
    Object.assign(params, params, obj)
    this.addFeedback(params)
  },
  addFeedback(params){
    let r = RequestFactory.addFeedback(params);
    r.finishBlock = (req) => {
      Event.emit('updateFeedback')
      Tool.navigateTo('/pages/my/feedback/submit-feedback/submit-feedback')
    };
    Tool.showErrMsg(r)
    r.addToQueue();
  }
})