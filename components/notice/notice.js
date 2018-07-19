// components/top-bar/top-bar.js
let { Tool, RequestFactory } = global
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
    btnText: '下一条',
    page: 1,
    noticeCountent: '',
    noticeTitle:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showNotice: function () { // 关闭公告
      this.triggerEvent('showNotice', false)
    },
    noticeRequestHttp(){
      let data = {
        page:this.data.page
      }
      let r = RequestFactory.noticeRequest(data);
      r.finishBlock = (req) => {
        console.log(req.responseObject)
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    }
  },
  ready(){
    this.noticeRequestHttp()
    console.log('公告')
  }
})
