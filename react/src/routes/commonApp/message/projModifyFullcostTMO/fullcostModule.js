/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 文件说明：TMO修改已立项的全成本数据后，TMO和审核人查看待办、已办、办结的共用页面,静态查看页面
 */

import React from 'react';
import { Table , Icon } from 'antd';
import styles from '../projChangeCheck/projCheck.less';
import config from '../../../../utils/config';

/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 功能：转变为千分位
 * @param value 输入的值
 */
function change2Thousands (value) {
  if(value !== undefined){
    return value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '';
  }
}

/**
 * 作者：邓广晖
 * 创建日期：2018-04-10
 * 邮件：denggh6@chinaunicom.cn
 * 功能：审核TMO修改全成本页面,配合部门使用“非对比”形式，预算使用“对比”形式
 */
class FullcostModule extends React.PureComponent {

  coorpColumns = [
    {
      title:'序号',
      dataIndex:'',
      render: (value,row,index) =>{return(index+1);}
    },
    {
      title: '配合部门',
      dataIndex: 'dept_name',
      render: (value,row,index) =>{
        return (<div style={{textAlign:'left'}}>{value + row.NewOldFlag}</div>);
      }
    },
    {
      title: '配合方联系人',
      dataIndex: 'mgr_name',
      render: (value,row,index) =>{
        return (<div style={{textAlign:'left'}}>{value}</div>);
      }
    }
  ];

  budgetColumns = [
    {
      title: '部门',
      dataIndex: 'deptName',
      width:'13%',
      render: (value, row, index) => {
        if('feeIsDelete' in row && row.feeIsDelete === true){
          return {
            children: <del style={{color:'red',textAlign:'left'}}><div style={{color:'#345669'}}>{value}</div></del>,
            props: {rowSpan:row.deptRowSpan},
          };
        }else{
          return {
            children: <div style={{textAlign:'left'}}>{value}</div>,
            props: {rowSpan:row.deptRowSpan},
          };
        }
      },
    },{
      title: '年度',
      dataIndex: 'year',
      render: (value, row, index) => {
        return {
          children: value,
          props: {rowSpan:row.yearRowSpan},
        };
      }
    },{
      title: '费用类型',
      dataIndex: 'feeType',
      render: (value, row, index) => {
        if(Number(row.newMoney) !== Number(row.oldMoney)){
          return(<div style={{textAlign:'left',paddingLeft:row.deptNamePadLeft,color:'red'}}>{value}</div>);
        }else{
          return(<div style={{textAlign:'left',paddingLeft:row.deptNamePadLeft}}>{value}</div>);
        }

      }
    },{
      title: '原值',
      dataIndex: 'oldMoney',
      render: (value, row, index) => {
        if('feeIsDelete' in row && row.feeIsDelete === true && Number(value) !== 0){
          if(row.kindOfFee === '1'){
            return(
              <del style={{color:'red',textAlign:'right'}}>
                <div style={{color:'#345669'}}>{change2Thousands(value)}</div>
              </del>
            );
          }else{
            return(
              <del style={{color:'red',textAlign:'right'}}>
                <div style={{color:'#345669'}}>{value}</div>
              </del>
            );
          }
        }else{
          if(row.kindOfFee === '1'){
            return(<div style={{textAlign:'right'}}>{change2Thousands(value)}</div>);
          }else{
            return(<div style={{textAlign:'right'}}>{value}</div>);
          }

        }
      }
    },{
      title: '新值',
      dataIndex: 'newMoney',
      render: (value, row, index) => {
        if(Number(value) !== Number(row.oldMoney)){
          if(row.kindOfFee === '1'){
            return(<div style={{color:'red',textAlign:'right'}}>{change2Thousands(value)}</div>);
          }else{
            return(<div style={{color:'red',textAlign:'right'}}>{value}</div>);
          }
        }else{
          if(row.kindOfFee === '1'){
            return(<div style={{textAlign:'right'}}>{change2Thousands(value)}</div>);
          }else{
            return(<div style={{textAlign:'right'}}>{value}</div>);
          }
        }
      }
    },{
      title: '对比',
      dataIndex: 'compare',
      render: (value, row, index) => {
        if(row.newMoney !== row.oldMoney && row.oldMoney !== ''){
          if(Number(row.newMoney) === 0 || Number(row.oldMoney) === 0){
            return('');
          }
          let rate = (Number(row.newMoney) -  Number(row.oldMoney))/Number(row.oldMoney);
          let rateShow = (rate * 100).toFixed(2) + '%';
          if(rate > 0){
            return(
              <div style={{color:'red'}}>
                <span style={{color:'red'}}>{rateShow}</span>
                <Icon type={'arrow-up'}/>
              </div>
            );
          }else if(rate < 0){
            return(
              <div style={{color:'green'}}>
                <span style={{color:'green'}}>{rateShow}</span>
                <Icon type={'arrow-down'}/>
              </div>
            );
          }
        }else{
          return('');
        }
      }
    }
  ];

  render(){
    return(
      <div>
        <div className={styles.coorpDept}>{config.COORP_DEPT_INFO}</div>
        <Table columns={this.coorpColumns}
               dataSource={this.props.coorpDeptList}
               pagination={false}
               className={styles.fullCostDeptTable}
        />
        <br/><br/>
        <div className={styles.coorpDept}>{config.DEPT_BUDGET_INFO}</div>
        <Table dataSource={this.props.compBudgetTableData}
               columns={this.budgetColumns}
               pagination={false}
               className={styles.fullCostDeptTable}
        />
      </div>

    )
  }
}

export default FullcostModule;
