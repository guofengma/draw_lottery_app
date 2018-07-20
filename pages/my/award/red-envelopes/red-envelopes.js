let { Tool, RequestFactory, Storage } = global
Page({
  data: {
    lists:[],
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 10, // 每次加载请求的条数 默认10 
    params: {},
  },
  onLoad: function (options) {
    let activityId = Storage.getActivityId() || 1
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage,
      activityId: activityId
    }
    this.setData({
      params: params,
      activityId: activityId
    })

    this.queryActivityRedPackageList(params)
  },
  queryActivityRedPackageList(params){
    let r = RequestFactory.queryActivityRedPackageList(params);
    let { lists} = this.data
    r.finishBlock = (req) => {
      let datas = req.responseObject.data
      if (datas.resultCount > 0) {
        datas.data.forEach((item)=>{
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
    this.queryActivityRedPackageList(this.data.params)
  },
})