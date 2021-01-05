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
class hrBudgetCompletion extends React.Component{
  constructor(props){
    super(props)
  }
  onChangeDatePicker=(date, dateString)=>{
    this.props.dispatch({
      type : 'hrBudgetCompletion/onChangeDatePicker',
      dateInfo : dateString,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'hrBudgetCompletion/onChangeOu',
      ou : value,
    })
  };
  onChangeDept=(value)=>{
    this.props.dispatch({
      type : 'hrBudgetCompletion/onChangeDept',
      dept : value,
    })
  };
  onChangeEditionInfo=(value)=>{
    this.props.dispatch({
      type : 'hrBudgetCompletion/onChangeEditionInfo',
      editionInfo : value,
    })
  };
  queryData=()=>{
    this.props.dispatch({
      type : 'hrBudgetCompletion/queryData',
    })
  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'人力资源归口预算完成情况表');
  };
  render() {
    const {titleList, rawData, roleFlag} = this.props;
    let columns = [];
    let scrollX = 0;
    if (titleList&&rawData.length!==0){
      scrollX = 260;
      columns = [
        {
          title: '费用项目',
          width: 130,
          colSpan: 2,
          dataIndex: 'type',
          render: (text, record) => {
            return {children: <div>{text}</div>, props: {rowSpan: record[1]}}
          },
        },
        {
          title: '费用名称',
          width: 130,
          colSpan: 0,
          dataIndex: 'dept_name',
          render: (text, record) => {return <div>{text}</div>},
        },];
      if (titleList.length>3){
        scrollX += 390 + 130 * titleList.length;
        columns.push(
          {
            title:'人工成本（全院）',
            width: 390,
            dataIndex:'',
            children:[{
              title:titleList[0].name,
              dataIndex:titleList[0].id,
              render:(text, record)=>{
                return(
                  record.dept_name==='预算完成率'?
                    <div>{text}</div>:<MoneyComponentEditCell text={text || ' '}/>
                )
              }
            },{
              title:titleList[1].name,
              dataIndex:titleList[1].id,
              render:(text, record)=>{
                return(
                  record.dept_name==='预算完成率'?
                    <div>{text}</div>:<MoneyComponentEditCell text={text || ' '}/>
                )
              }
            },{
              title:titleList[2].name,
              dataIndex:titleList[2].id,
              render:(text, record)=>{
                return(
                  record.dept_name==='预算完成率'?
                    <div>{text}</div>:<MoneyComponentEditCell text={text || ' '}/>
                )
              }
            }]
          },
        );
        for (let i = 3;i<titleList.length;i++){
          columns.push({
            title: titleList[i].name,
            width: 130,
            dataIndex: titleList[i].id,
            render:(text, record)=>{
              return(
                record.dept_name==='预算完成率'?
                  <div>{text}</div>:<MoneyComponentEditCell text={text || ' '}/>
              )
            }
          },)
        }
      }
    }


    return (
      <div className={Style.wrap}>
        <Spin tip="加载中..." spinning={this.props.loading}>
          <TopSelectInfo
            data={this.props} flag='6'
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
    loading: state.loading.models.hrBudgetCompletion,
    ...state.hrBudgetCompletion
  };
}
export default connect(mapStateToProps)(hrBudgetCompletion);
