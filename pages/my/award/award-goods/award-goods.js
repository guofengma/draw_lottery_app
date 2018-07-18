let { Tool, RequestFactory } = global
Page({
  data: {
    lists:[
      { img:"/img/default-user.png",prdName:"哈哈哈哈",types:"红色-xl",isSelect:false,createTime:"2017-18-12 12:12:12",orderNum:"1112121212212",state:1},
      { img: "/img/default-user.png", prdName: "哈哈哈哈", types: "红色-xl", isSelect: false, createTime: "2017-18-12 12:12:12", orderNum: "1112121212212", state: 2},
    ],
    selectArr:[], //保存选中的产品规格
  },
  onLoad: function (options) {
  
  },
  chooseClicked(e){
    let index = e.currentTarget.dataset.index
    let {lists} = this.data
    lists[index].isSelect = !lists[index].isSelect
    let selectArr = []
    lists.forEach((item)=>{
      if (item.isSelect){
        selectArr.push(item)
      }
    })
    this.setData({
      lists:lists,
      selectArr: selectArr
    })
  },
  submitClicked(){
    Tool.redirectTo('/pages/order-confirm/order-confirm')
  }
})