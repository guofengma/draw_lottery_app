let { Tool, RequestFactory } = global
Page({
  data: {
    currentTab:0,
    totalPage: '', // 页面总页数
    currentPage: 1, // 当前的页数
    pageSize: 5, // 每次加载请求的条数 默认10 
    params: {},
    code: ''
  },
  onLoad: function () {
    let params = {
      pageSize: this.data.pageSize,
      page: this.data.currentPage,
      status: this.data.currentTab+1
    }
    this.setData({
      params: params
    })
    this.queryByCreateUserList(params)
  },
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      let params = {
        pageSize: this.data.pageSize,
        page: 1,
        status: parseInt(cur)+1
      }
      this.setData({
        currentTab: cur,
        currentPage: 1,
        params: params
      })
      this.queryByCreateUserList(params)
    }
  },
  queryByCreateUserList(params) {
    let r = RequestFactory.queryActivityRedPackageList(params);
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
    this.queryByCreateUserList(this.data.params)
  },
})