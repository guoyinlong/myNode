/**
 * 作者：任华维
 * 日期：2017-10-21
 * 邮箱：renhw21@chinaunicom.cn
 * 文件说明：全局函数
 */
// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, function () {
    return arguments[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}
/**
 * toFixed方法重写
 * @param 截取小数位数
 * @returns {string} 截取后字符
 */
/*Number.prototype.toFixed=function (d) {
  var s=this+"";
  if(!d)d=0;
  if(s.indexOf(".")==-1)s+=".";
  s+=new Array(d+1).join("0");
  if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
    var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
    if(a==d+2){
      a=s.match(/\d/g);
      if(parseInt(a[a.length-1])>4){
        for(var i=a.length-2;i>=0;i--){
          a[i]=parseInt(a[i])+1;
          if(a[i]==10){
            a[i]=0;
            b=i!=1;
          }else break;
        }
      }
      s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
    }if(b)s=s.substr(1);
    return (pm+s).replace(/\.$/,"");
  }return this+"";
};*/
/**
 * 将json转为url格式
 * @param param 要转换的数据
 * @param key 可选，前缀
 * @returns {string}
 */
function parseParam (param, key) {

  var paramStr = "";
  if (typeof param==="string" || typeof param==="number" || typeof param==='boolean') {
    paramStr += "&" + key + "=" + encodeURIComponent(param);
  } else {
    for (var v in param) {
      var k = key==null ? v : key + (param instanceof Array ? "[" + v + "]" : "." + v);
      paramStr += '&' + parseParam(param[v], k);
    }
  }
  return paramStr.substr(1);
};

//收藏本站
function addFavorite(title, url) {
     url = encodeURI(url);
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            console.log("加入收藏失败,Ctrl+D进行添加");
        }
    }
}

/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：文件转64位字符
 * @param img 图片文件
 * @param callback 回调
 */
