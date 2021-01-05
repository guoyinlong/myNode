/**
 * 作者：张楠华
 * 日期：2017-10-19
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：导出数据
 */
let exportExlTimeSheet=function(JSONData, FileName, ShowLabel) {
  //先转化json
  let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;

  let excel = '<table>';
  //设置表头
  let row = "<tr>";
  for(let i = 0; i<arrData.length; i++){
    if(arrData[i].hasOwnProperty('dept_name')){
      row += "<td>" + '部门名称'+ '</td>';
      break;
    }
  }
  row += "<td>" + '项目名称'+ '</td>';
  row += "<td>" + '项目编号'+ '</td>';
  for (let i = 0, l = ShowLabel.length; i < l; i++) {
    row += "<td>" + ShowLabel[i] + '</td>';
  }
  row += "<td>" + '总计'+ '</td>';
  //换行
  excel += row + "</tr>";
  //设置数据
  for (let i = 0; i < arrData.length; i++) {
    let row = "<tr>";
    if(arrData[i].hasOwnProperty('dept_name')){
      row += "<td>" + arrData[i]['dept_name']+ '</td>';
    }
    if(arrData[i]['proj_name'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['proj_name']+ '</td>';
    }
    if(arrData[i]['proj_code'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['proj_code']+ '</td>';
    }
    for( let j=0;j< ShowLabel.length; j++ ){
      row += '<td>'  + arrData[i][ShowLabel[j]]+ '</td>';
    }
    row += '<td>'  + arrData[i]['total']+ '</td>';
    excel += row + "</tr>";
  }

  excel += "</table>";

  let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += arrData[0].hasOwnProperty('dept_name')?'项目分摊管理':'工时管理';
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";

  let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

  let link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = FileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {exportExlTimeSheet}
