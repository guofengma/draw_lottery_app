let { Tool, RequestFactory } = global

Page({
  data: {

  },
  onLoad: function (options) {

  },
  goPage() {
    Tool.redirectTo('/pages/my/my-order/my-order')
  }
})