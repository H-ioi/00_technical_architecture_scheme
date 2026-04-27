//获取当前时间
export function getNowTime() {
  var date = new Date();
  //年 getFullYear()：四位数字返回年份
  var year = date.getFullYear(); //getFullYear()代替getYear()
  //月 getMonth()：0 ~ 11
  var month = date.getMonth() + 1;
  //日 getDate()：(1 ~ 31)
  var day = date.getDate();
  //时 getHours()：(0 ~ 23)
  var hour = date.getHours();
  //分 getMinutes()： (0 ~ 59)
  var minute = date.getMinutes();
  //秒 getSeconds()：(0 ~ 59)
  var second = date.getSeconds();

  var time = year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hour) + ':' + addZero(minute) + ':' + addZero(second);
  return time;
}

export function getFormatDate(formatStr, fdate, HH, mm, ss) {
  var fTime, fStr = 'ymdhis';
  if (!formatStr)
    formatStr = "y-m-d h:i:s";
  if (fdate)
    fTime = new Date(fdate);
  else
    fTime = new Date();
  var formatArr = [
    fTime.getFullYear().toString(),
    Number((fTime.getMonth() + 1).toString()) > 9 ? (fTime.getMonth() + 1).toString() : "0" + (fTime.getMonth() + 1).toString(),
    fTime.getDate().toString(),
    HH ? HH : fTime.getHours() > 10 ? fTime.getHours().toString() : '0' + fTime.getHours().toString(),
    mm ? mm : fTime.getMinutes() > 10 ? fTime.getMinutes().toString() : '0' + fTime.getMinutes().toString()
    // ss ? ss : fTime.getSeconds() > 10 ? fTime.getSeconds().toString() : '0' + fTime.getSeconds().toString()

  ];
  for (var i = 0; i < formatArr.length; i++) {
    formatStr = formatStr.replace(fStr.charAt(i), formatArr[i]);
  }
  return formatStr;
}
export function getNowDate() {
  var date = new Date();
  //年 getFullYear()：四位数字返回年份
  var year = date.getFullYear(); //getFullYear()代替getYear()
  //月 getMonth()：0 ~ 11
  var month = date.getMonth() + 1;
  //日 getDate()：(1 ~ 31)
  var day = date.getDate();
  var time = year + '-' + addZero(month)

  return time;
}
export function getBeforeYear(num) {
  var date = new Date();
  //年 getFullYear()：四位数字返回年份
  var year = date.getFullYear(); //getFullYear()代替getYear()
  //月 getMonth()：0 ~ 11
  var month = date.getMonth() + 1;
  //日 getDate()：(1 ~ 31)
  var day = date.getDate();
  var current = time = year + '-' + addZero(month) + '-' + addZero(day);
  year = year - num
  let lastDay = new Date(year, month, 0).getDate();
  console.log('lastDay', lastDay);
  var time = year + '-' + addZero(month) + '-' + addZero(day > lastDay ? lastDay : day);
  return [time, current];
}
export function getBeforeDate(type) {
  var date = new Date();
  //年 getFullYear()：四位数字返回年份
  var year = date.getFullYear(); //getFullYear()代替getYear()
  //月 getMonth()：0 ~ 11
  var month = date.getMonth() + 1;
  //日 getDate()：(1 ~ 31)
  var day = date.getDate();
  //时 getHours()：(0 ~ 23)
  var hour = date.getHours();
  //分 getMinutes()： (0 ~ 59)
  var minute = date.getMinutes();
  //秒 getSeconds()：(0 ~ 59)
  var second = date.getSeconds();
  switch (type) {
    case "1":
      if (month == 1) {
        year = year - 1
        month = 12
      } else {
        month = month - 1
      }
      break;
    case "2":
      year = year - 1
      break;
    case "3":
      year = year - 3
      break;
    case "4":
      year = year - 5
      break;
  }

  var time = year + '-' + addZero(month) + '-' + addZero(day) + ' ' + addZero(hour) + ':' + addZero(minute) + ':' + addZero(second);
  return time;
}



//小于10的拼接上0字符串
export function addZero(s) {
  return s < 10 ? ('0' + s) : s;
}
export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss'
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] :
            ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}
/**
 * 日期格式化
 */
export function DateFormat(date) {
  let format = 'yyyy/MM/dd hh:mm:ss'
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] :
            ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}
export const getPickTime = (date3) => {
  // var days = Math.floor(date3 / (24 * 3600))

  // var leave1 = date3 % 3600 // 计算天数后剩余的毫秒数
  var hours = Math.floor(date3 / (3600))

  var leave2 = date3 % (3600) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60))

  var leave3 = leave2 % (60) // 计算分钟数后剩余的毫秒数
  var seconds = leave3
  return (hours > 0 ? hours + "时" : "") + (minutes > 0 ? minutes + "分" : "") + seconds + "秒"
  // return {
  //   leave1,
  //   leave2,
  //   leave3,
  //   days: days,
  //   hours: hours,
  //   minutes: minutes,
  //   seconds: seconds
  // }
}

export const HXtimeSlotChange = function (val) {
  let startTime, endTime;
  let now = new Date(); //当前日期
  var nowDayOfWeek = now.getDay(); //今天本周的第几天
  var nowDay = now.getDate(); //当前日
  let nowMonth = now.getMonth(); //当前月
  let nowYear = now.getFullYear(); //当前年
  let jd = Math.ceil((nowMonth + 1) / 3);
  switch (val) {
    case "本周":
      startTime = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
      endTime = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
    case "本月":
      startTime = new Date(nowYear, nowMonth, 1)
      endTime = new Date(nowYear, nowMonth + 1, 0)
      break;
    case "本季度":
      startTime = new Date(nowYear, (jd - 1) * 3, 1)
      endTime = new Date(nowYear, jd * 3, 0)
      break
    case "本年":
      startTime = new Date(nowYear, 0, 1)
      endTime = new Date(nowYear, nowMonth, nowDay)
      break
  }
  return [formatDate(startTime),
  formatDate(endTime),
  ]
}
//格式化日期：yyyy-MM-dd
export const formatDate = function (date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();
  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return (myyear + "-" + mymonth + "-" + myweekday);
}
