// components/top-bar/top-bar.js
var signTime = require("signin.js");
let { Tool, RequestFactory } = global
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      isTrue:Boolean
    },
    /**
     * 组件的初始数据
     */
    data: {
        signDay: [{ "signDay": "9" }, { "signDay": "11" }, { "signDay": "12" }, { "signDay": "15" }],
        signs: [1, 2, 3, 5, 6, 7],
        signtype: "1",
        signDays: [], // 存放 已签到的天数
        todayDate: "1",
        todayMonth: "",
        todayYear: "",
        nextMonth: "",
        nextYear: "",
        prevYear: "",
        prevMonth: "",
        seriesCount: "99",
        series_gos: "15",
        for_signs: "none",
        powerData: "0",
        isSigncontinuity: 'none',
        hoverClass:'borderHover',
        isTrue:true,
        tip: false,
        isNumber: '3',
        weekdays: [],
        isweekDays: [],
        oneWeekDays: [],
        signTitle: '连续签到7天',
        signNumber: '',
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onLoad:function() {
          this.sign()
        },
        sign_start: function() { // 签到
            this.signRequestHttp() // 调取签到接口
            //签到成功后重新调用后台接口加载新的签到数据
            // this.setData({
            //     for_signs: "block",
            //     signtype: "2",
            //     powerData: powerData,
            // });
            wx.showToast({
                title: '签到成功',
                icon: 'success',
                duration: 1500
            });
            this.signReady()
        },
        close_qdbox: function() { // 签到奖励弹框
            var seriesCount = this.data.seriesCount;
            // var seriesCount = seriesCount+1;
            if (seriesCount < 10) {
                var series_gos = 10 - seriesCount;
            } else {
                var series_gos = "0";
            }
            this.setData({
                seriesCount: seriesCount,
                series_gos: series_gos,
                for_signs: "none",
            });
        },
        sign_end: function() { // 到底了
            wx.showToast({
                title: '今日已经签到',
                icon: 'loading',
                duration: 1500
            });
        },
        sign_prev: function() { // 上一页
            console.log("上一月");
            var showMonth = this.data.showMonth;
            var todayMonth = this.data.todayMonth;
            if (showMonth == "1") {
                var showMonth = "12";
                var showYear = parseInt(this.data.showYear) - 1;
            } else {
                var showMonth = parseInt(this.data.showMonth) - 1;
                var showYear = this.data.showYear;
            }
            if (parseInt(todayMonth - 3) == showMonth) {
                wx.showToast({
                    title: '不能查看更多了',
                    icon: 'loading',
                    duration: 1500
                });
                return;
            }
            var that = this;
            if (showMonth < 10) {
                var showMonths = "0" + showMonth;
            } else {
                var showMonths = todayMonth;
            }
            var godates = showYear + "-" + showMonths + "-01";

            var $datas = { seriesCount: 1, signDays: [] };
            var anns = $datas.signDays;
            var signDate_arr = [];
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
                var newdats = anns[p];
                signDate_arr.push(newdats);
            }
            console.log(signDate_arr[0]);
            signTime.dataTime.bulidCal(showYear, showMonth, that, signDate_arr);
            // this.signReady()
            //初始化加载日历
            this.setData({
                showYear: showYear,
                showMonth: showMonth,
            });
        },
        sign_next: function() { // 下一页
            console.log("下一月");
            var showMonth = this.data.showMonth;
            var todayMonth = this.data.todayMonth;
            if (todayMonth == showMonth) {
                wx.showToast({
                    title: '未签到不能查看',
                    icon: 'loading',
                    duration: 1500
                });
                return;
            }
            if (showMonth == "12") {
                var showMonth = "1";
                var showYear = parseInt(this.data.showYear) + 1;
            } else {
                var showMonth = parseInt(this.data.showMonth) + 1;
                var showYear = this.data.showYear;
            }
            var that = this;
            if (showMonth < 10) {
                var showMonths = "0" + showMonth;
            } else {
                var showMonths = todayMonth;
            }
            var godates = showYear + "-" + showMonths + "-01";
            var $datas = { seriesCount: 1, signDays: []};
            var signDate_arr = new Array();
            var anns = $datas.signDays;
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
                var newdats = anns[p];
                signDate_arr.push(newdats);
            }
            console.log(signDate_arr[0]);
            signTime.dataTime.bulidCal(showYear, showMonth, that, signDate_arr);
            //初始化加载日历
            // this.signReady()
            this.setData({
                showYear: showYear,
                showMonth: showMonth,
            });

        },
        sign: function(options) { // 签到
            var getToday = new Date();
            var todayDate = getToday.getDate();
            var todayMonths = getToday.getMonth();
            var todayMonth = (todayMonths + 1);
            var todayYear = getToday.getFullYear();
            var todayss = getToday.getDate();
            if (todayMonth < 10) {
                var todayMonthss = "0" + todayMonth;
            } else {
                var todayMonthss = todayMonth;
            }
            console.log(todayss);
            var godates = todayYear + "-" + todayMonthss + "-01";
            var that = this;
            var data = { seriesCount: 1, signDays: [] };
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
            anns.push(todayss) //  存放今日的签到日期
            that.setData({
                seriesCount: count_signday,
                series_gos: series_gos,
            });
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
                var newdats = anns[p];
                signDate_arr.push(newdats);
            }
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
            console.log(signDate_arr[0]);
            signTime.dataTime.bulidCal(todayYear, todayMonth, that, signDate_arr);
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
                showMonth: todayMonth,
            });
        },
        closeView: function() { // 关闭日历
          console.log(1)
          this.triggerEvent('closeView',false)
        },
        closeSingBox: function () { // 关闭连续签到
          this.setData({
            tip:!this.data.tip
          })
        },
        signListRequestHttp(){ // 请求签到列表
          let timeData = '';
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
          console.log(timeData)
          let data = {
            activityId:1,
            yearsMonth: timeData
          };
          let r = RequestFactory.signListRequest(data);
          r.finishBlock = (req) => {
            let stringJson = req.responseObject.data;
              this.setData({
                weekdays: req.responseObject.data || []
              })
          };
          Tool.showErrMsg(r);
          r.addToQueue();
        },
        signRequestHttp(){ // 签到
          let data = {
            activityId: 1
          };
          let r = RequestFactory.signRequest(data);
          r.finishBlock = (req) => {
            console.log(req)
          };
          Tool.showErrMsg(r);
          r.addToQueue();
        },
        signReady () { // ready加载日历获取签到天数
          setTimeout( ()=>{
            var getToday = new Date();
            var todayDate = getToday.getDate();
            var todayMonths = getToday.getMonth();
            var todayMonth = (todayMonths + 1);
            var todayYear = getToday.getFullYear();
            var todayss = getToday.getDate();
            if (todayMonth < 10) {
              var todayMonthss = "0" + todayMonth;
            } else {
              var todayMonthss = todayMonth;
            }
            var godates = todayYear + "-" + todayMonthss + "-01";
            var that = this;
            var signDay = this.data.weekdays
            // console.log(signDay)
            var data = { seriesCount: 1, signDays: [] };
            for (let p in signDay) { // 获取签到列表的每一天
              let signJson = signDay[p].signTime
              let weekDays = 0 ;
              if (todayss > 10 ) {
                weekDays = parseInt(signDay[p].signTime.substr(8, 2))
                data.signDays.push(weekDays)
              } else {
                weekDays = parseInt(signDay[p].signTime.substr(9, 1))
                data.signDays.push(weekDays)
              }
              if (signDay[0].hadWinCount !== 2) { // 获取列表中第一个天表示第一次签到
                this.setData({
                  oneWeekDays: parseInt(signDay[0].signTime.substr(8, 2))
                })
              }
              if (signDay[p].hadWinCount !== 2) { // 获取连续签到7天
                let arr = [];
                arr.push(weekDays)
                // console.log(arr)
                if(arr.indexOf(weekDays) > -1) {
                  this.setData({
                    isweekDays: arr
                  })
                }
              }  
            }
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
            for (var p in anns) { //遍历json对象的每个key/value对,p为key
              var newdats = anns[p];
              var t = parseInt(p);
              // console.log(this.data.oneWeekDays)
              // if (anns[0] === this.data.oneWeekDays) {
              //   console.log('第一次签到')
              //   this.setData({
              //     signTitle: '首次签到',
              //     signNumber: 1
              //   })
              // }
             if ((anns[t + 1] - anns[p]) === 1 && anns.length === 7) {
                  console.log('连续签到了7')
                  this.setData({
                    signTitle: '连续签到7天',
                    signNumber: 3
                  })
              } else if ((anns[t + 1] - anns[p]) === 1 && anns.length === 15){
                console.log('连续签到了15天')
                  this.setData({
                    signTitle: '连续签到15天',
                    signNumber: 5
                  })
              } else if ((anns[t + 1] - anns[p]) === 1 && anns.length === 30){
                console.log('连续签到了30天')
                  this.setData({
                    signTitle: '连续签到30天',
                    signNumber: 7
                  })
              }
              signDate_arr.push(newdats);
            }
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
            // console.log(signDate_arr)
            signTime.dataTime.bulidCal(todayYear, todayMonth, that, signDate_arr);
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
              showMonth: todayMonth,
            });
          },500)
        }
    },
    ready: function() {
      // this.signListRequestHttp() // 获取签到天数
      // setTimeout( ()=>{
      //   this.signReady() // 加载日历
      // },1000)
        
    }
}) 