function getBase64 (img, callback){
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：字符转文件
 * @param dataurl 字符串
 * @param filename 文件名
 */
function dataURLtoFile (dataurl, filename){
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
}
function splitEnter(text=''){
  return <p style={{textAlign:'left',lineHeight:'24px'}} dangerouslySetInnerHTML={{__html:text.replace(/\n/g,'<br/>')}}></p>
}
function splitEnterSpan(text=''){
  return <span dangerouslySetInnerHTML={{__html:text.replace(/\r\n/g,'<br/>').replace(/\n/g,"<br>").replace(/\s/g,"&#8197;&#8197;")}}></span>
}
/**
 * 作者：任华维
 * 创建日期：2017-10-21
 * 功能：对象数组排序
 * @param data 数组
 * @param propertyName 排序字段
 * @param sequence 排序方式
 */
function propertySort(data, propertyName, sequence) {
    if ((typeof data[0][propertyName]) !== "number") { // 属性值为非数字
        return function(object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            return sequence ? value2.localeCompare(value1) : value1.localeCompare(value2);
        }
    }
    else {
        return function(object1, object2) { // 属性值为数字
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            return sequence ? value2 - value1 : value1 - value2;
        }
    }
}
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
// 数组分类
function arrayToObjGroups (list,key){
    var data = [],flag = 0;
    for (var i = 0; i < list.length; i++) {
        var az = '';
        for (var j = 0; j < data.length; j++) {
            if (data[j].key == list[i][key]) {
                flag = 1;
                az = j;
                break;
            }
        }
        if (flag == 1) {
            var ab = data[az];
            ab.value.push(list[i]);
            flag = 0;

        } else if (flag == 0) {
            var obj = {};
            obj.key = list[i][key];
            obj.value = new Array();
            obj.value.push(list[i]);
            data.push(obj);
        }
    }
    return data;
}
// 数组分类
function arrayToArrayGroups (list,key){
    var flag = 0,data = [];
    for(var i = 0; i< list.length; i++) {
        var az = '';
        for (var j = 0; j < data.length; j++) {
            if(data[j][0][key] == list[i][key]) {
                flag = 1;
                az = j;
                break;
            }
        }
        if(flag == 1){
            data[az].push(list[i]);
            flag = 0;
        } else if (flag == 0) {
            var temp = new Array();
            temp.push(list[i]);
            data.push(temp);
        }
    }
    return data;
}
// 克隆
function deepClone (obj){
    var newObj= obj instanceof Array?[]:{};
    for(var i in obj){
       newObj[i]=typeof obj[i]=='object'?
       deepClone(obj[i]):obj[i];
    }
    return newObj;
}
//获取全面激励初始化年份
function getEncouragementInitYear(){
    const year = new Date().getFullYear().toString();
    // const month = new Date().getMonth() + 1;
    // if(month < 6){
    //     return (year - 1);
    // }else{
        return year;
    // }

}
/**
 * 作者：李萌
 * 创建日期：2019-6-24
 * 功能：生成随机字符串
 * @param len 生成长度
 * @param radix 随机范围
 */
function getRandom(len, radix) {
   const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
   let uuid = [];
   radix = radix || chars.length;
   if (len) {
       for (let i = 0; i < len; i++) {
           uuid[i] = chars[0 | Math.random() * radix];
       }
   } else {
       let r;
       uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
       uuid[14] = '4';
       for (let i = 0; i < 36; i++) {
           if (!uuid[i]) {
               r = 0 | Math.random() * 16;
               uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
           }
       }
   }
   return uuid.join('');
}
/**
 * 作者：罗玉棋
 * 创建日期：2020-4-13
 * 功能：post方式—表单导出
 * @param  params 参数
 * @param  url  请求地址
 */
function postExcelFile(params, url){
  var form = document.createElement("form");
  form.style.display = 'none';
  form.action = url;
  form.method = "post";
  document.body.appendChild(form);

  for(var key in params){
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  }

  form.submit();
  form.remove();
}

/**
 * 作者：LYQ
 * 创建日期：2020-9-28
 * 功能：waterMark
 * @param  params 
 * @param  setting  waterMark settings
 * @param  model waterMark area (symbol div )
 */

function waterMark(settings,model){
  let defaultSettings={
  watermark_txt:"text",
  watermark_x:20,
  watermark_y:20,
  watermark_rows:20,
  watermark_cols:20,
  watermark_x_space:100,
  watermark_y_space:50,
  watermark_color:'#aaa',
  watermark_alpha:0.4,
  watermark_fontsize:'20px',
  watermark_font:'微软雅黑',
  watermark_width:210,
  watermark_height:80,
  watermark_angle:15,
  };
  Object.assign(defaultSettings, settings);
  let oTemp = document.createDocumentFragment();
  let p_width = Math.max(model.scrollWidth,model.style.width);
  // let p_width = Math.max(document.body.scrollWidth,document.body.clientWidth);
  let cutWidth = p_width*0.0150;
  let page_width=p_width-cutWidth;
  let page_height = Math.max(model.scrollHeight,model.style.height);
  // let page_height = Math.max(document.body.scrollHeight,document.body.clientHeight);
  if (defaultSettings.watermark_cols === 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width *defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
  defaultSettings.watermark_cols = parseInt((page_width-defaultSettings.watermark_x+defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
  defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
  }
  if (defaultSettings.watermark_rows === 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
  defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
  defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
  }
  let x;
  let y;
  for (let i = 0; i < defaultSettings.watermark_rows; i++) {
  y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
  for (let j = 0; j < defaultSettings.watermark_cols; j++) {
  x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
  let mask_div = document.createElement('div');
  mask_div.id = 'mask_div' + i + j;
  mask_div.className = 'mask_div';
  mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
  mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
  mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
  mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
  mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
  mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
  mask_div.style.visibility = "";
  mask_div.style.position = "absolute";
  mask_div.style.left = x + 'px';
  mask_div.style.top = y + 'px';
  mask_div.style.overflow = "hidden";
  mask_div.style.zIndex = "9999";
  mask_div.style.pointerEvents='none';
  mask_div.style.opacity = defaultSettings.watermark_alpha;
  mask_div.style.fontSize = defaultSettings.watermark_fontsize;
  mask_div.style.fontFamily = defaultSettings.watermark_font;
  mask_div.style.color = defaultSettings.watermark_color;
  mask_div.style.textAlign = "center";
  mask_div.style.width = defaultSettings.watermark_width + 'px';
  mask_div.style.height = defaultSettings.watermark_height + 'px';
  mask_div.style.display = "block";
  oTemp.appendChild(mask_div);
  };
  };
    model.appendChild(oTemp);
  }


  /**
 * 作者：LYQ
 * 创建日期：2020-10-9
 * 功能：prevent copy
 */
 function preventCopy(){
  var element = document.body;
  element.oncontextmenu = function () {
    return false;
  }
  element.onselect = function () {
    return false;
  }
  element.onselectstart = function () {
    return false;
  }
  element.onbeforecopy = function () {
    return false;
  }
 }

  /**
 * 作者：LYQ
 * 创建日期：2020-10-9
 * 功能：unlock prevent copy
 */
function unLockCopy(){
  var element = document.body;
  element.oncontextmenu = function () {
    return true;
  }
  element.onselect = function () {
    return true;
  }
  element.onselectstart = function () {
    return true;
  }
  element.onbeforecopy = function () {
    return true;
  }
 }

 /**
 * 作者：LYQ
 * 创建日期：2020-10-22
 * 功能：timeStamp
 */
 function timeStamp(dateStamp){
  let date = new Date(dateStamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let Mi = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  let tempDate = Y + M + D + H + Mi + S;
  //console.log("时间戳转换", tempDate)
  return tempDate;
}

module.exports = {
  getRandom,
  parseParam,
  addFavorite,
  getBase64,
  dataURLtoFile,
  splitEnter,
  splitEnterSpan,
  propertySort,
  getUuid,
  arrayToObjGroups,
  arrayToArrayGroups,
  deepClone,
  getEncouragementInitYear,
  postExcelFile,
  waterMark,
  preventCopy,
  timeStamp,
  unLockCopy
}
