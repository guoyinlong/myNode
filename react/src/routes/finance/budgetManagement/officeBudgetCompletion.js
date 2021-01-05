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
class officeBudgetCompletion extends React.Component{
  constructor(props){
    super(props)
  }
  onChangeDatePicker=(date, dateString)=>{
    this.props.dispatch({
      type : 'officeBudgetCompletion/onChangeDatePicker',
      dateInfo : dateString,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'officeBudgetCompletion/onChangeOu',
      ou : value,
    })
  };
  onChangeDept=(value)=>{
    this.props.dispatch({
      type : 'officeBudgetCompletion/onChangeDept',
      dept : value,
    })
  };
  onChangeEditionInfo=(value)=>{
    this.props.dispatch({
      type : 'officeBudgetCompletion/onChangeEditionInfo',
      editionInfo : value,
    })
  };
  queryData=()=>{
    this.props.dispatch({
      type : 'officeBudgetCompletion/queryData',
    })
  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'办公室归口费用预算执行情况');
  };
  render() {
    const {titleList, data, roleFlag} = this.props;
    let columns = [];
    let scrollX = 0;
    if (titleList&&data.length!==0){
      if (titleList.length>8){
        columns = [
          {
            title: '序号',
            width: 60,
            fixed : 'left',
            render:(text,record,index)=>{return index + 1;},
          },
          {
            title: '费用名称',
            width: 130,
            fixed : 'left',
            dataIndex: 'fee_name',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '预算',
            width: 130,
            fixed : 'left',
            dataIndex: 'total_budget',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '执行数',
            width: 130,
            fixed : 'left',
            dataIndex: 'total_cost',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '完成率',
            width: 130,
            fixed : 'left',
            dataIndex: 'complete_ratio',
            render: (text, record) => {return <div>{text}</div>},
          },
        ];
      }else{
        columns = [
          {
            title: '序号',
            width: 60,
            render:(text,record,index)=>{return index + 1;},
          },
          {
            title: '费用名称',
            width: 130,
            dataIndex: 'fee_name',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '预算',
            width: 130,
            dataIndex: 'total_budget',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '执行数',
            width: 130,
            dataIndex: 'total_cost',
            render: (text, record) => {return <div>{text}</div>},
          },
          {
            title: '完成率',
            width: 130,
            dataIndex: 'complete_ratio',
            render: (text, record) => {return <div>{text}</div>},
          },
        ];
      }

      scrollX = 130 * 4 + 60 + 130 * titleList.length;
      for (let i = 0; i< titleList.length; i++) {
        columns.push({
          title:titleList[i].name,
          width: 130,
          dataIndex:titleList[i].id,
          render:(text, record)=><div>{text}</div>
        });
      }
    }


    return (
      <div className={Style.wrap}>
        <Spin tip="加载中..." spinning={this.props.loading}>

          <TopSelectInfo
            data={this.props} flag='5'
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
              dataSource={data}
              className={styles.financeTable}
              pagination={false}
              scroll={{ x: scrollX}}
            />
          </div>
          <div id="table1" style={{marginTop: '20px',display:'none'}}>
            <Table
              columns={columns}
              dataSource={data}
              className={styles.financeTable}
              pagination={false}
              scroll={{ x: scrollX}}
            />
          </div>
        </Spin>
      </div>
    );
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.officeBudgetCompletion,
    ...state.officeBudgetCompletion
  };
}
export default connect(mapStateToProps)(officeBudgetCompletion);
