/**
 * 作者：翟金亭
 * 日期：2019/11/18
 * 邮件：zhaijt3@chinaunicom.cn
 * 文件说明：前端拼接导出EXL
 */

let exportExl = function (JSONData, FileName) {
  function base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }

  let excel = '';
  // //设置表头
  //第一行
  let row = "<tr>";
  //row += "<th rowspan='2'>" + '员工编号' + '</th>';
  row += "<th rowspan='2'>" + '  ' + '</th>';
  row += "<th rowspan='2'>" + '工时占比' + '</th>';
  // row += "<th rowspan='2'>" + '部门' + '</th>';
  row += "<th rowspan='2'>" + '工资总额' + '</th>';
  row += "<th colspan='9'>" + '社会保险费' + '</th>';
  row += "<th colspan='1'>" + '住房公积金' + '</th>';
  row += "<th colspan='7'>" + '职工福利费' + '</th>';
  row += "<th colspan='3'>" + '其他人工成本' + '</th>';
  row += "<th rowspan='2'>" + '合计' + '</th>';
  row += "</tr>";

  //第二行
  row += "<tr>";
  row += "<th>" + '养老保险' + '</th>';
  row += "<th>" + '医疗保险' + '</th>';
  row += "<th>" + '失业保险' + '</th>';
  row += "<th>" + '工伤保险' + '</th>';
  row += "<th>" + '生育保险' + '</th>';
  row += "<th>" + '补充医疗保险' + '</th>';
  row += "<th>" + '企业年金' + '</th>';
  row += "<th>" + '补充养老保险' + '</th>';
  row += "<th>" + '其他社会保险' + '</th>';
  row += "<th>" + '住房公积金' + '</th>';
  row += "<th>" + '防暑降温补贴' + '</th>';
  row += "<th>" + '供暖费补贴' + '</th>';
  row += "<th>" + '独生子女费' + '</th>';
  row += "<th>" + '医药费用（体检费）' + '</th>';
  row += "<th>" + '困难补助' + '</th>';
  row += "<th>" + '加班餐费' + '</th>';
  row += "<th>" + '其他' + '</th>';
  row += "<th>" + '员工管理费' + '</th>';
  row += "<th>" + '劳动保护费' + '</th>';
  row += "<th>" + '其他' + '</th>';
  row += "</tr>";

  // //设置数据
  for (let i = JSONData.length-1; i < JSONData.length; i++) {
    row += "<tr>";
    // for (let item in JSONData[i]) {
    //   //增加\t为了不让表格显示科学计数法或者其他格式
    //   row += `<td style="vnd.ms-excel.numberformat:@">${JSONData[i][item]}</td>`;
    // }
    //row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['user_id'] + '</td>';
    row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['user_name'] + '</td>';
    row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['ratio'] + '</td>';
    // row += '<td style="vnd.ms-excel.numberformat:@">' + JSONData[i]['dept_name'] + '</td>';
    row += '<td>' + JSONData[i]['total_sum'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_yalbx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_yilbx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_syebx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_gsbx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_syubx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_bcyilbx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_qynj'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_bcyalbx'] + '</td>';
    row += '<td>' + JSONData[i]['shbx_qtbx'] + '</td>';
    row += '<td>' + JSONData[i]['zf_gjj'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_fsjw'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_gnf'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_dszn'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_ylfy'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_knbz'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_jbcf'] + '</td>';
    row += '<td>' + JSONData[i]['zgfl_qt'] + '</td>';
    row += '<td>' + JSONData[i]['qtcb_yggl'] + '</td>';
    row += '<td>' + JSONData[i]['qtcb_ldbh'] + '</td>';
    row += '<td>' + JSONData[i]['qtcb_qt'] + '</td>';
    row += '<td>' + JSONData[i]['total_fee'] + '</td>';
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

export default exportExl