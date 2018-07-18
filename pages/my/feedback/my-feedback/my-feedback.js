let { Tool, RequestFactory } = global
Page({
  data: {
    currentTab:'' 
  },
  onLoad: function () {
   
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
})