/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划财务查询
 */
import React from 'react';
import {connect } from 'dva';
import SearchUI from './searchUINew'
class financeSearch extends SearchUI{

  //需要搜索的字段
  needSearch=['ou','payTime','deptName','teamName','applyUserName','claim_no'];
  //需要筛选的字段，key-value值需与后台返回的字段一致。key-value-text
  //表格中的数据
  getHeader=()=>{
    return [
      {
        title: '序号',
        dataIndex: '',
        key:'index',
        render: (text, record) => {return (record.index_num)},
        width:'80px'
      },
      {
        title:'支付日期',
        dataIndex:'payTime',
        width:'150px',
      },
      {
        title:'组织单元',
        dataIndex:'ou',
        width:'150px'
      },
      {
        title:'部门',
        dataIndex:'deptName',
        width:'150px',
        render: (text, record) => {return<div>{record.deptName.includes('-')?record.deptName.split('-')[1]:record.deptName}</div>}

      },
      {
        title:'小组',
        dataIndex:"teamName",
        width:'150px',
        //render:(text)=>{return <div style={{textAlign:'left'}}>{text}</div>}
      },
      {
        title:'报销申请人',
        dataIndex:'applyUserName',
        width:'150px',
      },
      {
        title: "业务大类名称",
        dataIndex: "busName",
        key:"busName",
        width: "150px",
        //render: (text) => {return <div style={{ textAlign: "left" }}>{text}</div>;}
      },
      {
        title:'报账单编号',
        dataIndex:'claim_no',
        width:'150px',
      },
      {
        title:'支付金额',
        dataIndex:"payAmount",
        width:'150px',
        render:(text)=><div style={{textAlign:'right'}}>{text}</div>
      },
      {
        title:'摘要',
        dataIndex:'summary',
        width:'150px',
        render:(text)=><div style={{textAlign:'left'}}>{text}</div>
      },
    ];
  };
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.commonSearch,
    ...state.commonSearch
  };
}
export default connect(mapStateToProps)(financeSearch);
