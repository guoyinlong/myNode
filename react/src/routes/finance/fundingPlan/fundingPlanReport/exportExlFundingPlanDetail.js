/**
 * 作者：杨青
 * 日期：2018-03-20
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：导出软件研究院资金计划追加调整明细
 */
let exportExlFundingPlanDetail=function(JSONData, FileName) {
  //先转化json
  let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
  let excel = '<table>';
  //设置表头
  let row = "<tr>";
  row += "<td style='font-weight:bold'>" + '项目'+ '</td>';
  row += "<td style='font-weight:bold'>" + '资金计划'+ '</td>';
  row += "<td style='font-weight:bold'>" + '调整金额'+ '</td>';
  row += "<td style='font-weight:bold'>" + '调整后'+ '</td>';
  row += "<td style='font-weight:bold'>" + '各项金额来源说明'+ '</td>';
  //换行
  excel += row + "</tr>";
  //设置数据
  for (let i = 0; i < arrData.length; i++) {
    let row = "<tr>";
    if(arrData[i]['fee_name'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['fee_name']+ '</td>';
    }
    if(arrData[i]['funds_plan'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['funds_plan']+ '</td>';
    }
    if(arrData[i]['funds_diff'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['funds_diff']+ '</td>';
    }
    if(arrData[i]['funds_current_amount'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['funds_current_amount']+ '</td>';
    }
    if(arrData[i]['remarks'] === undefined){
      row += "<td>" +''+ '</td>';
    }else{
      row += '<td>'  + arrData[i]['remarks']+ '</td>';
    }
    excel += row + "</tr>";
    if(arrData[i]['children'] !== undefined){
      let children = arrData[i]['children'];
      for (let j=0; j < children.length; j++) {
        let childrenRow = "<tr>";
        if(children[j]['fee_name'] === undefined){
          childrenRow += "<td>" +''+ '</td>';
        }else{
          childrenRow += '<td>'  + ' &nbsp; ' + children[j]['fee_name']+ '</td>';
        }
        if(children[j]['funds_plan'] === undefined){
          childrenRow += "<td>" +''+ '</td>';
        }else{
          childrenRow += '<td>'  + children[j]['funds_plan']+ '</td>';
        }
        if(children[j]['funds_diff'] === undefined){
          childrenRow += "<td>" +''+ '</td>';
        }else{
          childrenRow += '<td>'  + children[j]['funds_diff']+ '</td>';
        }
        if(children[j]['funds_current_amount'] === undefined){
          childrenRow += "<td>" +''+ '</td>';
        }else{
          childrenRow += '<td>'  + children[j]['funds_current_amount']+ '</td>';
        }
        if(children[j]['remarks'] === undefined){
          childrenRow += "<td>" +''+ '</td>';
        }else{
          childrenRow += '<td>'  + children[j]['remarks']+ '</td>';
        }
        excel += childrenRow + "</tr>";
      }
    }
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
  excelFile += FileName;
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

export {exportExlFundingPlanDetail}
