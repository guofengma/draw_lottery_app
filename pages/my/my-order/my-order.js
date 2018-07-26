let {Tool, RequestFactory,Storage} = global
Page({
    data: {
        list: [],
        totalPage: '', // 页面总页数
        currentPage: 1, // 当前的页数
        pageSize: 10, // 每次加载请求的条数 默认10
        params: {},
        activityId:'', //活动id
        expressStatus:''//状态
    },
    onLoad: function (options) {
        let activityId = Storage.getActivityId() || 1;
        let params = {
            pageSize: this.data.pageSize,
            page: this.data.currentPage,
            activityId: activityId,
            expressStatus:this.data.expressStatus
        };
        this.setData({
            params: params,
            activityId: activityId
        });
        this.querySecuritycodeUsedListByHadReceive(params)
    },
    querySecuritycodeUsedListByHadReceive(params) {
        let r = RequestFactory.querySecuritycodeUsedListByHadReceive(params);
        let {list} = this.data;
        r.finishBlock = (req) => {
            let datas = req.responseObject.data;
            if (datas.resultCount > 0) {
                datas.data.forEach((item) => {
                    item.receive_time = Tool.formatTime(item.receive_time)
                });
                this.setData({
                    list: list.concat(datas.data),
                    totalPage: datas.total
                })
            }
        };
        Tool.showErrMsg(r);
        r.addToQueue();
    },
    onScroll() {
        // 向下滑动的时候请求数据
        if (this.data.currentPage >= this.data.totalPage) return;
        let page = this.data.currentPage;
        page += 1;
        let { params } = this.data;
        params.page = page;
        this.setData({
            currentPage: page,
            params: params
        });
        this.querySecuritycodeUsedListByHadReceive(this.data.params)
    },
    swichNav: function (e) {
        let cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
        let status=cur==0?'':cur==1?3:1;
        let { params } = this.data;
        params.expressStatus=status;
        this.setData({
            params:params
        });
        this.querySecuritycodeUsedListByHadReceive(this.data.params)

    },
    goPage(e) {
        let id = e.target.dataset.id;
        Tool.navigateTo('/pages/logistics/logistics?id=' + id)
    }
})