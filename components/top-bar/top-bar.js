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
        activityId: Storage.getActivityCode() || '',
      })
    },
    getActivtyId(){
      let r = global.RequestFactory.getActivityId();
      r.finishBlock = (req) => {
        Storage.setActivityId(req.responseObject.data.id)
        Storage.setActivityCode(req.responseObject.data.code)
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
      //this.getActivtyId()
      this.getUserId()
    }
  }
})
