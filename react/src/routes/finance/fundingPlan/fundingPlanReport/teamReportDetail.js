/**
 * 作者：张楠华
 * 日期：2018-4-8
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：查看部门团队报表
 */
import React from 'react';
import Style from '../../../../components/employer/employer.less'
import styles from '../fundingPlanReport.less'
import {connect} from 'dva';
import {Table,Tabs,Button,Spin,Modal,Row,Col,Checkbox,message } from 'antd';
import { routerRedux } from 'dva/router';
import exportExl from '../../../../components/commonApp/exportExl';
import { exportExlFundingPlanDetail } from './exportExlFundingPlanDetail';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;
class TeamReportDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      reportType:'1',
      checkedList:[],//导出列表
      indeterminate: false,//checkbox
      checkAll: false,
      disabled: false,//控制生产和撤销Button
      exportKey:'',
      team_name:'',
    }
  }
  //表格table
  columns= [
    {
      title: '团队名称',
      dataIndex: 'team_name',
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
      title: '操作',
      dataIndex: 'operate',
      width:'17%',
      render:(text,record)=>{
        return (
          <div>
            <Button type="primary"  size='small' onClick={()=>this.showModal(record)}>{'导出'}</Button>
          </div>
        )
      }
    }
  ];
  columnsForExl= [
    {
      title: '团队名称',
      dataIndex: 'team_name',
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
  columnsSum= [
    {
      title: '',
      dataIndex: '',
      width:'50px'
    },
    {
      title: '团队名称',
      dataIndex: 'team_name',
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
      title: '操作',
      dataIndex: 'operate',
      width:'17%',
      render:()=>{return (<div>-</div>)}
    }
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
  //点击tab页调服务
  queryData=(key,record)=>{
    const { dispatch } = this.props;
    if(key === '1'){
      dispatch({
        type:'teamReportDetail/getDeptMonthlyDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          teamId : record.team_id,
          reportType:this.props.reportType,
        }
      });
    } else if(key === '2'){
      dispatch({
        type:'teamReportDetail/getOldMonthDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          teamId : record.team_id,
          reportType:this.props.reportType,
        }
      });
    }else if( key === '3'){
      dispatch({
        type:'teamReportDetail/getCAPEXDetails',
        searchData:{
          arg_PlanYear:this.props.year,
          arg_PlanMonth:this.props.month,
          teamId : record.team_id,
          reportType:this.props.reportType,
        }
      });
    }
  };
  //表格内部三个tab页
  expandedRowRender = (record) => {
    let key = record.key;
    const {list} = this.props;
    return (
      <Tabs defaultActiveKey="1" onTabClick={key=>this.queryData(key,record)}>
        <TabPane tab='资金计划追加调整明细表' key="1">
          <Table
            columns={this.expandedRowColumns}
            dataSource={list[key].addDetailForm}
            className={styles.financeTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab='以前年度应付款支出明细表' key="2">
          <Table
            columns={this.expandedRowColumnsOld}
            dataSource={list[key].previousYears}
            className={styles.financeTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab='capex现金支出明细表' key="3">
          <Table
            columns={this.expandedRowColumnsCAPEX}
            dataSource={list[key].queryOUCAPEX}
            className={styles.financeTable}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };
  goBack = ()=>{
    const { dispatch,flag,queryBack }=this.props;
    if( flag === '1'){
      dispatch(routerRedux.push({
        pathname:'/financeApp/funding_plan/funding_plan_finance_report/funding_plan_deptMgr_report_detail',
        query:JSON.parse(queryBack)
      }));
    }else if( flag === '2'){
      dispatch(routerRedux.push({
        pathname:'/financeApp/funding_plan/funding_plan_branch_finance_report/funding_plan_deptMgr_report_detail',
        query:JSON.parse(queryBack)
      }));
    }else if( flag === '3'){
      dispatch(routerRedux.push({
        pathname:'/financeApp/funding_plan/funding_plan_deptMgr_report',
      }));
    }
  };
  goProjDetail=(expanded,record)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'teamReportDetail/getDeptMonthlyDetails',
      searchData:{
        arg_PlanYear:this.props.year,
        arg_PlanMonth:this.props.month,
        teamId : record.team_id,
        reportType:this.props.reportType,
      }
    });
  };
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：用公共组件导出数据
   */
  expExlPublic =(dept,table)=>{
    const title = dept+this.props.month+'月'+table;
    let tab=document.querySelector(`#${table} table`);
    exportExl()(tab,title);
  };
  /**
   * 作者：杨青
   * 创建日期：2018-03-14
   * 功能：导出数据
   */
  expExl =()=>{
    const {list} = this.props;
    let addJectData = this.state.exportKey===''?[]:list[this.state.exportKey].addDetailForm;
    if(addJectData !== null && addJectData.length !== 0){
      exportExlFundingPlanDetail(addJectData,this.state.team_name+this.props.month+'月资金计划追加调整明细表')
    }else{
      message.info("资金计划追加调整明细表表格数据为空！")
    }
  };
  /*modal相关-start*/
  showModal = (record) => {
    this.setState({
      exportKey:record.key,
      team_name:record.team_name,
    });
    this.queryData('1',record);
    this.queryData('2',record);
    this.queryData('3',record);
    this.props.dispatch({
      type:'teamReportDetail/changeModalVisible',
      flag:'open',
    });
  };
  handleOk = () => {
    const {checkedList} = this.state;
    if (checkedList.length!==0){
      for (let i=0;i<checkedList.length;i++){
        if (checkedList[i]==='资金计划追加调整明细表'){
          this.expExl();
        } else {
          this.expExlPublic(this.state.team_name,checkedList[i]);
        }
      }
    }
    this.handleCancel();
    this.setState({
      checkedList:[],//导出列表
      indeterminate: false,//checkbox
      checkAll: false,
    });

  };
  handleCancel = () => {
    this.props.dispatch({
      type:'teamReportDetail/changeModalVisible',
      flag:'close',
    });
  }
  /*modal相关-end*/
  /*checkbox相关-start*/
  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.props.plainOptions.length),
      checkAll: checkedList.length === this.props.plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.props.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  /*checkbox相关-end*/
  render() {
    const {list,visible,plainOptions,deptName} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    }
    return (
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <div style={{textAlign:'right',marginBottom:5}}>
            <Button type="primary"  style={{marginBottom:'10px',marginRight:'5px'}} onClick={()=>this.expExlPublic(deptName,'资金计划报表详情')}>{"导出"}</Button>
            <Button type="primary"  style={{marginBottom:'10px'}} onClick={this.goBack}>返回</Button>
          </div>
          <div style={{overflow:'hidden',marginBottom:'5px'}}>
            <div style={{float:'right',color:'red'}}>金额单位：元</div>
          </div>
          <div>
            <Table
              pagination={false}
              columns={this.columns}
              dataSource={list.filter(i=>i.team_name !=='合计')}
              className={styles.financeTable}
              expandedRowRender={this.expandedRowRender}
              loading={this.props.loading}
              onExpand={this.goProjDetail}
            />
            {
              list.filter(i=>i.team_name === '合计').length !== 0 ?
                <Table
                  pagination={false}
                  columns={this.columnsSum}
                  showHeader={false}
                  dataSource={list.filter(i=>i.team_name === '合计')}
                  className={styles.financeTable}
                />
                :
                null
            }
          </div>
          <Modal
            title=""
            visible={visible}
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
                <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
              </Col>
            </Row>
          </Modal>
          <div id ='资金计划报表详情' style={{display:'none'}}>
            <Table
              pagination={false}
              columns={this.columnsForExl}
              dataSource={list}
              className={styles.financeTable}
            />
          </div>
          {
            this.state.exportKey === ''?null:
              <div>
                <div id="资金计划追加调整明细表" style={{display:'none'}}>
                  <Table
                    columns={this.expandedRowColumns}
                    dataSource={list[this.state.exportKey].addDetailForm}
                    pagination={false}
                  />
                </div>
                <div id="以前年度应付款支出明细表" style={{display:'none'}}>
                  <Table
                    columns={this.expandedRowColumnsOld}
                    dataSource={list[this.state.exportKey].previousYears}
                    className={styles.orderTable}
                    pagination={false}
                  />
                </div>
                <div id="CAPEX现金支出明细表" style={{display:'none'}}>
                  <Table
                    columns={this.expandedRowColumnsCAPEX}
                    dataSource={list[this.state.exportKey].queryOUCAPEX}
                    className={styles.orderTable}
                    pagination={false}
                  />
                </div>
              </div>
          }
        </div>
      </Spin>
    );
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.teamReportDetail,
    ...state.teamReportDetail
  };
}
export default connect(mapStateToProps)(TeamReportDetail);
