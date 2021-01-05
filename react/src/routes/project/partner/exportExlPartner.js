/**
 * 作者：薛刚
 * 创建日期：2018-03-10
 * 邮件：xueg@chinaunicom.cn
 * 文件说明：合作伙伴信息导出
 */

let exportExcelPartner = function(jsonData, fileName, headerLabel1, headerLabel2, key, deptInfo, totalObj) {
  //先转化json
  let excel = '<table border="1">';
  let arrData = typeof jsonData !== 'object' ? JSON.parse(jsonData) : jsonData;
  //设置表头
  const title = headerLabel2.length==15?("<tr><td colspan='20' style='text-align:center;vertical-align:middle;font-size:30px;font-weight: bold'>合作伙伴服务确认单</td></tr>"):
  ("<tr><td colspan='21' style='text-align:center;vertical-align:middle;font-size:30px;font-weight: bold'>合作伙伴服务确认单</td></tr>");
  const dept = headerLabel2.length==15?("<tr><td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>生产业务部门：</td>" +
    "<td colspan='19' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+deptInfo+"</td></tr>"):
    ("<tr><td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>生产业务部门：</td>" +
    "<td colspan='20' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+deptInfo+"</td></tr>");
  const totalInfo = headerLabel2.length==15?("<tr><td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>工作量合计（人/月）：</td>" +
    "<td colspan='19' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+totalObj.total+"</td></tr>"):
    ("<tr><td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>工作量合计（人/月）：</td>" +
    "<td colspan='20' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+totalObj.total+"</td></tr>");
  let row = "<tr>";
  for (let i = 0, l = headerLabel1.length; i < l; i++) {
    if(i<=2 || i>=headerLabel1.length-2) {
      row += "<td rowspan='2' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>" + headerLabel1[i] + '</td>';
    } else if(i<=3) {
      if (headerLabel2.length==15) {
        row += "<td colspan='6' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>" + headerLabel1[i] + '</td>';
      }else{
        row += "<td colspan='7' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>" + headerLabel1[i] + '</td>';
      }
    } else if(i<headerLabel1.length-2) {
      row += "<td colspan='3' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>" + headerLabel1[i] + '</td>';
    }
  }
  row = row + "</tr>";
  row = title + dept + totalInfo + row;
  let row_level2 = "<tr>";
  for (let i = 0, l = headerLabel2.length; i < l; i++) {
    row_level2 += "<td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>" + headerLabel2[i] + '</td>';
  }
  row_level2 = row_level2 + "</tr>";
  //换行
  excel += row + row_level2;
  // 合并单元格
  const rowSpanArray = [], tmpArray = [];
  tmpArray.push(0);
  for (let m=0; m < arrData.length; m++){
    for(let n=m+1; n<arrData.length; n++) {
      if(arrData[m].total_month != arrData[n].total_month
        || arrData[m].proj_name != arrData[n].proj_name) {
        tmpArray.push(n);
        m = n-1; break;
      }
    }
  }
  if(tmpArray.length == 1) {
    rowSpanArray.push({
      index: 0,
      span: arrData.length
    })
  } else {
    for(let nn=0; nn<tmpArray.length; nn++) {
      if(nn == tmpArray.length-1) {
        rowSpanArray.push({
          index: tmpArray[nn],
          span: arrData.length-tmpArray[nn]
        })
      } else {
        rowSpanArray.push({
          index: tmpArray[nn],
          span: tmpArray[nn+1]-tmpArray[nn]
        })
      }

    }
  }
  //设置数据
  for (let mm=0; mm < arrData.length; mm++) {
    let row = "<tr>";
    for(let k=0; k<rowSpanArray.length; k++) {
      const item = rowSpanArray[k];
      if(item.index == mm) {
        for(let j=0; j< key.length+2; j++ ){
          if(j == 2) {
            let date = new Date(arrData[mm][key[j]]);
            row += "<td style='text-align:center;' rowspan=\'"+ item.span + "'>"+ date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + "</td>";
          } else if(j==0) {
            row += "<td rowspan=\'"+ item.span +"\'>"+ arrData[mm][key[j]] + "</td>";
          } else if(j== key.length+1){
            row += "<td rowspan=\'"+ item.span +"\'></td>";
          } else if(j== key.length) {
            row += "<td></td>";
          } else {
            row += "<td>"+ arrData[mm][key[j]] + "</td>";
          }
        }
      } else if(mm < item.index+item.span && mm > item.index) {
        for(let j=0; j< key.length+2; j++ ){
          if(j != 2 && j!=0 && j!= key.length+1) {
            if(j == key.length) {
              row += "<td></td>";
            } else {
              row += "<td>"+ arrData[mm][key[j]] + "</td>";
            }
          }
        }
      }
    }
    excel += row + "</tr>";
  }

  const sum = (headerLabel2.length==15?"<tr><td colspan='9' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>合计（人/月）：</td>":
  "<tr><td colspan='10' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>合计（人/月）：</td>") +
    "<td colspan='3' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+totalObj.total_h+"</td>" +
    "<td colspan='3' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+totalObj.total_m+"</td>" +
    "<td colspan='3' style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>"+totalObj.total_l+"</td>" +
    "<td colspan='2'></td></tr>";

  const sign = "<tr>" +
    "<td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>部门经理签字：</td>" +
    "<td colspan='8'></td>" +
    "<td style='text-align:center;vertical-align:middle;font-size:20px;font-weight: bold'>提交日期：</td>" +
    "<td colspan='10'></td>";

  excel += sum + sign +"</table>";

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
  excelFile += fileName;
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
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export {exportExcelPartner}
