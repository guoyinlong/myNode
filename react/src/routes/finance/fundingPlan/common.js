/**
 * 作者：张楠华
 * 日期：2018-12-10
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：财务资金计划状态公用方法
 */
import { Popover,Icon } from "antd";
function stateCodeFill(text,record) {
  if(record.index_num ==='合计'){
    return {
      props:{ colSpan :0}
    }
  }else{
    if(text === '4'){
      return (
        <Popover placement="top"  title={'退回原因'} content={record.reject_reason}>
          <span style={{color : 'red'}}>退回</span><Icon type="info-circle-o" style={{ marginLeft:5 }}/>
        </Popover>
      )
    }else{
      return(
        <div>
          {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='5'?'删除':text==='3'?<div style={{color:'#00CC33'}}>审核通过</div>:'-'}
        </div>
      )
    }
  }
}
function renderContent(value, row) {
  let text = '';
  if(value === '0.00'){
    text = '-'
  }else{
    text = value
  }
  const obj = {
    children: text,
    props: {},
  };
  if (row.index_num === '合计') {
    obj.props.colSpan = 0;
  }
  return obj;
};
function renderContentMoney (value, row){
  let text = '';
  if(value === '0.00'){
    text = '-'
  }else{
    text = value
  }
  const obj = {
    children: text,
    props: {},
  };
  if (row.index_num === '合计') {
    obj.props.colSpan = 6;
  }
  return obj;
};
export { stateCodeFill,renderContent,renderContentMoney }
