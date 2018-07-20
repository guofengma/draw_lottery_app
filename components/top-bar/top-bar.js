let { Tool,Storage } = global

Component({
  properties: {

  },
  data: {
    activityId:''
  },
  methods: {
    getActivtyId(){
      this.setData({
        activityId: Storage.getActivityId() || '',
        userId: Storage.memberId() || '',
      })
    }
  },
  ready: function () {
    this.getActivtyId()
  }
})
