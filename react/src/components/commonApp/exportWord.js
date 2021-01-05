/**
 * 文件说明：导出Word
 * 作者：陈莲
 * 邮箱：chenl192@chinaunicom.cn
 * 创建日期：2018-01-28
 */
var exportWord = function () {
  //var idTmr;

  function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    //debugger
    if (explorer.indexOf("MSIE") >= 0) {
      return 'Chrome';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
      return 'Firefox';
    }
    //Chrome
    else if (explorer.indexOf("Chrome") >= 0) {
      return 'Chrome';
    }
    //Opera
    else if (explorer.indexOf("Opera") >= 0) {
      return 'Opera';
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
      return 'Safari';
    } else {
      return 'ie'
    }
  }

  function method1(divid, tabName) {//整个表格拷贝到EXCEL中
    if (getExplorer() == 'ie') {
      var curTbl = document.getElementById(divid);
      var oXL = new ActiveXObject("Excel.Application");
      //debugger
      //创建AX对象excel
      var oWB = oXL.Workbooks.Add();
      //获取workbook对象
      var xlsheet = oWB.Worksheets(1);
      //激活当前sheet
      var sel = document.body.createTextRange();
      sel.moveToElementText(curTbl);
      //把表格中的内容移到TextRange中
      sel.select;
      //全选TextRange中内容
      sel.execCommand("Copy");
      //复制TextRange中内容
      xlsheet.Paste();
      //粘贴到活动的EXCEL中
      oXL.Visible = true;
      //设置excel可见属性

      try {
        var fname = oXL.Application.GetSaveAsFilename(tabName + ".xls", "Excel Spreadsheets (*.xls), *.xls");
      } catch (e) {
        print("Nested catch caught " + e);
      } finally {
        oWB.SaveAs(fname);

        // oWB.Close(savechanges = false);
        oWB.Close();
        //xls.visible = false;
        oXL.Quit();
        oXL = null;
        //结束excel进程，退出完成
        //window.setInterval("Cleanup();",1);
        //idTmr = window.setInterval("Cleanup();", 1);
      }
    } else {
      tableToWord(divid, tabName)
    }
  }

  //  function Cleanup() {
  //      window.clearInterval(idTmr);
  //      CollectGarbage();
  //  }


  var tableToWord = (function () {

    var uri = 'data:application/vnd.ms-word;base64,',
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"></head><body><div>{div}</div></body></html>',
      base64 = function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
      },
      // 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
      format = function (s, c) {
        return s.replace(/{(\w+)}/g,
          function (m, p) {
            return c[p];
          }
        )
      };
    return function (div, name) {

      if (!div.nodeType) {
        div = document.getElementById(div)
      }
      //创建一个div的拷贝
      let div1=document.createElement('div')
      div1.innerHTML=div.innerHTML
      // 获取表单的名字和表单查询的内容

      var ctx = {div: div1.innerHTML};
      // format()函数：通过格式操作使任意类型的数据转换成一个字符串
      // base64()：进行编码

      var link = document.createElement("a");
      link.href = uri + base64(format(template, ctx));

      link.style = "visibility:hidden";
      link.download = name + ".doc";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  })()
  return method1
}
export default exportWord
