import WxParse from '../../libs/wxParse/wxParse.js';
let { Tool, RequestFactory } = global

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
        btnNext: '下一条',
        btnPrev: '上一条',
        isBtnFalse: '1',
        isClass: '',
        page: 1,
        noticeCountent: '',
        noticeTitle: '',
        totals: 0,
        starts:0,
        noticeFalse: 'isBtnFalse'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showNotice: function() { // 关闭公告
            this.triggerEvent('showNotice', false)
        },
          myCatchTouch() {
            return
          },
        noticeRequestHttp() { //  公告
            let pages = this.data.page 
            let data = {
              page: pages
            }
            let r = RequestFactory.noticeRequest(data);
            r.finishBlock = (req) => {
              let datas = req.responseObject.data
              console.log(datas)
              if (!Tool.isEmpty(datas)) {
                // console.log('不空')
              let datas = req.responseObject.data;
              let starts = datas.start;
              let totals = datas.total;
                this.setData({
                  totals: totals,
                })
                // console.log(datas.data[0].content)
                // if(starts == 0) {
                //   console.log('222')
                //   this.setData({
                //     isBtnFalse: "1",
                //     // noticeFalse: 'noticeFalse',
                //   })
                // }
                // let isUndefined = datas.data[0]
                // if(datas.total < 1) {
                //   console.log('没了')
                //   this.setData({
                //     isBtnFalse:"1",
                //     btnNext: '关闭'
                //   }) 
                // } else {
                //   console.log('有')
                //   this.setData({
                //     isBtnFalse: "1",
                //   }) 
                // }
                if (datas.data[0].content == "null" || datas.data[0].content == null) {
                  return null
                } else {
                  let html = datas.data[0].content
                  this.setData({
                    noticeTitle: datas.data[0].title
                  })
                  WxParse.wxParse('article', 'html', html, this, 5);
                }
                if ((totals - starts) === 1) {
                  this.setData({
                    btnNext: '关闭',
                    isBtnNext: false,
                  })
                  return false
                } else {
                  this.setData({
                    btnNext: '下一条',
                    isBtnNext: true,
                  })
                }
              }
            };
            Tool.showErrMsg(r);
            r.addToQueue();
        },
        prevPage () {
          console.log(this.data.page)
          if (this.data.page == 1 || this.data.page == '1'){
            console.log('这里')
          //   this.setData({
          //   isBtnFalse: '1',
          // })
          }else {
            console.log('执行')
            let pages = this.data.page
            pages--
            this.setData({
              page: pages,
            })
            if (pages == 1){
              this.setData({
                isBtnFalse: '1',
              })
            }
            this.noticeRequestHttp()
            
            console.log(this.data.page)
          }
        },
        nextPage () {
          
          if(this.data.page === this.data.totals) {
                console.log(1)
          } else {
            let pages = this.data.page
            pages++
            this.setData({
              page: pages,
              isBtnFalse: '2',
              noticeFalse: ''
            })
            this.noticeRequestHttp()
            
            console.log(this.data.page)
          }
        }
    },
    ready() {
        // this.noticeRequestHttp() // 获取公告
        console.log('公告')
        console.log(this.data.page)
    }
})