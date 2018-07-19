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
        activityId: Storage.getActivityId() || ''
      })
    }
  },
  ready: function () {
    this.getActivtyId()
  }
})
