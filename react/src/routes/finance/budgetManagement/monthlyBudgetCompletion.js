/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：月度预算完成情况
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import styles from './budgetStyle.less';
import TopSelectInfo from './topSelect';
import { Spin, Table } from "antd";
import exportExl from '../../../components/commonApp/exportExl';
import {MoneyComponentEditCell} from '../cost/costCommon.js';
class monthlyBudgetCompletion extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    flag : true,
  };
  onChangeDatePicker=(date, dateString)=>{
    this.props.dispatch({
      type : 'monthlyBudgetCompletion/onChangeDatePicker',
      dateInfo : dateString,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'monthlyBudgetCompletion/onChangeOu',
      ou : value,
    })
  };
  onChangeDept=(value)=>{
    this.props.dispatch({
      type : 'monthlyBudgetCompletion/onChangeDept',
      dept : value,
    })
  };
  onChangeEditionInfo=(value)=>{
    this.props.dispatch({
      type : 'monthlyBudgetCompletion/onChangeEditionInfo',
      editionInfo : value,
    })
  };
  queryData=()=>{
    const { editionInfo } = this.props;
    if (editionInfo === '0'){
      this.setState({
        flag:false,
      })
    }else{
      this.setState({
        flag:true,
      })
    }
    this.props.dispatch({
      type : 'monthlyBudgetCompletion/queryData',
    })
  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'月度预算完成情况');
  };
  render() {
    const {monthList, rawData, roleFlag, title} = this.props;
    let columns = [];
    let childColumns = [];
    let scrollX = 0;

    if (monthList&&rawData.length!==0){
      scrollX = 390 + 390 * monthList.length;
      if (this.state.flag === true){
        if (monthList.length>2){
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              width: 390,
              fixed : 'left',
              dataIndex: 'fee_use_name',
            },
            {
              title: title,
              children:childColumns
            }
          ];
        }else{
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              width: 390,
              dataIndex: 'fee_use_name',
            },
            {
              title: title,
              children:childColumns
            }
          ];
        }

      }else {
        if (monthList.length>2){
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              colSpan: 3,
              width: 130,
              fixed : 'left',
              dataIndex: 'fee_use_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {rowSpan: record[3],colSpan: record.col1}}
              },
            },
            {
              title: '项目（单位：元）',
              key: 'b',
              colSpan: 0,
              width: 130,
              fixed : 'left',
              dataIndex: 'concentration_fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {rowSpan: record[2],colSpan: record.col2}}
              },
            },
            {
              title: '项目（单位：元）',
              key: 'c',
              colSpan: 0,
              width: 130,
              fixed : 'left',
              dataIndex: 'fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {colSpan: record.col3}}
              }
            },
            {
              title: title,
              children:childColumns
            }
          ];
        }else{
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              colSpan: 3,
              width: 130,
              dataIndex: 'fee_use_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {rowSpan: record[3],colSpan: record.col1}}
              },
            },
            {
              title: '项目（单位：元）',
              key: 'b',
              colSpan: 0,
              width: 130,
              dataIndex: 'concentration_fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {rowSpan: record[2],colSpan: record.col2}}
              },
            },
            {
              title: '项目（单位：元）',
              key: 'c',
              colSpan: 0,
              width: 130,
              dataIndex: 'fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {colSpan: record.col3}}
              },
            },
            {
              title: title,
              children:childColumns
            }
          ];
        }
      }
      for (let i = 0; i< monthList.length; i++) {
        childColumns.push({
          title:monthList[i]+'月',
          dataIndex:monthList[i],
          children:[{
            title:'预算',
            width: 130,
            dataIndex:monthList[i]+'_budget_month_value',
            render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>
          },{
            title:'实际数',
            width: 130,
            dataIndex:monthList[i]+'_cost_month_value',
            render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>
          },{
            title:'预算完成率',
            width: 130,
            dataIndex:monthList[i]+'_budget_completion_rate',
            render:  (text, record) => <div>{text}</div>
          }]
        });
      }
      scrollX = scrollX + 390;
      childColumns.push({
        title:'合计',
        children:[{
          title:'预算',
          dataIndex:'budget_value',
          width: 130,
          render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>
        },{
          title:'实际数',
          dataIndex:'cost_value',
          width: 130,
          render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>
        },{
          title:'预算完成率',
          dataIndex:'completion_rate',
          width: 130,
          render:  (text, record) => <div>{text}</div>
        }]
      });
    }
    return (
      <div className={Style.wrap}>
        <Spin tip="加载中..." spinning={this.props.loading}>
          <TopSelectInfo
            data={this.props} flag='4'
            dispatch={this.props.dispatch}
            onChangeOu={this.onChangeOu}
            onChangeDatePicker={this.onChangeDatePicker}
            onChangeDeptOnlyOne={this.onChangeDept}
            onChangeEditionInfo={this.onChangeEditionInfo}
            queryData={this.queryData}
            exportExcel={this.exportExcel}
            roleFlag={roleFlag}
          />
          <div style={{marginTop: '20px'}}>
            <Table
              columns={columns}
              dataSource={rawData}
              className={styles.financeTable}
              pagination={false}
              scroll={{x:scrollX,y:550}}
            />
          </div>
          <div id="table1" style={{marginTop: '20px',display:'none'}}>
            <Table
              columns={columns}
              dataSource={rawData}
              className={styles.financeTable}
              pagination={false}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.monthlyBudgetCompletion,
    ...state.monthlyBudgetCompletion
  };
}
export default connect(mapStateToProps)(monthlyBudgetCompletion);
