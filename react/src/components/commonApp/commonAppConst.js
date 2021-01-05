/**
 * 作者：陈红华
 * 日期：2017-07-31
 * 邮箱：1045825949@qq.com
 * 文件说明：提取出门户首页硬编码、公用功能
 */
import moment from 'moment'
import Cookie from 'js-cookie';

const tUploadFile_roleid='ddc298fd80bf11e7b22e008cfa042288';//上传文件硬编码
const createNotice_roleid='448335ed86e811e79b59008cfa042288';//创建公告角色硬编码
const argtenantid='10010';
const OU='联通软件研究院';
// 生成uuid方法
function getUuid(len, radix){
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [], i;
  radix = radix || chars.length;
  if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
              r = 0 | Math.random()*16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
      }
  }
  return uuid.join('');
 }
 // 文件大小单位
function getFileSize(fileByte){
   var fileSizeByte = fileByte;
   var fileSizeMsg = "";
   if (fileSizeByte < 1048576) fileSizeMsg = (fileSizeByte / 1024).toFixed(2) + "KB";
   else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
   else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824) fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(2) + "MB";
   else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824) fileSizeMsg = "1GB";
   else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776) fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(2) + "GB";
   else fileSizeMsg = "文件超过1TB";
   return fileSizeMsg;
 }

export default {tUploadFile_roleid,argtenantid,getUuid,getFileSize,createNotice_roleid,OU}
