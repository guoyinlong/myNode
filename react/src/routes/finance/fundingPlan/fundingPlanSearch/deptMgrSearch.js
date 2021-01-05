/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划部门管理员查询
 */
import React from 'react';
import {connect } from 'dva';
import SearchUI from './searchUINew'
import Style from '../../../../components/employer/employer.less'

class deptMgrSearch extends SearchUI{

  //需要搜索的字段
  needSearch=['payTime','teamName','applyUserName','claim_no'];
  //表格中的数据
  getHeader=()=>{
    return [
      {
        title: '序号',
        dataIndex: '',
        key:'index',
        width:'60px',
        render: (text, record) => {return (record.index_num)},
      },
      {
        title:'支付日期',
        dataIndex:'payTime',
        width:"100px",
      },
      {
        title:'小组',
        dataIndex:'teamName',
        width:'120px'
      },
      {
        title:'报销申请人',
        dataIndex:"applyUserName",
        width:'120px',
        //render:(text)=><div style={{textAlign:'left'}}>{text}</div>
      },
      {
        title: "业务大类名称",
        dataIndex: "busName",
        key:"busName",
        width: "120px",
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
export default connect(mapStateToProps)(deptMgrSearch);
