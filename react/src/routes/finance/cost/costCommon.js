/**
 * 作者：陈红华
 * 创建日期：2017-09-13
 * 邮箱：1045825949@qq.com
 * 文件说明：财务全成本公共方法
 */
import request from '../../../utils/request';
import Cookie from 'js-cookie';
import { Tooltip } from 'antd';
// 页面获取moduleId、ou
function getOU (routerUrl){
  var MPostData={
    argtenantid:Cookie.get('tenantid'),
    arguserid:Cookie.get('userid'),
    argrouterurl:routerUrl
  }
  var moduleIdData=request('/microservice/serviceauth/p_userhasmodule',MPostData);
  return moduleIdData.then((data)=>{
    var moduleId = data.moduleid;
    window.sessionStorage['financeCostModuleId']=moduleId;
    var OUPostData={
      argtenantid:Cookie.get('tenantid'),
      arguserid:Cookie.get('userid'),
      argmoduleid:moduleId,
      argvgtype:2 //全成本选择OU
    };
    var OUData=request('/microservice/serviceauth/p_usergetouordeptinmodule',OUPostData);
    return OUData;
  })
}
// 表格内容过多隐藏公共样式
function HideTextComp ({text}){
  return (
    <Tooltip title={text} style={{width:'30%'}}>
      <div style={{width:'135px',whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis',paddingRight:'5px'}}>{text}</div>
    </Tooltip>
  )
}
// 表格的数值保留俩位小数
function MoneyComponent({text}) {
  if(text!=0){
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</div>
    )
  }else{
    return (
      <div style={{textAlign:'right',letterSpacing:1}}>-</div>
    )
  }
}
function format (num) {
  return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
function MoneyComponentEditCell({text}) {
  if(text!=0){
    return (
      <span style={{textAlign:'right',letterSpacing:1}}>{text?format(parseFloat(text)):text}</span>
    )
  }else{
    return (
      <span style={{textAlign:'right',letterSpacing:1}}>-</span>
    )
  }
}
function TagDisplay({proj_tag}) {
  if(proj_tag === '0')return <span>TMO保存</span>;
  else if(proj_tag === '2') return <span>已立项</span>;
  else if(proj_tag === '4') return <span>已结项</span>;
  else if(proj_tag === '5') return <span>历史完成</span>;
  else if(proj_tag === '6') return <span>常态化项目</span>;
  else if(proj_tag === '7') return <span>中止/暂停</span>;
  else if(proj_tag === '8') return <span>删除</span>;
  else  return null;
}
export default {getOU,HideTextComp,MoneyComponent,MoneyComponentEditCell,TagDisplay}
