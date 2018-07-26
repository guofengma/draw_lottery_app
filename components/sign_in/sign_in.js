var yangdate = require("sign_in_ss.js");
let { Tool, RequestFactory, Storage } = global
Page({

  /**
   * 页面的初始数据
   */
  data: {
      signDay:[{"signDay":"9"},{"signDay":"11"},{"signDay":"12"},{"signDay":"15"}],
      signs:[1,2,3,5,6,7],
      signtype:"1",
      signDays:[],
      todayDate:"1",
      todayMonth:"",
      todayYear:"",
      nextMonth:"",
      nextYear:"",
      prevYear:"",
      prevMonth:"",
      seriesCount:"99",
      series_gos:"15",
      for_signs:"none",
      powerData:"0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.test()
    this.signListRequestHttp()
  },
  dateClicked(e){
    let className = e.currentTarget.dataset.class
    let num = e.currentTarget.dataset.num
    let day = e.currentTarget.dataset.day
    if(num){
      Tool.showAlert('签到'+day+"天获取"+num+"次获奖机会")
    }
    console.log(className, num)
  },
  signListRequestHttp(month, preMonth) { // 请求签到列表
    console.log(preMonth)
    let timeData = '';
    if(!month){
      let getToday = new Date();
      let todayDate = getToday.getDate();
      let todayMonths = getToday.getMonth();
      let todayMonth = (todayMonths + 1);
      let todayYear = getToday.getFullYear();
      if (todayMonth < 10) {
        timeData = todayYear + "-0" + todayMonth
      } else {
        timeData = todayYear + "-" + todayMonth
      }
    } else {
      timeData = month
    }
    console.log(timeData)
    let data = {
      activityId: Storage.getActivityId() || '',
      yearsMonth: timeData
    };
    let r = RequestFactory.signListRequest(data);
    r.finishBlock = (req) => {
      let stringJson = req.responseObject.data;
      console.log(stringJson)
      if (stringJson == [] || stringJson == '[]') {
        console.log('')
      } else {
        let data = req.responseObject.data
        // this.setData({
        //   weekdays: req.responseObject.data || []
        // })
        let myDays = []
        data.forEach((item) => {
          let day = item.signTime
          day = day.split('-')
          let num = day[2][0] == 0 ? day[2][1] : day[2]
          myDays.push(parseInt(num))
          item.date = parseInt(num)
        })
        this.setData({
          myDays: myDays,
          weekdays: data
        })
        console.log(myDays)
        console.log(this.data.myDays)
        this.test(this.data.myDays, this.data.weekdays, preMonth)
        // console.log(this.data.weekdays)
      }

    };
    Tool.showErrMsg(r);
    r.addToQueue();
  },
  test(myDays = [], weekdays = [], preMonth) {
    var godates = ''
    var getToday =''
    var todayDate = ''
    var todayMonth = ''
    var todayYear = ''
    var todayss = ''
    var showMonth = ''
    var getToday = new Date();
    if (!preMonth){
      todayYear = getToday.getFullYear()
      todayDate = getToday.getDate();
      var todayMonths = getToday.getMonth();
      todayMonth = (todayMonths + 1);
      showMonth = todayMonth
      todayYear = getToday.getFullYear();
      todayss = getToday.getDate();
      if (todayMonth < 10) {
        var todayMonthss = "0" + todayMonth;
      } else {
        var todayMonthss = todayMonth;
      }
      godates = todayYear + "-" + todayMonthss + "-01";
    } else {
      godates = preMonth
      let arr = godates.split('-')
      console.log(arr)
      todayYear = arr[0]
      showMonth = arr[1]
      todayMonth = getToday.getMonth()+1;
      todayss = getToday.getDate();
    }

    
    console.log(todayss);
    // var godates = todayYear + "-" + todayMonthss + "-01";
    var that = this;
    var data = { seriesCount: 1, signDays: myDays };
    var $datas = data;
    var signDate_arr = new Array();
    var anns = $datas.signDays;
    var count_signday = $datas.seriesCount;

    if (count_signday > 9) {
      var series_gos = "0";
    } else if (count_signday < 0) {
      var series_gos = 99;
    } else {
      var series_gos = 10 - parseInt(count_signday);
    }
    that.setData({
      seriesCount: count_signday,
      series_gos: series_gos,
    });
    for (var p in anns) {//遍历json对象的每个key/value对,p为key
      var newdats = anns[p];
      signDate_arr.push(newdats);
    }
    console.log(signDate_arr)
    if (showMonth == todayMonth){
      if (signDate_arr.indexOf(todayss) > -1) {
        console.log("当前已签到");
        that.setData({
          signtype: "2",
        });
      } else {
        console.log("当前未签到");
        that.setData({
          signtype: "1",
        });
      }
    } else {
      that.setData({
        signtype: "2",
      });
    }
    
    let hadWinCount = []
    for (let i = 0; i < weekdays.length;i++){
      if (weekdays[i].hadWinCount==1){
        hadWinCount.push(weekdays[i].date)
      }
    }
    console.log(signDate_arr[0]);
    yangdate.yang_date.bulidCal(todayYear, todayMonth, that, signDate_arr, weekdays, hadWinCount);
    //初始化加载日历
    
    this.setData({
      todayDate: todayDate,
      todayMonth: todayMonth,
      todayYear: todayYear,
      prevYear: todayYear,
      nextYear: todayYear,
      prevMonth: todayMonth,
      nextMonth: todayMonth,
      showYear: todayYear,
      showMonth: showMonth,
    });
    
    console.log(this.data.signDays)
  },
  sign_start: function () {
    this.signRequestHttp()
  },

    close_qdbox: function () {
      var seriesCount = this.data.seriesCount;
      // var seriesCount = seriesCount+1;
      if(seriesCount<10){
          var series_gos=10-seriesCount;
      }else{
          var series_gos="0";
      }
        this.setData({
            seriesCount:seriesCount,
            series_gos:series_gos,
            for_signs:"none",
        });
    },
    sign_end: function () {
        wx.showToast({
            title: '今日已经签到',
            icon: 'loading',
            duration: 1500
        });
    },
    sign_prev: function () {
        console.log("上一月");
        var showMonth=this.data.showMonth;
        var todayMonth =this.data.todayMonth;
        if(showMonth=="1"){
            var showMonth="12";
            var showYear=parseInt(this.data.showYear)-1;
        }else{
            var showMonth=parseInt(this.data.showMonth)-1;
            var showYear=this.data.showYear;
        }
        if(parseInt(todayMonth-3)==showMonth){
            wx.showToast({
                title: '不能查看更多了',
                icon: 'loading',
                duration: 1500
            });
            return;
        }
        var that =this;
        if(showMonth<10){
            var showMonths="0"+showMonth;
        }else{
            var showMonths=todayMonth;
        }
        var godates = showYear + "-" + showMonths;
        let preMonth = showYear + "-" + showMonths + "-01";
        console.log(godates)
        this.signListRequestHttp(godates,preMonth)
    },
    sign_next: function () {
        console.log("下一月");
        var showMonth=this.data.showMonth;
        var todayMonth =this.data.todayMonth;
        if(todayMonth==showMonth){
            wx.showToast({
                title: '未签到不能查看',
                icon: 'loading',
                duration: 1500
            });
            return;
        }
        if(showMonth=="12"){
            var showMonth="1";
            var showYear=parseInt(this.data.showYear)+1;
        }else{
            var showMonth=parseInt(this.data.showMonth)+1;
            var showYear=this.data.showYear;
        }


        var that =this;

        if(showMonth<10){
            var showMonths="0"+showMonth;
        }else{
            var showMonths=todayMonth;
        }
        var godates = showYear + "-" + showMonths;
        let preMonth = showYear + "-" + showMonths + "-01";
        // var godates = showYear + "-" + showMonths + "-01";
        // let preMonth = showYear + "-" + showMonths;
        console.log(godates)
        this.signListRequestHttp(godates, preMonth)
              

    },
    signRequestHttp() { // 签到
      let data = {
        activityId: Storage.getActivityId() || ''
      };
      let getToday = new Date();
      let todayDate = getToday.getDate();
      let todayMonths = getToday.getMonth();
      let todayMonth = (todayMonths + 1);
      let todayYear = getToday.getFullYear();
      let todayss = getToday.getDate();
      let r = RequestFactory.signRequest(data);
      r.finishBlock = (req) => {
        console.log(req.responseObject.code)
        if (req.responseObject.code === 200) {
          wx.showToast({
            title: '签到成功',
            icon: 'success',
            duration: 1500
          });
          this.signListRequestHttp()
          // this.getIsNumberHttp()
          // this.signReady()
        } else {
          return null
        }
      };
      Tool.showErrMsg(r);
      r.addToQueue();
    },
})