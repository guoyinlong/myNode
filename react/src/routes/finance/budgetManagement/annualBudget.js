/**
 * 作者：杨青
 * 日期：2018-10-8
 * 邮箱：yangq41@chinaunicom.cn
 * 功能：年度预算
 */
import React from 'react';
import {connect } from 'dva';
import Style from '../../../components/employer/employer.less';
import styles from './budgetStyle.less';
import TopSelectInfo from './topSelect';
import { Spin, Table, message, Input } from "antd";
import {MoneyComponent} from '../cost/costCommon.js';
import exportExl from '../../../components/commonApp/exportExl';
import EditItem from './editComponent.js';
class annualBudget extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isUploadingFile:false,  /*是否正在上传文件*/
    };
  }
  onChangeDatePicker=(value)=>{
    this.props.dispatch({
      type : 'annualBudget/onChangeDatePicker',
      dateInfo : value,
    })
  };
  onChangeOu=(value)=>{
    this.props.dispatch({
      type : 'annualBudget/onChangeOu',
      ou : value,
    })
  };
  onChangeDept=(checkList,checkAll)=>{
    this.props.dispatch({
      type : 'annualBudget/onChangeDept',
      checkList,
      checkAll,
    })
  };
  queryData=()=>{
    this.props.dispatch({
      type : 'annualBudget/queryData',
      props:this.props
    })
  };

  //模板下载
  downloadBudgetTemp=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'annualBudget/downloadAnnualBudget',
    })
  };
  handleChange = (info) => {
    if (info.file.status === 'done') {
      this.setState({
        isUploadingFile:false,
      });
      if (info.file.response.RetCode === '1') {
        message.success(`${info.file.name} 导入成功！`);
        this.props.dispatch({
          type:'annualBudget/queryData',
        })
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 导入失败！`);
      }else if(info.file.response.RetCode === '0'){
        message.info(info.file.response.RetVal);
      }
    }
  };
  handleBeforUpload = (file, fileList) =>{
    this.setState({
      isUploadingFile:true,
    });

  };
  // 导出表格
  exportExcel=()=>{
    let tab=document.querySelector('#table1 table');
    exportExl()(tab,'年度预算');
  };
  cancelBudget=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'annualBudget/cancelBudget',
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
  onCellChange = (dataIndex,record) => {
    const {dispatch}=this.props;
    dispatch({
      type:'annualBudget/onCellChange',
      value:record['changedNewValue'],
      key:record.key,
      dept:dataIndex,
    })
  };
  itemCancel=(item,key,history)=>(e)=>{
    item[key]=history
  };
  render() {
    let scrollX=0;
    const {titleList, annualBudgetData, roleFlag, ouInfo} = this.props;
    const {isUploadingFile} = this.state;
    let columns = [];

    if (titleList&&annualBudgetData.length!==0){
      scrollX = 130*3;
      columns = [
        {
          title: '项目（单位：元）',
          fixed : 'left',
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
          fixed : 'left',
          key: 'b',
          colSpan: 0,
          width: 130,
          dataIndex: 'concentration_name',
          render: (text, record) => {
            return {children: <div>{text}</div>, props: {rowSpan: record[2],colSpan: record.col2}}
          },
        },
        {
          title: '项目（单位：元）',
          fixed : 'left',
          key: 'c',
          colSpan: 0,
          width: 130,
          dataIndex: 'fee_name',
          render: (text, record) => {
            return {children: <div>{text}</div>, props: {colSpan: record.col3}}
          },
        },
      ];
      if (titleList.length<6){
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
            dataIndex: 'concentration_name',
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
        for (let i = 0; i< titleList.length; i++) {
          columns.push({
            title:titleList[i],
            dataIndex:titleList[i],
            width: 180,
            render:(text, record)=>(
              <EditItem isEdit={false} show={<MoneyComponent text={text}/>}
                        edit={<Input
                          defaultValue={text} maxLength = "200"
                          onChange={this.itemChange(record)}
                        />}
                        disabled={ouInfo.split('-')[1]==='联通软件研究院'||record.sub_total!=='非合计'}
                        onOk={()=> this.onCellChange(titleList[i],record)}
                        onCancel={()=>this.itemCancel(record,titleList[i],record)}
              />
            )
          });
          scrollX += 180;
        }

      }else{
        scrollX = scrollX + 180*titleList.length;
        for (let i = 0; i< titleList.length; i++) {
          columns.push({
            title:titleList[i],
            dataIndex:titleList[i],
            width: 180,
            render:(text, record)=>(
              <EditItem isEdit={false} show={<MoneyComponent text={text}/>}
                        edit={<Input
                          defaultValue={text} maxLength = "200"
                          onChange={this.itemChange(record)}
                        />}
                        disabled={record.sub_total!=='非合计'}
                        onOk={()=> this.onCellChange(titleList[i],record)}
                        onCancel={()=>this.itemCancel(record,titleList[i],record)}
              />
            )
          });

        }
      }

      columns.push({
        title: '合计',
        key: 'sum',
        width: 180,
        dataIndex: 'sum',
        render: (text, record) => (text==='0.00'?text:<MoneyComponent text={text || ' '}/>),
      });
      scrollX = scrollX + 180;
    }
    const uploadM={
      action:"/budgetservice/annual_budget_maintain/importFeeDataServlet",
      method: "POST",
      data: {
        arg_year:this.props.dateInfo,
        arg_ou:this.props.ouInfo.split('-')[1],
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
            data={this.props} flag='1'
            dispatch={this.props.dispatch}
            onChangeOu={this.onChangeOu}
            onChangeDatePicker={this.onChangeDatePicker}
            onChangeDept={this.onChangeDept}
            queryData={this.queryData}
            downloadBudgetTemp={this.downloadBudgetTemp}
            uploadM={uploadM}
            cancelBudget={this.cancelBudget}
            exportExcel={this.exportExcel}
            roleFlag={roleFlag}
            dataFlag={annualBudgetData.length}
          />
          <div style={{marginTop: '20px'}}>
            <Table
              columns={columns}
              dataSource={annualBudgetData}
              className={styles.financeTable}
              pagination={false}
              scroll={{x:scrollX,y:550}}
            />
          </div>
          <div id="table1" style={{marginTop: '20px',display:'none'}} >
            <Table
              columns={columns}
              dataSource={annualBudgetData}
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
    loading: state.loading.models.annualBudget,
    ...state.annualBudget
  };
}
export default connect(mapStateToProps)(annualBudget);
