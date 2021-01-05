/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：预算执行情况
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less'
import styles from './budgetStyle.less';
import TopSelectInfo from './topSelect';
import { Spin, Table, Button, Input } from 'antd';
import exportExl from '../../../components/commonApp/exportExl';
import {MoneyComponentEditCell} from '../cost/costCommon.js';
import EditItem from './editComponent.js';
class budgetImplementation extends React.Component{
  constructor(props){
    super(props)
  };
  state = {
    flag : true,
  };
  onChangeDatePicker=(date, dateString)=>{
    this.props.dispatch({
      type : 'budgetImplementation/onChangeDatePicker',
      dateInfo : dateString,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'budgetImplementation/onChangeOu',
      ou : value,
    })
  };
  // onChangeDept=(value)=>{
  //   this.props.dispatch({
  //     type : 'budgetImplementation/onChangeDept',
  //     dept : value,
  //   })
  // };
  onChangeDept=(checkList,checkAll)=>{
    this.props.dispatch({
      type : 'budgetImplementation/onChangeDept',
      checkList,
      checkAll,
    })
  };
  onChangeEditionInfo=(value)=>{
    this.props.dispatch({
      type : 'budgetImplementation/onChangeEditionInfo',
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
      type : 'budgetImplementation/queryData',
      props:this.props
    })
  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'年度预算执行情况');
  };
  generateMonthlyBudgetCompletion=()=>{
    this.props.dispatch({
      type : 'budgetImplementation/generateMonthlyBudgetCompletion',
    })
  };
  checkMonthlyBudgetCompletion=()=>{
    this.props.dispatch({
      type : 'budgetImplementation/checkMonthlyBudgetCompletion',
    })
  };
  cancelMonthlyBudgetCompletion=()=>{
    this.props.dispatch({
      type : 'budgetImplementation/cancelMonthlyBudgetCompletion',
    })
  };
  itemChange = (item) =>(e) => {
    let value = e.target.value;
    let isMinus = false;
    //如果以 — 开头
    if (value.indexOf('-') === 0) {
      isMinus = true;
    }

    //先将非数值去掉
    value = value.replace(/[^\d.]/g, '');
    //如果以小数点开头，或空，改为0
    if (value === '.') { value = '0'}
    //如果输入两个小数点，去掉一个
    if (value.indexOf('.') !== value.lastIndexOf('.')) {
      value = value.substring(0, value.lastIndexOf('.'))
    }
    //如果有小数点
    if (value.indexOf('.') >= 1 && value.indexOf('.') !== value.length - 1) {
      //费用项，最多2位小数
      value = value.substring(0, value.indexOf('.') + 3);
    }
    if(isMinus === true){
      value = '-' + value;
    }
    // if(this.props.changeValue){
    //   this.props.changeValue(value,this.props.feeName,this.props.record);
    // }
    item['changedNewValue'] = value;
  };
  onCellChange = (feeName,record,oldvalue) => {
    const {dispatch, dateInfo, ouInfo}=this.props;
    let postData = {
      arg_year:dateInfo.split('-')[0],
      arg_fee_id:record.fee_id,
      arg_ou:ouInfo.split('-')[1],
      arg_month:dateInfo.split('-')[1],
      arg_dept_name:feeName,
      arg_cost_month_value:record['changedNewValue']===undefined?oldvalue:record['changedNewValue'],
    };
    dispatch({
      type:'budgetImplementation/onCellChange',
      postData:postData,
    })
  };
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  };
  render() {
    const { data, titleList, state_code, roleFlag, role, ouInfo } = this.props;
    let columns = [];
    let scrollX = 0;
    if (titleList&&data.length!==0){
      scrollX = 390 + 920 * titleList.length;
      if (titleList.length<3){
        if (this.state.flag === true){
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              width: 390,
              dataIndex: 'fuse_name',
            }
          ];
        }else{
          columns = [{
            title: '项目（单位：元）',
            key: 'a',
            width: 195,
            colSpan: 2,
            dataIndex: 'fuse_name',
            render: (text, record) => {
              return {children: <div>{text}</div>, props: {rowSpan: record[3],colSpan: record.col1}}
            },
          },
            {
              title: '项目（单位：元）',
              key: 'c',
              width: 195,
              colSpan: 0,
              dataIndex: 'fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {colSpan: record.col2}}
              },
            },];
        }
      }else {
        if (this.state.flag === true){
          columns = [
            {
              title: '项目（单位：元）',
              key: 'a',
              width: 390,
              fixed : 'left',
              dataIndex: 'fuse_name',
            }
          ];
        }else{
          columns = [{
            title: '项目（单位：元）',
            key: 'a',
            width: 195,
            colSpan: 2,
            fixed : 'left',
            dataIndex: 'fuse_name',
            render: (text, record) => {
              return {children: <div>{text}</div>, props: {rowSpan: record[3],colSpan: record.col1}}
            },
          },
            {
              title: '项目（单位：元）',
              key: 'c',
              width: 195,
              colSpan: 0,
              fixed : 'left',
              dataIndex: 'fee_name',
              render: (text, record) => {
                return {children: <div>{text}</div>, props: {colSpan: record.col2}}
              },
            },];
        }
      }


      for (let i = 0; i< titleList.length; i++) {
        columns.push({
          title:titleList[i],
          dataIndex:titleList[i],
          children:[{
            title: '资本化后',
            dataIndex: 'capitalization_budget_fee_values',
            children:[{
              title: '年度预算',
              width: 150,
              dataIndex: titleList[i]+'_capitalization_budget_fee_values_budget_month_value',
              render:  (text, record) =>  <MoneyComponentEditCell text={text || ' '}/>
            },{
              title: '本年累计实际完成',
              width: 180,
              dataIndex: titleList[i]+'_capitalization_budget_fee_values_cost_month_value',
              render:(text, record)=>{
                return (
                  <EditItem isEdit={false} show={<MoneyComponentEditCell text={text || ' '}/>}
                            edit={<Input
                              defaultValue={text} maxLength = "200"
                              onChange={this.itemChange(record)}
                            />}
                            disabled={ouInfo.split('-')[1]==='联通软件研究院'||record.sub_total!=='非合计'||state_code==='1'}
                            onOk={()=> this.onCellChange(titleList[i],record,text)}
                            onCancel={()=>this.itemCancel(record,titleList[i],record)}
                  />)}
            },{
              title: '预算完成率',
              width: 130,
              dataIndex: titleList[i]+'_capitalization_budget_fee_values_budget_completion_rate',
              render:  (text, record) => <div>{text}</div>
            }]
          },{
            title: '全口径',
            key: 'c',
            dataIndex: 'aperture_budget_fee_values',
            children:[{
              title: '年度预算',
              width: 150,
              dataIndex: titleList[i]+'_aperture_budget_fee_values_budget_month_value',
              render:  (text, record) =>  <MoneyComponentEditCell text={text || ' '}/>
            },{
              title: '本年累计实际完成',
              width: 180,
              dataIndex: titleList[i]+'_aperture_budget_fee_values_cost_month_value',
              render:  (text, record) => <MoneyComponentEditCell text={text || ' '}/>
            },{
              title: '预算完成率',
              width: 130,
              dataIndex: titleList[i]+'_aperture_budget_fee_values_budget_completion_rate',
              render:  (text, record) => <div>{text}</div>
            }]
          }]
        });
      }

    }

    return (
      <div className={Style.wrap}>
        <Spin tip="加载中..." spinning={this.props.loading}>

          <TopSelectInfo
            data={this.props} flag='2'
            dispatch={this.props.dispatch}
            onChangeOu={this.onChangeOu}
            onChangeDatePicker={this.onChangeDatePicker}
            //onChangeDeptOnlyOne={this.onChangeDept}
            onChangeDept={this.onChangeDept}
            onChangeEditionInfo={this.onChangeEditionInfo}
            queryData={this.queryData}
            exportExcel={this.exportExcel}
            roleFlag={roleFlag}/>
          {
            ouInfo.split('-')[1]==='联通软件研究院'||role===false?null:
              <div>
                <div className={styles.titleSelect}>
                  <Button type="primary" onClick={this.generateMonthlyBudgetCompletion} disabled={state_code==='1'}>{'生成'}</Button>
                </div>
                <div className={styles.titleSelect}>
                  <Button type="primary" onClick={this.checkMonthlyBudgetCompletion} disabled={state_code!=='2'}>{'审核'}</Button>
                </div>
                <div className={styles.titleSelect}>
                  <Button type="primary" onClick={this.cancelMonthlyBudgetCompletion} disabled={state_code!=='1'}>{'撤销'}</Button>
                </div>
                <p style={{height:'15px', marginTop: '20px'}}>
                  <span style={{float:'left'}}>状态：<span style={{color:'red'}}>{state_code==='0'||state_code === ''?'待生成':state_code==='1'?'审核通过':'待审核'}</span></span>
                </p>
              </div>
          }
          <div style={{marginTop: '20px'}}>
            <Table
              columns={columns}
              dataSource={data}
              className={styles.financeTable}
              pagination={false}
              scroll={{x:scrollX,y:550}}
            />
          </div>
          <div id="table1" style={{marginTop: '20px',display:'none'}} >
            <Table
              columns={columns}
              dataSource={data}
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
    loading: state.loading.models.budgetImplementation,
    ...state.budgetImplementation
  };
}
export default connect(mapStateToProps)(budgetImplementation);
