let { Tool,Storage } = global

Component({
  properties: {

  },
  data: {
    activityId:'',
    userId:''
  },
  methods: {
    getUserId(){
      
    },
    getActivtyId(){
      let r = global.RequestFactory.getActivityId();
      r.finishBlock = (req) => {
        Storage.setActivityId(req.responseObject.data.id)
        this.setData({
          activityId: req.responseObject.data.id,
          userId: Storage.memberId() || '',
        })
      }
      Tool.showErrMsg(r)
      r.addToQueue();
    }
  },
  ready: function () {
    this.getActivtyId()
  }
})
