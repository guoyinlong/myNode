/**
 * 作者：张楠华
 * 日期：2018-4-3
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：小组管理员报表
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Table,  DatePicker,Spin,Tabs,Modal,Checkbox } from 'antd';
import { exportExlFundingPlanDetail } from './exportExlFundingPlanDetail'
import exportExl from '../../../../components/commonApp/exportExl';
import styles from '../fundingPlanReport.less'
const { MonthPicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
import moment from 'moment';
const plainOptions = ['资金计划追加调整明细表', '以前年度应付款支出明细表', 'capex现金支出明细表'];
const defaultCheckedList = [];
class TeamReport extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      visible : false,
      checkedList: defaultCheckedList,
      indeterminate: false,
      checkAll: false,
    }
  }
  //表格title
  columns= [
    {
      title: '部门',
      dataIndex: 'dept_name',
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
  ];
  //每部表格title
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

  queryData=(key)=>{
    const { dispatch } = this.props;
    if(key === '1'){
      dispatch({
        type:'teamReport/getDeptMonthlyDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          team_id : this.props.team_id,
          department : this.props.department,
          deptid : this.props.deptid,
        }
      });
    } else if(key === '2'){
      dispatch({
        type:'teamReport/getOldMonthDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          team_id : this.props.team_id,
          department : this.props.department,
          deptid : this.props.deptid,
        }
      });
    }else if( key === '3'){
      dispatch({
        type:'teamReport/getCAPEXDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          team_id : this.props.team_id,
          department : this.props.department,
          deptid : this.props.deptid,
        }
      });
    }
  };
  expandedRowRender = () => {
    const {monthlyDetailsData} = this.props;
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
            dataSource={this.props.monthlyDetailsDataOld}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab='capex现金支出明细表' key="3">
          <Table
            columns={this.expandedRowColumnsCAPEX}
            dataSource={this.props.monthlyDetailsDataCAPEX}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };
  onChangeDatePicker=(date, dateString)=>{
    if (dateString){
      let year = dateString.split("-")[0];
      let month = parseInt(dateString.split("-")[1]);
      this.setState({
        year:year,
        month:month
      });
      let searchData={
        arg_ou:this.props.ou,
        arg_PlanYear:year,
        arg_PlanMonth:month,
        team_id : this.props.team_id,
        department : this.props.department,
        deptid : this.props.deptid,
      };
      const {dispatch}=this.props;
      dispatch({
        type:'teamReport/query',
        searchData:searchData,
      });
    }
  };
  // disabledDate=(value)=>{
  //   const time =  moment();
  //   if(value){
  //     let lastDateValue =  time.valueOf();
  //     return value.valueOf() > lastDateValue
  //   }
  // };
  //导出月资金计划追加调整明细表
  expExl =()=>{
    const {monthlyDetailsData} = this.props;
    if(monthlyDetailsData !== null && monthlyDetailsData.length !== 0){
      exportExlFundingPlanDetail(monthlyDetailsData,this.props.month+'月资金计划追加调整明细表')
    }else{
      message.info("表格数据为空！")
    }
  };
  //导出
  expExlPublic=(key)=>{
    let tab=document.querySelector(`#table${key} table`);
    exportExl()(tab,key);
  };
  showModal=()=>{
    this.setState({
      visible:true
    })
  };
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
    let that = this;
    for(let i = 0;i<checkedList.length;i++){
      if(checkedList[i] === '资金计划追加调整明细表'){
        this.expExl();
      }else {
        that.expExlPublic(checkedList[i]);
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
    const {list,monthlyDetailsDataCAPEX,monthlyDetailsDataOld,monthlyDetailsData} = this.props;
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
    if(monthlyDetailsData.length){
      monthlyDetailsData.map((i,index)=>{
        i.key=index;
      })
    }
    return(
      <Spin tip="加载中..." spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <h2 style={{textAlign:'center',marginBottom:'10px'}}>资金计划报表</h2>
          <div>
            <span>{this.props.deptName}</span>
            <span style={{display:'inline-block',margin:'0 20px'}}>
              {'月份：'}<MonthPicker onChange={this.onChangeDatePicker} value={moment(this.props.year+'-'+this.props.month,'YYYY-MM')}/>
            </span>
            <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} onClick={this.showModal} disabled={list.length === 0}>{'导出'}</Button>
            <div style={{overflow:'hidden',marginBottom:'5px'}}>
              <div style={{float:'left',color:'red'}}>{this.props.message}</div>
              <div style={{float:'right',color:'red'}}>金额单位：元</div>
            </div>
          </div>
          <div>
                <Table
                  pagination={false}
                  columns={this.columns}
                  dataSource={list}
                  className={styles.financeTable}
                  defaultExpandAllRows = {true}
                  expandedRowRender={this.expandedRowRender}
                />
          </div>
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
    loading: state.loading.models.teamReport,
    ...state.teamReport
  };
}
export default connect(mapStateToProps)(TeamReport);
