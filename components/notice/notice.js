import WxParse from '../../libs/wxParse/wxParse.js';
let { Tool, RequestFactory, Storage } = global

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isNotice: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        isTrue: true,
        isNotice: false,
        btnText: '下一条',
        page: 1,
        noticeCountent: '',
        noticeTitle: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showNotice: function() { // 关闭公告
            this.triggerEvent('showNotice', false)
        },
        noticeRequestHttp() {
            let data = {
                page: this.data.page
            }
            let r = RequestFactory.noticeRequest(data);
            r.finishBlock = (req) => {
              console.log(req.responseObject)
              let datas = req.responseObject.data
              if(datas.data[0] === '') {
                console.log('没了')
              }
              Storage.setActivityId(datas.data[0].activity_id)
              let html = datas.data[0].content
              this.setData({
                noticeTitle: datas.data[0].title
              })
              WxParse.wxParse('article', 'html', html, this, 5);
            };
            Tool.showErrMsg(r);
            r.addToQueue();
        },
        prevPage () {
          this.data.page --
          this.noticeRequestHttp()
        },
        nextPage () {
          this.data.page ++
          this.noticeRequestHttp()
        }
    },
    ready() {
        this.noticeRequestHttp()
        console.log('公告')
    }
})