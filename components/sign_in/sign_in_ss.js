
//   /**
//    *
//    * @authors 杨京葛 (1141407871@qq.com)
//    * @date    2018-05-21 19:26:19
//    * @version $v1.01$
//    */
//
//
// }
var yang_date = {
    //iyear年份
    //iMonth月份
    //that
    //iyear年份
  bulidCal: function (iYear, iMonth, that, signday, weekdays, hadWinCount) {
    console.log(weekdays)
        let getToday = new Date();
        let todayDate = getToday.getDate();
        let todayMonths = getToday.getMonth();
        let todayMonth = (todayMonths + 1);
        //todayMonth = todayMonth<10 ? "0" + todayMonth : todayMonth
        let todayYear = getToday.getFullYear();
        let todayss = getToday.getDate();
        //todayss = todayss.length<10 ? "0" + todayss : todayss
        let nowTime = todayYear + "-" + todayMonth + "-" + todayss
        let showTime = iYear + "-" + iMonth + "-"
        console.log(nowTime)
        var that =that;
        var aMonth = new Array();
        aMonth[0] = new Array(7);
        aMonth[1] = new Array(7);
        aMonth[2] = new Array(7);
        aMonth[3] = new Array(7);
        aMonth[4] = new Array(7);
        aMonth[5] = new Array(7);
        var dCalDate = new Date(iYear, iMonth - 1, 1);
        var iDayOfFirst = dCalDate.getDay();
        //判断当前月份第一天周几
        var curMonthDays = new Date(dCalDate.getFullYear(), (dCalDate.getMonth()+1), 0).getDate();
        //判断当前月份有多少天
        console.log("本月共有 "+ curMonthDays +" 天");
        console.log("本月第一天周 "+ iDayOfFirst);
        var iDaysInMonth = (iMonth, iYear);
        var iVarDate = 1;
        var d, w;
        for (d = iDayOfFirst; d < 7; d++) {
            if(signday.indexOf(iVarDate)>-1){
                //console.log(111);
                aMonth[0][d] = {
                    signday:"is",
                    normalday:iVarDate,
                    className: 'footer-c'
                };
              console.log(showTime + iVarDate, nowTime)
              // if (showTime + iVarDate == nowTime) {
              //   aMonth[0][d].className = 'haha2'
              // }
              if (weekdays.length>0){
                  if (hadWinCount.indexOf(iVarDate) > -1) {
                    aMonth[0][d].className = 'red'
                    let index = hadWinCount.indexOf(iVarDate)
                    if (index == 0) {
                      aMonth[0][d].day = 1
                      aMonth[0][d].num = 1
                    } else if (index == 1) {
                      aMonth[0][d].day = 7
                      aMonth[0][d].num = 3
                    } else if (index == 3) {
                      aMonth[0][d].day = 15
                      aMonth[0][d].num = 7
                    } else if (index == 3) {
                      aMonth[0][d].day = 30
                      aMonth[0][d].num = 7
                    }
                    console.log(showTime + iVarDate, nowTime)
                    // if (showTime + iVarDate == nowTime) {
                    //   aMonth[0][d].className = 'haha2'
                    // }
                  }

                }
            }else{
                //console.log(22);
                aMonth[0][d] = {
                    signday:"nois",
                    normalday:iVarDate,
                    className: ''
                };
              // console.log(hadWinCount[0], hadWinCount[hadWinCount.length - 1])
              if (weekdays.length > 0) {
                console.log(iVarDate)
                console.log(weekdays[0].date)
                console.log(weekdays[weekdays.length - 1].date)
                if (iVarDate >= weekdays[0].date && iVarDate <= weekdays[weekdays.length - 1].date) {
                  aMonth[0][d].className = 'no-footer'
                }
                if (iVarDate > weekdays[weekdays.length - 1].date && iVarDate<todayss){
                  aMonth[0][d].className = 'no-footer'
                }
                if (showTime + iVarDate == nowTime){
                  aMonth[0][d].className = 'no-qian-dao'
                }
              }
            
            }
            iVarDate++;
        }
        //处理每月第一天出现位置
        for (w = 1; w < 6; w++) {
            for (d = 0; d < 7; d++) {
                if (iVarDate <= iDaysInMonth) {
                    if(signday.indexOf(iVarDate)>-1){
                        //console.log(111);
                        aMonth[w][d] = {
                            signday:"is",
                            normalday:iVarDate,
                             className:'footer-c'
                        };
                        console.log(showTime + iVarDate, nowTime)
                        // if (showTime + iVarDate == nowTime) {
                        //   aMonth[w][d].className = 'haha2'
                        // }
                      if (weekdays.length > 0) {
                        if (hadWinCount.indexOf(iVarDate) > -1) {
                          aMonth[w][d].className = 'red'
                          let index = hadWinCount.indexOf(iVarDate)
                          if (index == 0) {
                            aMonth[w][d].day = 1
                            aMonth[w][d].num = 1
                          } else if (index == 1) {
                            aMonth[w][d].day = 7
                            aMonth[w][d].num = 3
                          } else if (index == 3) {
                            aMonth[w][d].day = 15
                            aMonth[w][d].num = 7
                          } else if (index == 3) {
                            aMonth[w][d].day = 30
                            aMonth[w][d].num = 7
                          }
                         
                        }
                      }
                        
                    }else{
                        //console.log(22);
                        aMonth[w][d] = {
                            signday:"nois",
                            normalday:iVarDate,
                            className:''
                        };
                      if (weekdays.length>0){
                        console.log(iVarDate)
                        console.log(weekdays[0].date)
                        console.log(weekdays[weekdays.length - 1].date)
                        if (iVarDate >= weekdays[0].date && iVarDate <= weekdays[weekdays.length - 1].date) {
                          aMonth[w][d].className = 'no-footer'
                        }
                        if (iVarDate > weekdays[weekdays.length - 1].date && iVarDate < todayss) {
                          aMonth[w][d].className = 'no-footer'
                        }
                        if (showTime + iVarDate == nowTime) {
                          aMonth[w][d].className = 'no-qian-dao'
                        }
                      }
                      
                    }
                    if(iVarDate==curMonthDays){
                        console.log(aMonth);
                        that.setData({
                            signDays:aMonth,
                        });
                        return aMonth;
                    }else{
                        iVarDate++;
                    }
                }
            }
        }
        //处理每月其他天位置
        console.log(aMonth);
        return aMonth;
    },
    //日历签到完成
};
module.exports = {
    yang_date: yang_date
}
