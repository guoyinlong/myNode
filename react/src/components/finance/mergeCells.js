/**
 * 作者：张楠华
 * 日期：2018-7-13
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：合并单元格
 */
function MergeCells (list,mergeCell,key){
  let rowSpanNum = 1;
  let rowSpanArray = [];
  for(let i=1;i<list.length;i++){
    if(list[i][mergeCell] !== list[i-1][mergeCell]){
      rowSpanArray.push(rowSpanNum);
      rowSpanNum = 1;
    }else{
      rowSpanNum++;
      if(i===list.length-1 && list[i][mergeCell] === list[i-1][mergeCell]){
        rowSpanArray.push(rowSpanNum);
      }
    }
  }
  //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
  for(let i=1;i<list.length;i++){
    list[0][key] = null;
    if(list[i][mergeCell] === list[i-1][mergeCell]){
      list[i][key] = 0;
    }else{
      list[i][key] = null;
    }
  }
  let j=0;
  for(let i=0;i<list.length;i++){
    if(list[i][key] === null){
      list[i][key] = rowSpanArray[j];
      j++;
    }
  }
}
export default { MergeCells }
