/**
 * 作者：张楠华
 * 日期：2017-11-14
 * 邮箱：zhangnh6@chinaunicom.cn
 * 功能：导出数据
 */
let exportExlData=function(JSONData, FileName,projInfoOne,projInfoTwo,columns) {
  let excel = '<table>';
  if(projInfoOne.length !==0){
    let deptNameSecond=projInfoOne.dept_name_second !== undefined ? projInfoOne.dept_name_second:'-';
    let confirm_replace_money =projInfoTwo.confirm_replace_money !==undefined ? projInfoTwo.confirm_replace_money:'-';
    let replace_money =projInfoTwo.replace_money !==undefined ? projInfoTwo.replace_money:'-';
    let budget_profit =projInfoTwo.budget_profit !==undefined ? projInfoTwo.budget_profit:'-';
    let real_profit =projInfoTwo.real_profit !==undefined ? projInfoTwo.real_profit:'-';
    excel+="<tr>" +
      "<td>项目名称</td><td>"+projInfoOne.proj_name+"</td>" +
      "</tr>";
    excel+="<tr>" +
      "<td>项目编码</td><td>"+projInfoOne.proj_code+"</td>" +
      "<td>PMS编码</td><td>"+projInfoOne.pms_code+"</td>" +
      "<td>项目周期</td><td>"+projInfoOne.begin_time+'到'+projInfoOne.end_time+"</td>" +
      "<td>项目周期</td><td>"+projInfoOne.proj_tag+"</td>" +
      "</tr>";
    excel+="<tr>" +
      "<td>项目经理</td><td>"+projInfoOne.proj_manager+"</td>" +
      "<td>项目成员数量(人)</td><td>"+projInfoOne.staff_num+"</td>" +
      "<td>主责部门</td><td>"+projInfoOne.dept_name_primary || null +"</td>" +
      "</tr>";
    excel+="<tr>" +
      "<td>投资替代额(元)</td><td>"+replace_money+"</td>" +
      "<td>确认投资替代额(元)</td><td>"+confirm_replace_money+"</td>" +
      "<td>预计利润(元)</td><td>"+budget_profit+"</td>" +
      "<td>实际利润(元)</td><td>"+real_profit+"</td>" +
      "</tr>";
    excel+="<tr>" +
      "<td>参与部门</td><td>"+deptNameSecond+"</td>" +
      "</tr>";
  }
  // //设置表头
  let row = "<tr>";
  row += "<th rowspan='2'>" + '类别' + '</th>';
  row += "<th colspan='3'>" + '项目合计' + '</th>';
  for (let i = 2, l = columns.length; i < l; i++) {
    row += "<th colspan='3'>" + columns[i].title + '</th>';
  }
  row += "</tr>";
  row += "<tr>";
  row += "<th>" + '预算数' + '</th>';
  row += "<th>" + '实际完成数' + '</th>';
  row += "<th>" + '预算完成率' + '</th>';
  for (let i = 2, l = columns.length; i < l; i++) {
    row += "<th>" + '预算数' + '</th>';
    row += "<th>" + '实际完成数' + '</th>';
    row += "<th>" + '预算完成率' + '</th>';
  }
  // //换行
    row += "</tr>";
  // //设置数据
  for (let i = 0; i < JSONData.length; i++) {
    row += "<tr>";
    row += '<td>'  + JSONData[i]['fee_inner_name']+ '</td>';
    row += '<td>'  + JSONData[i]['allbudgetfee']+ '</td>';
    row += '<td>'  + JSONData[i]['allfee']+ '</td>';
    row += '<td>'  + JSONData[i]['AllFeeCompletionRate']+ '</td>';
    for (let j = 2, l = columns.length; j < l; j++) {
      row += '<td>'  + JSONData[i]['budget_fee-'+columns[j].title]+ '</td>';
      row += '<td>'  + JSONData[i]['fee-'+columns[j].title]+ '</td>';
      row += '<td>'  + JSONData[i]['FeeCompletionRate-'+columns[j].title]+ '</td>';
    }
    row += "</tr>";
  }

  excel += row+"</table>";

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
  excelFile += "预算完成情况汇总";
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

export {exportExlData}
