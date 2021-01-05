/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：滚动预算
 */
import React from 'react';
import {connect } from 'dva';
import styles from './budgetStyle.less';
import Style from '../../../components/employer/employer.less';
import TopSelectInfo from './topSelect';
import { Spin, Table, message, Input } from "antd";
import exportExl from '../../../components/commonApp/exportExl';
import {MoneyComponentEditCell} from '../cost/costCommon.js';
import EditItem from './editComponent.js';
class rollingBudget extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isUploadingFile:false,  /*是否正在上传文件*/
    };
  }
  onChangeDatePicker=(value)=>{
    this.props.dispatch({
      type : 'rollingBudget/onChangeDatePicker',
      dateInfo : value,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'rollingBudget/onChangeOu',
      ou : value,
    })
  };
  onChangeDept=(checkList,checkAll)=>{
    this.props.dispatch({
      type : 'rollingBudget/onChangeDept',
      checkList,
      checkAll
    })
  };
  onChangeSeason=(value)=>{
    this.props.dispatch({
      type : 'rollingBudget/onChangeSeason',
      seasonInfo : value,
    })
  };
  onChangeDeptOnlyOne=(value)=>{
    this.props.dispatch({
      type : 'rollingBudget/onChangeDeptOnlyOne',
      deptInfoOnlyOne : value,
    })
  };
  queryData=()=>{
    this.props.dispatch({
      type : 'rollingBudget/queryData',
      //props:this.props
    })
  };
  downloadBudgetTemp=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'rollingBudget/downloadMonthlyRollingBudget',
    })
  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'滚动预算');
  };
  cancelMonthlyRollingBudget=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'rollingBudget/cancelMonthlyRollingBudget',
    })
  };
  handleBeforUpload = (file, fileList) =>{
    this.setState({
      isUploadingFile:true,
    });
    if(this.props.seasonInfo.length === 0){
      message.info('请选择季度');
      this.setState({
        isUploadingFile:false,
      });
      return false;
    }else if (this.props.seasonInfo.length > 1){
      message.info('只能导入一个季度数据');
      this.setState({
        isUploadingFile:false,
      });
      return false;
    }
  };
  handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({
        isUploadingFile:false,
      });
      if (info.file.response.RetCode === '1') {
        message.success(`${info.file.name} 导入成功！`);
        this.props.dispatch({
          type:'rollingBudget/queryData',
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败！`);
      }else if(info.file.response.RetCode === '0'){
        message.info(info.file.response.RetVal);
      }
    }
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
    const {dispatch}=this.props;
    let postData = {
      arg_year:this.props.dateInfo,
      arg_budget_fee_value:record['changedNewValue']===undefined?oldvalue:record['changedNewValue'],
      arg_ou:this.props.ouInfo.split('-')[1],
      arg_month:feeName.split('_')[1],
      arg_dept_name:feeName.split('_')[0],
      arg_fee_name:record.fee_name,
    };
    dispatch({
      type:'rollingBudget/onCellChange',
      postData:postData,
    })
  };
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  };
  render() {
    const {deptLists, monthList, rawData, seasonFlag, roleFlag, ouInfo} = this.props;
    const {isUploadingFile} = this.state;
    let routMonthList = [];
    if (monthList){
      for (let i=0;i<monthList.length;i++){
        routMonthList.push(monthList[i]);
      }
      if (seasonFlag!==true){
        routMonthList.push('sum_budget_value');
      }
    }
    let columns = [];
    let scrollX = 0;
    if (deptLists&&rawData.length!==0){
      scrollX = 390;
      if (deptLists.length<3){
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
        ];
      }else{
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
            },
          },
        ];
      }
      for (let i = 0; i< deptLists.length; i++) {
        if (seasonFlag===true){
          scrollX += 420;
          let test = [];
          for (let j = 0; j < routMonthList.length; j++){
            if (routMonthList[j].split('-')[0]===i.toString()){
              test.push(deptLists[i]+'_'+routMonthList[j].split('-')[2]);
            }
          }
          columns.push({
            title:deptLists[i],
            dataIndex:deptLists[i],
            children:test.map((item,index)=>({
              title:item.split('_')[1]+'月',
              dataIndex:item,
              width: 140,
              render:(text, record)=>{
                return (
                  <EditItem isEdit={false} show={<MoneyComponentEditCell text={text}/>}
                            edit={<Input
                              defaultValue={text} maxLength = "200"
                              onChange={this.itemChange(record)}
                            />}
                            disabled={ouInfo.split('-')[1]==='联通软件研究院'||record.sub_total!=='非合计'}
                            onOk={()=> this.onCellChange(deptLists[i]+'_'+item.split('_')[1],record)}
                            onCancel={()=>this.itemCancel(record,deptLists[i]+'_'+item.split('_')[1],record)}
                  />
                  )}
            })),
          });

        }else{
          scrollX += 140 * routMonthList.length;
          columns.push({
            title:deptLists[i],
            dataIndex:deptLists[i],
            children:routMonthList.map((item,index)=>({
              title:item==='sum_budget_value'?'小计':item+'月',
              dataIndex:deptLists[i]+'_'+item,
              width: 140,
              render:(text, record)=>{
                return (
                  <EditItem isEdit={false} show={<MoneyComponentEditCell text={text}/>}
                            edit={<Input
                              defaultValue={text} maxLength = "200"
                              onChange={this.itemChange(record)}
                            />}
                            disabled={ouInfo.split('-')[1]==='联通软件研究院'||record.sub_total!=='非合计'||item==='sum_budget_value'}
                            onOk={()=> this.onCellChange(deptLists[i]+'_'+item,record,text)}
                            onCancel={()=>this.itemCancel(record,deptLists[i]+'_'+item,record)}
                  />)}
            })),
          });
        }
      }
      if (seasonFlag===true){
        scrollX = scrollX + 240;
        columns.push({
          title:'合计',
          width: 240,
          dataIndex:'sum_budget_fee_value',
          render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>,
        });
      }else{
        scrollX = scrollX +420;
        columns.push({
          title:'合计',
          //fixed : 'right',
          children:routMonthList.map((item,index)=>({
            title:item==='sum_budget_value'?'小计':item+'月',
            dataIndex:item==='sum_budget_value'?'sum_budget_fee_value':'sub-'+item,
            width: 140,
            render:(text, record)=><MoneyComponentEditCell text={text || ' '}/>
          })),
        });
      }
    }
    const uploadM={
      action:"/budgetservice/monthly_budget_maintain/MonthlyRollingBudgetImportExcel",
      method: "POST",
      data: {
        argYear:this.props.dateInfo,
        argQuarter:this.props.seasonInfo,
        argOu:this.props.ouInfo.split('-')[1],
        argUserId:localStorage.userid,
      },
      name: "outSource",
      multiple: false,
      showUploadList: false,
      accept: '.xlsx,.xls',
      beforeUpload:this.handleBeforUpload,
      onChange:this.handleChange,
    }
    return (
      <div className={Style.wrap}>
        <Spin tip="加载中..." spinning={this.props.loading||isUploadingFile}>
          <TopSelectInfo
            data={this.props} flag='3'
            dispatch={this.props.dispatch}
            onChangeOu={this.onChangeOu}
            onChangeDatePicker={this.onChangeDatePicker}
            onChangeDept={this.onChangeDept}
            onChangeSeason={this.onChangeSeason}
            onChangeDeptOnlyOne={this.onChangeDeptOnlyOne}
            queryData={this.queryData}
            downloadBudgetTemp={this.downloadBudgetTemp}
            exportExcel={this.exportExcel}
            cancelBudget={this.cancelMonthlyRollingBudget}
            uploadM={uploadM}
            roleFlag={roleFlag}
            dataFlag={rawData.length}/>
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
    loading: state.loading.models.rollingBudget,
    ...state.rollingBudget
  };
}
export default connect(mapStateToProps)(rollingBudget);
