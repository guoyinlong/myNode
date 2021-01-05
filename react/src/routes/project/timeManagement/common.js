/**
 *  作者: 张楠华
 *  创建日期: 2018-8-22
 *  邮箱：zhangnh6@chinaunicom.cn
 *  文件说明：工时公用方法，合并数据。
 */
function mergeCom(recordList) {
  let map = {}, recordListPMS = [], recordListNoPMS = [];
  for(let i = 0; i < recordList.length; i++){
    let ai = recordList[i];
    ai.key =i;
    if(ai.pms_code !== undefined && ai.pms_code !==''){ //两个有一个为真即可进入
      if(!map[ai.pms_code]){
        recordListPMS.push({
          pms_code: ai.pms_code,
          pms_name: ai.pms_name,
          proj_code: ai.proj_code,
          data: [ai]
        });
        map[ai.pms_code] = ai;
      }else{
        for(let j = 0; j < recordListPMS.length; j++){
          let dj = recordListPMS[j];
          if(dj.pms_code === ai.pms_code){
            dj.data.push(ai);
            break;
          }
        }
      }
    }else{
      if(!map[ai.proj_code]){
        recordListNoPMS.push({
          proj_code: ai.proj_code,
          proj_name: ai.proj_name,
          data: [ai]
        });
        map[ai.proj_code] = ai;
      }else{
        for(let j = 0; j < recordListNoPMS.length; j++){
          let dj = recordListNoPMS[j];
          if(dj.proj_code === ai.proj_code){
            dj.data.push(ai);
            break;
          }
        }
      }
    }
  }
  return recordListNoPMS.concat(recordListPMS);
}
function mergeSum(recordList) {
  let temp = [];
  recordList.forEach(function(item) {
    let skey = item.activity_id;
    if(typeof temp[skey] == "undefined") {
      temp[skey] = item;
    } else {
      temp[skey]["onesum"] =parseFloat(temp[skey]["onesum"])+ parseFloat(item["onesum"]);
    }
  });
  let result = [];
  for(let i in temp) {
    result.push(temp[i]);
  }
  return result;
}
export { mergeCom,mergeSum }
