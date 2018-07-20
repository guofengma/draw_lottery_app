import WxParse from '../../libs/wxParse/wxParse.js';
let { Tool, RequestFactory, Storage } = global

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
        isNotice: false,
        btnNext: '下一条',
        btnPrev: '上一条',
        isBtnFalse: true,
        isClass: '',
        page: 1,
        noticeCountent: '',
        noticeTitle: '',
        totals: 0
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
              if (req.responseObject.data === null) {
                return
              } else {
              console.log(req.responseObject.data)
              let datas = req.responseObject.data;
              let starts = datas.start;
              let totals = datas.total;
              this.setData({
                totals: totals
              })
              // console.log(starts)
              let isUndefined = datas.data[0]
              if(datas.total < 1) {
                console.log('没了')
                this.setData({
                  isBtnFalse:false,
                  btnNext: '关闭'
                }) 
              } else {
                console.log('有')
                this.setData({
                  isBtnFalse: true
                }) 
              }
              Storage.setActivityId(datas.data[0].activity_id)
              let html = datas.data[0].content
              this.setData({
                noticeTitle: datas.data[0].title
              })
              WxParse.wxParse('article', 'html', html, this, 5);
              if ((totals - starts) === 1) {
                this.setData({
                  btnNext: '关闭',
                  isBtnFalse:false
                })
                return false
              } else {
                this.setData({
                  btnNext: '下一条',
                  isBtnFalse: true
                })
              } 
            };
            Tool.showErrMsg(r);
            r.addToQueue();
            }
        },
        prevPage () {
          if(this.data.totals === 1){
            
          }else {
            this.data.page--
            this.noticeRequestHttp()
          }
        },
        nextPage () {
          if(this.data.page === this.data.totals) {
            this.showNotice()
          } else {
            this.data.page++
            this.noticeRequestHttp()
          }
        }
    },
    ready() {
        this.noticeRequestHttp()
        console.log('公告')
    }
})