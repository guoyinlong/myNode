/**
 * 作者：翟金亭
 * 日期：2020/02/20
 * 邮件：zhaijt3@chinaunicom.cn
 * 文件说明：前端拼接导出EXL
 */

let exportExlRank = function (JSONData, FileName) {
  function base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }

  let excel = '';
  // //设置表头
  //第一行
  let row = "<tr>";
  row += "<th rowspan='2'>" + '员工编号' + '</th>';
  row += "<th rowspan='2'>" + '姓名' + '</th>';
  row += "<th rowspan='2'>" + '年份' + '</th>';
  row += "<th colspan='5'>" + '岗位职级信息' + '</th>';
  row += "<th colspan='9'>" + '晋升信息' + '</th>';
  row += "</tr>";

  //第二行
  row += "<tr>";
  row += "<th>" + '职级信息（22级）' + '</th>';
  row += "<th>" + '职级信息（T职级）' + '</th>';
  row += "<th>" + '绩效职级（T职级）' + '</th>';
  row += "<th>" + '岗位信息' + '</th>';
  row += "<th>" + '同级岗位任职开始时间' + '</th>';
  row += "<th>" + '职级调整时间' + '</th>';
  row += "<th>" + '职级调整路径' + '</th>';
  row += "<th>" + '职级调整后结果' + '</th>';
  row += "<th>" + '薪档调整时间' + '</th>';
  row += "<th>" + '薪档调整路径' + '</th>';
  row += "<th>" + '薪档调整后的结果' + '</th>';
  row += "<th>" + '薪档晋升积分剩余情况' + '</th>';
  row += "<th>" + '是否G/D档封顶' + '</th>';
  row += "<th>" + 'G/D档封顶年份）' + '</th>';
  row += "</tr>";
  // //设置数据
  for (let i = 0; i < JSONData.length; i++) {
    row += "<tr>";
    row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['user_id'] + '</td>';
    row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['user_name'] + '</td>';
    row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['year'] + '</td>';
    row += '<td>' + JSONData[i]['rank_information_22'] + '</td>';
    row += '<td>' + JSONData[i]['rank_information_T'] + '</td>';
    row += '<td>' + JSONData[i]['rank_performance_T'] + '</td>';
    row += '<td>' + JSONData[i]['post_information'] + '</td>';
    row += '<td>' + JSONData[i]['same_level_position_start_time'] + '</td>';
    row += '<td>' + JSONData[i]['rank_adjust_time'] + '</td>';
    row += '<td>' + JSONData[i]['rank_adjust_path'] + '</td>';
    row += '<td>' + JSONData[i]['rank_adjust_result'] + '</td>';
    row += '<td>' + JSONData[i]['salary_adjust_time'] + '</td>';
    row += '<td>' + JSONData[i]['salary_adjust_path'] + '</td>';
    row += '<td>' + JSONData[i]['salary_adjust_result'] + '</td>';
    row += '<td>' + JSONData[i]['salary_promotion_remain_redits'] + '</td>';
    row += '<td>' + JSONData[i]['if_G_D_grade_stop'] + '</td>';
    row += '<td>' + JSONData[i]['G_D_grade_stop_year'] + '</td>';
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
  link.download = FileName + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

export default exportExlRank