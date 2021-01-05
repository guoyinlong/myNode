/**
 * 作者：翟金亭
 * 创建日期：2019-06-03
 * 邮箱：zhaijt3@chinaunicom.cn
 * 功能：实现一键导出excel功能
 */
var exportExl = function (SourceData,Name) {
    //要导出的json数据
    //const personDataListExport = this.props.personDataListExportSta;
    //列标题
  function  base64(s){ return window.btoa(unescape(encodeURIComponent(s))) }

    let str = '<tr><td>序号</td><td>员工编号</td><td>姓名</td><td>加班日期</td><td>加班原因</td><td>加班地点</td><td>天数</td></tr>';
    let personDataListExportTemp = [];
    for (let i = 0; i < SourceData.length; i++) {
      let personData = {
        indexID: i+1,
        user_id: SourceData[i].user_id,
        user_name: SourceData[i].user_name,
        overtime_time: SourceData[i].overtime_time,
        overtime_reson: SourceData[i].overtime_reson,
        overtime_place: SourceData[i].overtime_place,
        remark: SourceData[i].remark
      };
      personDataListExportTemp.push(personData);
    }
    //循环遍历，每行加入tr标签，每个单元格加td标签
    for (let j = 0; j < personDataListExportTemp.length; j++) {
      str += '<tr>';
      for (let item in personDataListExportTemp[j]) {
        //增加\t为了不让表格显示科学计数法或者其他格式
        str += `<td style="vnd.ms-excel.numberformat:@">${personDataListExportTemp[j][item]}</td>`;
      }
      str += '</tr>';
    }
    console.log("str:")
    console.log(str);
    console.log("str:")
    //Worksheet名
    let worksheet = Name+"加班数据"
    let uri = 'data:application/vnd.ms-excel;base64,';

    //下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;


      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri + base64(template);
      //对下载的文件命名
      link.download =  Name + "加班数据.xls";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

}

export default exportExl
