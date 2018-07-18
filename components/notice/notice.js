// components/top-bar/top-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isNotice:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isTrue: true,
    isNotice:false,
    btnText: '下一条'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showNotice: function () { // 关闭公告
      this.triggerEvent('showNotice', false)
    }
  }
})
