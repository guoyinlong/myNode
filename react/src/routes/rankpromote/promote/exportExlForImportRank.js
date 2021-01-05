/**
 * 作者：翟金亭
 * 日期：2019/11/18
 * 邮件：zhaijt3@chinaunicom.cn
 * 文件说明：前端拼接导出EXL
 */

let exportExl=function(JSONData, FileName, importLaborTitleList) {
  function  base64(s){ return window.btoa(unescape(encodeURIComponent(s))) }
  
  let excel = '';
  // //设置表头
  //第一行
  let row = "<tr>";
  for(let i = 0; i<importLaborTitleList.length; i++){
    row += "<th rowspan='1'>" + importLaborTitleList[i]["title"] + '</th>';
  }
  row += "</tr>";

  // //设置数据
  for (let j = 0; j < JSONData.length; j++) {
    row += "<tr>";
      //增加\t为了不让表格显示科学计数法或者其他格式
      for(let i = 0; i<importLaborTitleList.length; i++){
        if(JSONData[j][importLaborTitleList[i]["dataIndex"]] === null || JSONData[j][importLaborTitleList[i]["dataIndex"]] === '' || JSONData[j][importLaborTitleList[i]["dataIndex"]] === undefined){
          row += '<td style="vnd.ms-excel.numberformat:@">'  + 0.00 + '</td>';
        }else{
          row += '<td style="vnd.ms-excel.numberformat:@">'  + JSONData[j][importLaborTitleList[i]["dataIndex"]]+ '</td>';
        }
      }
    row += "</tr>";
  }

  excel += row;
    //Worksheet名
    let worksheet = FileName
    let uri = 'data:application/vnd.ms-excel;base64,';

    //下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${excel}</table></body></html>`;


      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri + base64(template);
      //对下载的文件命名
      link.download =  FileName + ".xls";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

}

export default exportExl
