let { Tool, RequestFactory } = global
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  swichNav: function (e) {
    let cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  goPage(e){
    let id = e.target.dataset.id;
    Tool.navigateTo('/pages/logistics/logistics?id='+id)
  }
})