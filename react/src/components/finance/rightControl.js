/**
 * 作者：张楠华
 * 日期：2017-11-2
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：控制权限
 */
function rightControl(data,rightData){
    let flag = false;
    for(let i=0;i<rightData.length;i++){
      if(rightData[i].fullurl === data){
        flag =true;
        break;
      }
    }
    return flag;
  }
export default { rightControl }

