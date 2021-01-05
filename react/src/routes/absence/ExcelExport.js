/**
 * 作者：翟金亭
 * 修改：
 * 创建日期：2019-06-03
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现一键导出excel功能
 * TODO 传参需要多加一个map，标识中文名和英文名，方便取数
 *  
 */
var exportExl = function (SourceData, Name, condition) {
  //要导出的json数据
  //const personDataListExport = this.props.personDataListExportSta;
  //列标题
  function base64(s) { return window.btoa(unescape(encodeURIComponent(s))) }


  /**组织上面的str */
  let head = '<tr>';
  let num = '<td>序号</td>';
  let tail = '</tr>';

  let content = '';

  for (let key in condition) {
    content += '<td>' + key + '</td>';
  }
  content = head + num + content + tail;


  let dataListExportTemp = [];
  for (let i = 0; i < SourceData.length; i++) {
    /**变成循环读取 */
    let personData = {};
    personData.indexID = i + 1;
    for (let key in condition) {

      personData[condition[key]] = SourceData[i][condition[key]];
    }
    dataListExportTemp.push(personData);
  }
  //循环遍历，每行加入tr标签，每个单元格加td标签
  for (let j = 0; j < dataListExportTemp.length; j++) {
    content += '<tr>';
    for (let item in dataListExportTemp[j]) {
      //增加\t为了不让表格显示科学计数法或者其他格式
      content += `<td style="vnd.ms-excel.numberformat:@">${dataListExportTemp[j][item]}</td>`;
    }
    content += '</tr>';
  }
  //Worksheet名
  let worksheet = Name
  let uri = 'data:application/vnd.ms-excel;base64,';

  //下载的表格模板数据
  let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:x="urn:schemas-microsoft-com:office:excel" 
    xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
      <x:Name>${worksheet}</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
      </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table>${content}</table></body></html>`;


  //通过创建a标签实现
  let link = document.createElement("a");
  link.href = uri + base64(template);
  //对下载的文件命名
  link.download = Name + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

}

export default exportExl
