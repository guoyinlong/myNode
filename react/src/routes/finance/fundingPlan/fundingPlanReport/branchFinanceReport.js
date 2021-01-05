/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq416@chinaunicom.cn
 * 文件说明：分院资金计划报表
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Table, DatePicker, message, Tabs, Modal, Checkbox, Row, Col, Select,Spin } from 'antd';
import { routerRedux } from 'dva/router';
import { exportExlFundingPlanDetail } from './exportExlFundingPlanDetail'
import exportExl from '../../../../components/commonApp/exportExl'
import styles from '../fundingPlanReport.less'
import moment from 'moment';
const { MonthPicker } = DatePicker;
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
import Cookie from 'js-cookie';

class BranchFinanceReport extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false, //表头筛选下拉
      reportType:'1',
      visible: false,//是否显示modal
      checkedList:[],//导出列表
      indeterminate: false,//checkbox
      checkAll: false,
      disabled: false,//控制生产和撤销Button
    }
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：表头
   */
  columns= [
    {
      title: '组织单元',
      dataIndex: 'ou',
    },
    {
      title: '年月',
      dataIndex: 'plan_year_month',
    },
    {
      title: '实际报销金额',
      dataIndex: 'pay_amount',
    },
    {
      title: '资金计划',
      dataIndex: 'funding_money',
    },
    {
      title: '调整后资金计划',
      dataIndex: 'fee_adjest',
    },
    {
      title: '状态',
      dataIndex: 'flag_ou',
      render:(text)=>{
        return(text==='1'?<span>{'已生成'}</span>:<span>{'未生成'}</span>)
      }
    },
    {
      title: '完成比',
      dataIndex: 'com_ratio',
      render:(text)=>{
        if (text !=='-'){
          return (
            parseInt(text)>=95?<span style={{color:'green'}}>{text}%</span>:<span style={{color:'red'}}>{text}%</span>
          )
        }else{
          return(<span>{text}</span>)
        }
      }
    },
    {
      title:'操作',
      dataIndex:'operate',
      render:(text,record)=>{
        return(<Button style={{margin:'0 10px 10px 0'}} onClick={() => this.getDetail(record)} type="primary">查看</Button>)
      }
    },
  ]
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：跳转到查看部门详情页面
   */
  getDetail = (record)=> {
    const {dispatch,batchNum,reportType}=this.props;
    dispatch(routerRedux.push({
      pathname: 'financeApp/funding_plan/funding_plan_branch_finance_report/funding_plan_deptMgr_report_detail',
      query: {
        arg_ou:record.ou,
        arg_planMonth:parseInt(record.plan_year_month.split("-")[1]),
        arg_planYear:parseInt(record.plan_year_month.split("-")[0]),
        arg_report_type:reportType,
        arg_batch_number:batchNum,
        flag:'2',
        payload:JSON.stringify({
          arg_ou:record.ou,
          arg_planYear:parseInt(record.plan_year_month.split("-")[0]),
          arg_planMonth:parseInt(record.plan_year_month.split("-")[1]),
          arg_reportType:reportType,
        })
      }
    }));
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：五个报表的表头
   */
  expandedRowColumns1 = [
    { title: '项目', dataIndex: 'fee_name' },
    { title: '资金计划', dataIndex: 'funds_plan' },
    { title: '调整金额', dataIndex: 'funds_diff' },
    { title: '调整后资金计划', dataIndex: 'funds_current_amount' },
    { title: '各项金额来源说明', dataIndex: 'remarks' },
  ]
  expandedRowColumns4 = [
    { title: '付款分类', dataIndex: 'pay_type'},
    { title: '序号', dataIndex: 'rowno'},
    { title: '具体付款事项描述', dataIndex: 'pay_summary'},
    { title: '付款金额', dataIndex: 'pay_amount'},
  ]
  expandedRowColumns5 = [
    { title: '序号', dataIndex: 'rowno'},
    { title: '项目批复年度', dataIndex: 'proj_approval_year'},
    { title: '批复项目名称', dataIndex: 'approved_proj_name'},
    { title: '批复项目编号', dataIndex: 'approved_item_number'},
    { title: '项目总预算', dataIndex: 'total_proj_budget'},
    { title: '合同名称', dataIndex: 'contract_title'},
    { title: '合同总金额', dataIndex: 'contract_amount'},
    { title: '累计已支付金额', dataIndex: 'accumulated_amount_paid'},
    { title: '本月付款金额', dataIndex: 'payment_amount_this_month'},
  ]
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：显示五个报表详情
   */
  expandedRowRender = (record) => {
    const {addJectData,previousYears,queryOUCAPEX} = this.props;
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="资金计划追加调整明细表" key="1">
          <Table
            columns={this.expandedRowColumns1}
            className={styles.orderTable}
            dataSource={addJectData}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="以前年度应付款支出明细表" key="2">
          <Table
            columns={this.expandedRowColumns4}
            dataSource={previousYears}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="CAPEX现金支出明细表" key="3">
          <Table
            columns={this.expandedRowColumns5}
            dataSource={queryOUCAPEX}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：查询
   */
  straightQuery=(item)=>{
    console.log('query');
    const {dispatch}=this.props;
    dispatch({
      type:'branchFinanceReport/query',
      searchData:item,
    });
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：月份改变时，进行查询
   */
  onChangeDatePicker=(date, dateString)=>{
    if (dateString!==''){
      let year = dateString.split("-")[0];
      let month = parseInt(dateString.split("-")[1]);
      this.setState({
        year:year,
        month:month
      });
      let searchData={
        arg_ou:this.props.ou,
        arg_planYear:year,
        arg_planMonth:month,
        arg_reportType:this.props.reportType,
      }
      this.straightQuery(searchData);
    }
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：限制月份的选择
   */
  // disabledDate=(value)=>{
  //   const time =  new Date().toLocaleDateString();
  //   if(value){
  //     var lastDateValue =  moment(time).valueOf();
  //     return value.valueOf() >= lastDateValue
  //   }
  // }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：填报阶段选择
   */
  reportTypeHandleChange=(value)=>{
    let reportType='';
    //填报阶段：1：预填阶段；2：追加阶段
    if (value ==='预填阶段'){
      this.setState({reportType:'1'});
      reportType='1';
    } else if (value ==='调整阶段'){
      this.setState({reportType:'2'});
      reportType='2';
    }
    let searchData={
      arg_ou:this.props.ou,
      arg_planYear:this.props.year,
      arg_planMonth:this.props.month,
      arg_reportType:reportType,
    };
    this.straightQuery(searchData);
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：用公共组件导出数据
   */
  expExlPublic =(table)=>{
    let tab=document.querySelector(`#${table} table`);
    exportExl()(tab,table);
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：导出数据
   */
  expExl =()=>{
    const {addJectData} = this.props;
    if(addJectData !== null && addJectData.length !== 0){
      exportExlFundingPlanDetail(addJectData,this.props.month+'月资金计划追加调整明细表')
    }else{
      message.info("表格数据为空！")
    }
    console.log(this.state.checkedList);
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：生成数据
   */
  generateReportForm =()=>{
    const {dispatch}=this.props;
    let data = {
      arg_ou:this.props.ou,
      arg_report_type:this.props.reportType,
      arg_batch_number:this.props.batchNum,
      arg_planYear:this.props.year,
      arg_planMonth:this.props.month,
      arg_userid:Cookie.get('userid'),
      arg_deptid:Cookie.get('dept_id'),
    };
    dispatch({
      type:'branchFinanceReport/generateOU',
      data:data,
    });
  }
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：撤销数据
   */
  deleteReportForm =()=>{
    const {dispatch}=this.props;
    let data = {
      arg_ou:this.props.ou,
      arg_report_type:this.props.reportType,
      arg_batch_number:this.props.batchNum,
      arg_planYear:this.props.year,
      arg_planMonth:this.props.month,
    };
    dispatch({
      type:'branchFinanceReport/deleteReportForm',
      data:data,
    });
  }
  /*modal相关-start*/
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    const {checkedList} = this.state;
    if (checkedList.length!==0){
      for (let i=0;i<checkedList.length;i++){
        if (checkedList[i]==='资金计划追加调整明细表'){
          this.expExl();
        } else {
          this.expExlPublic(checkedList[i]);
        }
      }
    }
    this.setState({
      visible: false,
      checkedList:[],//导出列表
      indeterminate: false,//checkbox
      checkAll: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  /*modal相关-end*/
  /*checkbox相关-start*/
  plainOptions = ['资金计划追加调整明细表','以前年度应付款支出明细表', 'CAPEX现金支出明细表'];
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.plainOptions.length),
      checkAll: checkedList.length === this.plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  /*checkbox相关-end*/
  render(){
    const {list,generateState,reportType,addJectData,previousYears,queryOUCAPEX} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }

    let reportTypeValue;
    if (reportType==='1'){
      reportTypeValue='预填阶段';
    }else if (reportType==='2'){
      reportTypeValue='调整阶段';
    }
    const reportTypes = ['预填阶段','调整阶段'];

    return(
      <Spin tip='加载中' spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <h2 style={{textAlign:'center',marginBottom:'10px'}}>资金计划报表</h2>
          <span>OU:&nbsp;
            <Select style={{ width: 160}} value={this.props.ou}>
              <Option key={'1'} value={this.props.ou}>{this.props.ou}</Option>
            </Select>
          </span>&nbsp;&nbsp;
          <span>
            {'月份：'}
            <MonthPicker onChange={this.onChangeDatePicker} value={moment(this.props.year+'-'+this.props.month,'YYYY-MM')}/>
          </span>&nbsp;&nbsp;
          <span>填报阶段:&nbsp;
            <Select style={{ width: 160}} onSelect={value=>this.reportTypeHandleChange(value)} value={reportTypeValue}>
              {reportTypes.map((i,index)=><Option key={index} value={i}>{i}</Option>)}
            </Select>
          </span>&nbsp;&nbsp;
          <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} onClick={this.generateReportForm} disabled={generateState==='1'}>{'生成'}</Button>
          <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} onClick={this.deleteReportForm} disabled={generateState==='0'}>{'撤销'}</Button>
          <Button type="primary"  style={{marginRight:'10px',marginBottom:'10px'}} onClick={this.showModal} disabled={list.length === 0 || generateState==='0'}>{'导出'}</Button>
          <Modal
            title=""
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={'450px'}
          >
            <Row>
              <Col span={12}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}>
                  {'全选'}
                </Checkbox><br/>
                <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
              </Col>
            </Row>
          </Modal>
          {
            this.props.RetVal===''?<div>{}</div>:<div style={{marginBottom:10,color:'red'}}>{this.props.RetVal}</div>
          }
          <div style={{overflow:'hidden',marginBottom:'5px'}}>
            <div style={{float:'right',color:'red'}}>金额单位：元</div>
          </div>
          <Table
            pagination={false}
            columns={this.columns}
            dataSource={list}
            className={styles.financeTable}
            expandedRowRender={this.expandedRowRender}
          />

          <div id ='资金计划追加调整明细表' style={{display:'none'}}>
            <Table
              columns={this.expandedRowColumns1}
              dataSource={addJectData}
              className={styles.orderTable}
              pagination={false}
            />
          </div>
          <div id ='以前年度应付款支出明细表' style={{display:'none'}}>
            <Table
              columns={this.expandedRowColumns4}
              dataSource={previousYears}
              className={styles.orderTable}
              pagination={false}
            />
          </div>
          <div id ='CAPEX现金支出明细表' style={{display:'none'}}>
            <Table
              columns={this.expandedRowColumns5}
              dataSource={queryOUCAPEX}
              className={styles.orderTable}
              pagination={false}
            />
          </div>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.branchFinanceReport,
    ...state.branchFinanceReport
  };
}
export default connect(mapStateToProps)(BranchFinanceReport);
