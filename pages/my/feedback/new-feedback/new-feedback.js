let { Tool, RequestFactory} = global

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
})