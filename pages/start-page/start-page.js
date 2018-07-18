let { Tool } = global
Page({
  data: {
    second:3,
    time:'',
  },
  onLoad: function (options) {
    this.countDown(this)
  },
  countDown(that){
    let second = that.data.second;
    clearTimeout(that.data.time);
    if (second == 0) {
      Tool.redirectTo('/pages/index/index')
      return;
    }
    let time = setTimeout(function () {
      that.setData({
        second: second - 1,
      });
      that.countDown(that);
    }, 1000)
    this.setData({
      time: time
    });
  },
  onUnload: function () {
    clearTimeout(this.data.time);
  }
})