/*
*excel导出
*Author: 任金龙
*Date: 2017年11月1日
*Email: renjl33@chinaunicom.cn
*/
let exportExlMember=function(JSONData, FileName, ShowLabel,key,flag) {
  //先转化json
  let excel = '<table>';
  if(flag==1){
    let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
    //设置表头
    let row = "<tr>";
    //console.log(ShowLabel.length);
    for (let i = 0, l = ShowLabel.length; i < l; i++) {
      row += "<td>" + ShowLabel[i] + '</td>';
    }
    //换行
    excel += row + "</tr>";
    //设置数据
    for (let i = 0; i < arrData.length; i++) {
      let row = "<tr>";
      for( let j=0;j< ShowLabel.length; j++ ){
        if(key[j]=="i"){
          row += '<td>'  +(i+1)+ '</td>';
        }else {
          row += '<td x:str >'  + arrData[i][key[j]]+ '</td>';
        }
      }
      excel += row + "</tr>";
    }
   // excel += "</table>";
  }else{
    for(let j=0;j<3;j++) {
      //设置大表头
      let row = "<tr>";

      row += "<td>" + ShowLabel[0] + ':</td>' + "<td>"+JSONData[j]["ou"]+"</td>";
      row += "<td>" + ShowLabel[1] + ':</td>' +"<td>"+JSONData[j]["row"]+"</td>"
      row += "<td>" + ShowLabel[2] + ':</td>' + "<td>"+JSONData[j]["sum"]+"</td>";
      //换行
      excel += row + "</tr>";

      //设置表头
       row = "<tr>";

      for (let i = 3, l = ShowLabel.length; i < l; i++) {
        if(ShowLabel[i]=="项目人数"){
          row+="<td colspan='3'><table><tr><td colspan='3'>"+ ShowLabel[i] +"</td></tr>" +
            "<tr><td>"+ ShowLabel[i+1]+"</td>" +
            "<td>"+ShowLabel[i+2] +"</td>" +
            "<td>"+ShowLabel[i+3] +"</td></tr></table></td>";
          i=i+3;
        }else{
          row += "<td>" + ShowLabel[i] + '</td>';
        }

      }
      //换行
      excel += row + "</tr>";

      //设置数据
      for (let i = 0; i < JSONData[j]["proj"].length; i++) {
        let addrData=JSONData[j]["proj"];
          row = "<tr>";
        for (let k = 3; k < ShowLabel.length; k++) {

          if (key[k] == "i") {
            row += '<td>' + (i + 1) + '</td>';
          }else if(key[k]!="0"){
            row += '<td x:str >' + addrData[i][key[k]] + '</td>';
          }
        }
        excel += row + "</tr>";
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

export {exportExlMember}
