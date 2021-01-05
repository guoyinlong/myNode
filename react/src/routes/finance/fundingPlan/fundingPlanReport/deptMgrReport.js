/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq416@chinaunicom.cn
 * 文件说明：部门资金计划报表
 */
import React from 'react';
import {connect} from 'dva';
import { routerRedux } from 'dva/router';
import {Button, Table,  DatePicker, message,Spin,Tabs,Select,Modal,Checkbox } from 'antd';
import { exportExlFundingPlanDetail } from './exportExlFundingPlanDetail'
import exportExl from '../../../../components/commonApp/exportExl';
import styles from '../fundingPlanReport.less'
const CheckboxGroup = Checkbox.Group;
const { MonthPicker } = DatePicker;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import moment from 'moment';
const plainOptions = ['资金计划追加调整明细表', '以前年度应付款支出明细表', 'capex现金支出明细表'];
const defaultCheckedList = [];
class DeptMgrReport extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      visible : false,
      checkedList: defaultCheckedList,
      indeterminate: false,
      checkAll: false,
    }
  }

  //点击查看团队跳转
  getDetail = (record)=> {
    const { dispatch }=this.props;
    dispatch(routerRedux.push({
      pathname:'/financeApp/funding_plan/funding_plan_deptMgr_report/funding_plan_team_report_detail',
      query: {
        month:record.total_month,
        year:record.total_year,
        reportType:this.props.reportType,
        deptName:record.dept_name,
        deptId:record.dept_id,
        flag:'3' //flag 为1代表返回到总院财务。flag为2，标识返回的分院财务报表,3部门
      }
    }));
  };
  //内部表格title
  expandedRowColumns = [
    { title: '项目', dataIndex: 'fee_name', width:'25%' },
    { title: '资金计划', dataIndex: 'funds_plan', width:'15%' },
    { title: '调整金额', dataIndex: 'funds_diff', width:'15%' },
    { title: '调整后资金计划', dataIndex: 'funds_current_amount', width:'15%' },
    { title: '各项金额来源说明', dataIndex: 'remarks', width:'30%' },
  ];
  expandedRowColumnsOld = [
    { title: '付款分类', dataIndex: 'pay_type', key: 'pay_type' },
    { title: '具体付款事项描述', dataIndex: 'pay_description', key: 'pay_description' },
    { title: '付款金额', dataIndex: 'fee_amount', key: 'fee_amount' },
  ];
  expandedRowColumnsCAPEX = [
    { title: '项目批复年度', dataIndex: 'proj_approval_year', key: 'proj_approval_year' },
    { title: '批复项目名称', dataIndex: 'approved_proj_name', key: 'approved_proj_name' },
    { title: '批复项目编号', dataIndex: 'approved_item_number', key: 'approved_item_number' },
    { title: '项目总预算', dataIndex: 'total_proj_budget', key: 'total_proj_budget' },
    { title: '合同名称', dataIndex: 'contract_title', key: 'contract_title' },
    { title: '合同总金额', dataIndex: 'contract_amount', key: 'contract_amount' },
    { title: '累计已支付金额', dataIndex: 'accumulated_amount_paid', key: 'accumulated_amount_paid' },
    { title: '本月付款金额', dataIndex: 'payment_amount_this_month', key: 'payment_amount_this_month' },
  ];

  // expandedRowColumnsExport = [
  //   {
  //     title: '项目',
  //     dataIndex: 'fee_name',
  //     width:'25%',
  //     render:(text,record)=>{
  //       if(record.key.includes('-')){
  //         return(
  //           <div style={{color : 'red'}}>{text}</div>
  //         )
  //       }else{
  //         return(
  //           <div>{text}</div>
  //         )
  //       }
  //
  //     }
  //   },
  //   { title: '资金计划', dataIndex: 'funds_plan', width:'15%' },
  //   { title: '调整金额', dataIndex: 'funds_diff', width:'15%' },
  //   { title: '调整后资金计划', dataIndex: 'funds_current_amount', width:'15%' },
  //   { title: '各项金额来源说明', dataIndex: 'remarks', width:'30%' },
  // ];
  //点击tab页切换
  queryData=(key)=>{
    const { dispatch } = this.props;
    if(key === '1'){
      dispatch({
        type:'deptMgrReport/getDeptMonthlyDetails',
        searchData:{
          arg_ou:this.props.ou,
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          arg_dept:this.props.dept,
          reportType:this.props.reportType,
        }
      });
    } else if(key === '2'){
      dispatch({
        type:'deptMgrReport/getOldMonthDetails',
        searchData:{
          arg_ou:this.props.ou,
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          reportType:this.props.reportType,
        }
      });
    }else if( key === '3'){
      dispatch({
        type:'deptMgrReport/getCAPEXDetails',
        searchData:{
          arg_ou:this.props.ou,
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          reportType:this.props.reportType,
        }
      });
    }
  };
  //tab页展示
  expandedRowRender = () => {
    const {monthlyDetailsData,monthlyDetailsDataOld,monthlyDetailsDataCAPEX} = this.props;
    return (
      <Tabs defaultActiveKey="1" onTabClick={this.queryData}>
        <TabPane tab='资金计划追加调整明细表' key="1">
          <Table
            columns={this.expandedRowColumns}
            dataSource={monthlyDetailsData}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab='以前年度应付款支出明细表' key="2">
          <Table
            columns={this.expandedRowColumnsOld}
            dataSource={monthlyDetailsDataOld}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab='capex现金支出明细表' key="3">
          <Table
            columns={this.expandedRowColumnsCAPEX}
            dataSource={monthlyDetailsDataCAPEX}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };
  //改变日期查询
  onChangeDatePicker=(date, dateString)=>{
    if (dateString!==''){
      let year = dateString.split("-")[0];
      let month = parseInt(dateString.split("-")[1]);
      let searchData={
        arg_ou:this.props.ou,
        arg_PlanYear:year,
        arg_PlanMonth:month,
        reportType:this.props.reportType,
      };
      const {dispatch}=this.props;
      dispatch({
        type:'deptMgrReport/query',
        searchData:searchData,
      });
    }
  };
  //改变状态查询
  onchangeStage=(value)=>{
    // this.setState({
    //   stage:value,
    // });
    let searchData={
      arg_ou:this.props.ou,
      arg_PlanYear:this.props.year,
      arg_PlanMonth:this.props.month,
      reportType:value,
    };
    const {dispatch}=this.props;
    dispatch({
      type:'deptMgrReport/query',
      searchData:searchData,
    });
  };
  //限定日期
  // disabledDate=(value)=>{
  //     const time =  moment();
  //     if(value){
  //       let lastDateValue =  time.valueOf();
  //       return value.valueOf() > lastDateValue
  //     }
  //   };
  //导出
  expExl =()=>{
    const {monthlyDetailsData} = this.props;
    if(monthlyDetailsData !== null && monthlyDetailsData.length !== 0){
      exportExlFundingPlanDetail(monthlyDetailsData,this.props.month+'月资金计划追加调整明细表')
    }else{
      message.info("表格数据为空！")
    }
  };
  //生成
  generateData=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'deptMgrReport/generateData',
      year:this.props.year,
      month:this.props.month,
      reportType:this.props.reportType,
    });
  };
  //撤销
  cancelData=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'deptMgrReport/cancelData',
      year:this.props.year,
      month:this.props.month,
      reportType:this.props.reportType,
    });
  };
  //导出
  expExlPublic=(key)=>{
    let tab=document.querySelector(`#table${key} table`);
    exportExl()(tab,key);
  };
  //导出弹出模态框
  showModal=()=>{
    this.setState({
      visible:true
    })
  };
  //取消模态框
  handleCancel=()=>{
    this.setState({
      visible:false
    })
  };
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  onExport = () =>{
    const { checkedList } = this.state;
    //let that = this;
    if(checkedList.length !== 0){
      for(let i = 0;i<checkedList.length;i++){
        if(checkedList[i] === '资金计划追加调整明细表'){
          this.expExl();
        }else {
          this.expExlPublic(checkedList[i]);
        }
      }
    }
    this.setState({
      visible : false,
      checkedList: defaultCheckedList,
      indeterminate: false,
      checkAll: false,
    })

  };
  render(){
    const {list,monthlyDetailsDataCAPEX,monthlyDetailsDataOld} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }
    if(monthlyDetailsDataCAPEX.length){
      monthlyDetailsDataCAPEX.map((i,index)=>{
        i.key=index;
      })
    }
    if(monthlyDetailsDataOld.length){
      monthlyDetailsDataOld.map((i,index)=>{
        i.key=index;
      })
    }
    //表格title
    let columns= [
      {
        title: '部门',
        dataIndex: 'dept_name',
        render:(text)=>{
          return(text.includes('-')?text.split('-')[1]:text)
        }
      },
      {
        title: '年月',
        dataIndex: 'time',
        render:()=>{
          return(<span>{this.props.year+'.'+this.props.month}</span>)
        }
      },
      {
        title: '实际报销金额',
        dataIndex: 'pay_amount',
      },
      {
        title: '资金计划',
        dataIndex: 'fee_amount',
      },
      {
        title: '调整后资金计划',
        dataIndex: 'adjusted_fee_amount',
      },
      {
        title: '完成比',
        dataIndex: 'complete_ratio',
        render:(text)=>{
          if (text !=='0.00'&&text !=='0.0' && text !== undefined){
            return (
              parseInt(text)>=95?<span style={{color:'green'}}>{text}</span>:<span style={{color:'red'}}>{text}</span>
            )
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render:(text,record)=>{
          return (
            <Button type="primary" onClick={()=>this.getDetail(record)}>查看团队</Button>
          )
        }
      },
    ];
    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <h2 style={{textAlign:'center',marginBottom:'10px'}}>资金计划报表</h2>
          <div>
            <span>{this.props.deptName}</span>
            <span style={{display:'inline-block',margin:'0 10px'}}>{'月份：'}
              <MonthPicker onChange={this.onChangeDatePicker} value={moment(this.props.year+'-'+this.props.month,'YYYY-MM')}/>
            </span>
            <span style={{display:'inline-block',margin:'0 10px'}}>{'填报阶段：'}
              <Select showSearch style={{ width: 160}}  value={this.props.reportType} onSelect={this.onchangeStage} >
                    <Option value="1">预填阶段</Option>
                    <Option value="2">调整阶段</Option>
              </Select>
            </span>
            <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} disabled = {this.props.isGenerate} onClick={this.generateData}>{'生成'}</Button>
            <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} disabled = {!this.props.isGenerate} onClick={this.cancelData}>{'撤销'}</Button>
            <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px',float:'right'}} disabled = {this.props.monthlyDetailsData.length !== 0 ? false : true} onClick={this.showModal}>{'导出'}</Button>
          </div>
          <div style={{overflow:'hidden'}}>
            <div style={{float:'left',color:'red'}}>{this.props.message}</div>
            <div style={{float:'right',color:'red'}}>金额单位：元</div>
          </div>
          <div style={{marginTop:'10px'}}>

                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={list}
                  defaultExpandAllRows={true}
                  className={styles.financeTable}
                  expandedRowRender={this.expandedRowRender}
                />

          </div>
          {/*<div id={'table资金计划追加调整明细表'} style={{display:'none'}} >*/}
            {/*<Table*/}
              {/*pagination={false}*/}
              {/*columns={this.expandedRowColumns}*/}
              {/*dataSource={this.props.monthlyDetailsData}*/}
              {/*className={styles.financeTable}*/}
            {/*/>*/}
          {/*</div>*/}
          <div id={'table以前年度应付款支出明细表'} style={{display:'none'}}>
            <Table
              pagination={false}
              columns={this.expandedRowColumnsOld}
              dataSource={this.props.monthlyDetailsDataOld}
              className={styles.financeTable}
            />
          </div>
          <div id={'tablecapex现金支出明细表'} style={{display:'none'}}>
            <Table
              pagination={false}
              columns={this.expandedRowColumnsCAPEX}
              dataSource={this.props.monthlyDetailsDataCAPEX}
              className={styles.financeTable}
            />
          </div>
          <Modal visible={this.state.visible}
                 onOk={this.onExport}
                 onCancel={this.handleCancel}
          >
            <div>
              <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全选
                </Checkbox>
              </div>
              <br />
              <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </div>
          </Modal>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.deptMgrReport,
    ...state.deptMgrReport
  };
}
export default connect(mapStateToProps)(DeptMgrReport);
