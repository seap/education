export function param(obj, traditional) {
  let arr = [];
  for (let key in obj) {
    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return arr.join('&');
};

export function dateFormat(date, format) {
  var o = {
    'M+': date.getMonth() + 1, //month
    'd+': date.getDate(), //day
    'h+': date.getHours(), //hour
    'm+': date.getMinutes(), //minute
    's+': date.getSeconds(), //second
    'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
    'S': date.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return format;
};

export function dateCompare(date) {
  var now = new Date().getTime();
  return date - now > 31536000000 ? 2 : date > now ? 1 : date === now ? 0 : -1;
}
