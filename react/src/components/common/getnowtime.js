import React from 'react'

/**
  * 作者： 卢美娟
  * 创建日期： 2017-07-31
  * 邮箱: lumj14@chinaunicom.cn
  * 功能： 获取当前时间
  */
function getNowTime(){
   var myDate = new Date();  //国际标准时间
   var y = myDate.getFullYear();
   var m = myDate.getMonth() + 1;
   m = m < 10 ? '0' + m : m;
   var d = myDate.getDate();
   d = d < 10 ? ('0' + d) : d;
   var h = myDate.getHours();
   var mi = myDate.getMinutes();
   var nowDay = y + '-' + m + '-' + d + ' ' + h + ':' + mi;
  return nowDay;
}



export default getNowTime
