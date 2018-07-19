let { Tool, RequestFactory } = global
Page({
  data: {
    lists: [],
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 5, // 每次加载请求的条数 默认10 
    params: {},
    selectArr:{}, //保存选中的产品规格
  },
  onLoad: function (options) {
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage
    }
    this.setData({
      params: params
    })
    this.querySecuritycodeUsedList(params)
  },
  querySecuritycodeUsedList(params){
    let r = RequestFactory.querySecuritycodeUsedList(params);
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
  onScroll() {
    // 向下滑动的时候请求数据
    if (this.data.currentPage >= this.data.totalPage) return
    let page = this.data.currentPage
    page += 1
    let { params } = this.data
    params.page = page
    this.setData({
      currentPage: page,
      params: params
    })
    this.querySecuritycodeUsedList(this.data.params)
  },
  chooseClicked(e){
    let index = e.currentTarget.dataset.index
    let {lists} = this.data
    lists.forEach((item)=>{
      item.isSelect = false
    })
    lists[index].isSelect = !lists[index].isSelect
    this.setData({
      lists:lists,
      selectArr: lists[index]
    })
  },
  submitClicked(){
    Tool.redirectTo('/pages/order-confirm/order-confirm?id=' + this.data.selectArr.id)
  }
})