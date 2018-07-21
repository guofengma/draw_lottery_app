let { Tool,Storage } = global

Component({
  properties: {
     canStart:Boolean
  },
  data: {
    activityId:'',
    userId:''
  },
  methods: {
    getUserId(){
      this.setData({
        userId: Storage.memberId() || '',
        activityId: Storage.getActivityId() || '',
      })
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
    //this.getActivtyId()
    if (!this.properties.canStart){
      this.getActivtyId()
    }
  }
})
