/**
 * 作者：杨青
 * 日期：2018-05-11
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：科技创新项目支出明细表
 */
let exportExlOneStcpProjCostDetail=function(JSONData, FileName, projName, projCode, columns, rowNum) {
  //先转化json
  let arrData = typeof JSONData !== 'object' ? JSON.parse(JSONData) : JSONData;
  let l = columns.length-2;
  let excel = '<table>';
  excel+="<tr><td style='font-weight:bold'>项目名称:</td><td colspan='2'>"+projName+"</td></tr>";
  excel+="<tr><td style='font-weight:bold'>项目编码:</td><td colspan='2'>"+projCode+"</td></tr>";
  //设置表头
  let row = "<tr>";
  for (let i=0;i<columns.length;i++){
    row += "<td style='font-weight:bold'>" + columns[i].title+ '</td>';
  }
  //换行
  excel += row + "</tr>";
  //设置数据
  for (let i=0;i<arrData.length;i++){
    let row = "<tr>";
    if (i===0){
      row += "<td rowspan="+rowNum[0].rowSpan+">"  + arrData[i]['fee_type']+ '</td>';
      for(let j=1;j<columns.length;j++){
        row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
      }
    } else{
      for (let z=1;z<rowNum.length;z++){
        if (i===rowNum[z-1].index+2){
          row += "<td rowspan="+rowNum[z].rowSpan+">"  + arrData[i]['fee_type']+ '</td>';
          for(let j=1;j<columns.length;j++){
            row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
          }
        } else if((i===rowNum[z].index+1)||(i===rowNum[0].index+1)||(i===arrData.length-1)){
          row += "<td colspan='2'>"  + arrData[i]['fee_name']+ '</td>';
          row += "<td colspan="+l+">"  + arrData[i][columns[2].dataIndex]+ '</td>';
        } else {
          for(let j=1;j<columns.length;j++){
            row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
          }
        }
      }
    }

    /*if (i===0){
      row += '<td rowspan="13">'  + arrData[i]['fee_type']+ '</td>';
      for(let j=1;j<columns.length;j++){
        row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
      }
    }else if((i>0&&i<13)||(i>14&&i<20)){
      //row += "<td>"  + ''+ '</td>';
      for(let j=1;j<columns.length;j++){
        row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
      }
    }else if((i===13)||(i===20)||(i===21)){
      row += "<td colspan='2'>"  + arrData[i]['fee_name']+ '</td>';
      row += "<td colspan="+l+">"  + arrData[i][columns[2].dataIndex]+ '</td>';
    }else if(i===14){
      row += "<td rowspan='6'>"  + arrData[i]['fee_type']+ '</td>';
      for(let j=1;j<columns.length;j++){
        row += '<td>'  + arrData[i][columns[j].dataIndex]+ '</td>';
      }
    }*/

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

export {exportExlOneStcpProjCostDetail}
