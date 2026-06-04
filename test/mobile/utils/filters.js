import config from '@/config/index.js'

// 时间过滤器
exports.paddingZero = (value) => {
  return (Array(2).join('0') + value).slice(-2)
}

// 图片地址
exports.filePath = (value) => {
  if (value) {
    const filePath = value.indexOf('mp4') === -1
      ? config.ossimgUrl
      : config.ossVideoUrl
    if (/^http.+/.test(value)) {
      return value
    } else {
      if (value.indexOf('/') === 0) {
        return filePath + value
      } else {
        return filePath + '/' + value
      }
    }
  }
  return value
}

// 保留小数点
exports.toFixed = (value) => {
  return Number(value).toFixed(2)
}

// 倒计时补零
exports.setDownZero = (value) => {
  const x = parseInt(value)
  if (x < 10) {
    return '0' + value
  }
  return value
}

// 格式化时间
exports.dateFormat = (fmt, date) => {
	if (!date) {
		date = 'yyyy-MM-dd hh:mm:ss'
	}
	fmt = !fmt?new Date():new Date(Number(fmt));
	
    var o = {   
        "M+" : fmt.getMonth()+1,                 //月份   
        "d+" : fmt.getDate(),                    //日   
        "h+" : fmt.getHours(),                   //小时   
        "m+" : fmt.getMinutes(),                 //分   
        "s+" : fmt.getSeconds(),                 //秒   
        "q+" : Math.floor((fmt.getMonth()+3)/3), //季度   
        "S"  : fmt.getMilliseconds()             //毫秒   
      };   
      if(/(y+)/.test(date))   
        date=date.replace(RegExp.$1, (fmt.getFullYear()+"").substr(4 - RegExp.$1.length));   
      for(var k in o)   
        if(new RegExp("("+ k +")").test(date))   
      date = date.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
      return date ||''; 
}
