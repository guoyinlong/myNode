/**
 * 作者：杨青
 * 日期：2018-3-6
 * 邮箱：yangq416@chinaunicom.cn
 * 文件说明：小组资金计划报表
 */
import React from 'react';
import {connect } from 'dva';
import {Button,Table,Tabs, Spin,Modal,Row,Col,Checkbox,message} from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../fundingPlanReport.less'
import Cookie from 'js-cookie';
import exportExl from '../../../../components/commonApp/exportExl';
import { exportExlFundingPlanDetail } from './exportExlFundingPlanDetail';
const TabPane = Tabs.TabPane;
const CheckboxGroup = Checkbox.Group;

class DeptMgrReportDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      reportType:'1',
      checkedList:[],//导出列表
      indeterminate: false,//checkbox
      checkAll: false,
      disabled: false,//控制生产和撤销Button
      exportKey:'',
      deptname:'',
    }
  }
  deptColumns= [
    {
      title: '时间',
      dataIndex: 'plan_year_month',
      width:'9%'
    },
    {
      title: '部门',
      dataIndex: 'deptname',
      key: 'deptname',
      width:'16%'
    },
    {
      title: '实际报销金额',
      dataIndex: 'pay_amount',
      key: 'pay_amount',
      width:'14%'
    },
    {
      title: '资金计划',
      dataIndex: 'fee_money',
      width:'14%'
    },
    {
      title: '调整后资金计划',
      dataIndex: 'fee_amount',
      width:'14%'
    },
    {
      title: '完成比',
      dataIndex: 'com_ratio',
      width:'8%',
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
      title: '状态',
      dataIndex: 'flag_dept',
      width:'8%',
      render:(text)=>{
        return(text==='1'?<span>{'已生成'}</span>:<span>{'未生成'}</span>)
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width:'17%',
      render:(text,record)=>{
        return (
          <div>
            <Button type="primary"  size='small' onClick={()=>this.getDetail(record)}>{'查看团队'}</Button>&nbsp;&nbsp;
            <Button type="primary"  size='small' onClick={()=>this.showModal(record)} disabled={record.flag_dept!=='1'}>{'导出'}</Button>
          </div>
        )
      }
    }
  ];
  deptColumnsForExpExl= [
    {
      title: '时间',
      dataIndex: 'plan_year_month',
    },
    {
      title: '部门',
      dataIndex: 'deptname',
      key: 'deptname'
    },
    {
      title: '实际报销金额',
      dataIndex: 'pay_amount',
      key: 'pay_amount'
    },
    {
      title: '资金计划',
      dataIndex: 'fee_money',
    },
    {
      title: '调整后资金计划',
      dataIndex: 'fee_amount',
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
      title: '状态',
      dataIndex: 'flag_dept',
      render:(text)=>{
        return(text==='1'?<span>{'已生成'}</span>:<span>{'未生成'}</span>)
      }
    },
  ];
  deptColumnsSum= [
    {
      title: '',
      dataIndex: '',
      width:'50px'
    },
    {
      title: '时间',
      dataIndex: 'plan_year_month',
      key: 'plan_year_month',
      width:'9%'

    },
    {
      title: '部门',
      dataIndex: 'deptname',
      key: 'deptname',
      width:'16%'
    },
    {
      title: '实际报销金额',
      dataIndex: 'pay_amount',
      key: 'pay_amount',
      width:'14%'
    },
    {
      title: '资金计划',
      dataIndex: 'fee_money',
      width:'14%'
    },
    {
      title: '调整后资金计划',
      dataIndex: 'fee_amount',
      width:'14%'
    },
    {
      title: '完成比',
      dataIndex: 'com_ratio',
      width:'8%',
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
      title: '状态',
      dataIndex: '',
      key:'state',
      width:'8%',
      render:()=>{return(<div>-</div>)}
    },
    {
      title: '操作',
      dataIndex: '',
      width:'17%',
      key:'opt',
      render:()=>{return (<div>-</div>)}
    }
  ];
  // projColumns= [
  //   {
  //     title: '序号',
  //     dataIndex: 'key',
  //   },
  //   {
  //     title: '时间',
  //     dataIndex: 'time',
  //     render:(text)=>{
  //       return(<span>{this.props.year+'.'+this.props.month}</span>)
  //     }
  //   },
  //   {
  //     title: '项目',
  //     dataIndex: '',
  //     key: 'time'
  //   },
  //   {
  //     title: '金额',
  //     dataIndex: 'funding',
  //     key: 'funding'
  //   },
  //   {
  //     title: '资金计划',
  //     dataIndex: 'fundingPlan',
  //     key: 'fundingPlan'
  //   },
  //   {
  //     title: '资金计划调整',
  //     dataIndex: 'fundingPlanAdjust',
  //     key: 'fundingPlanAdjust'
  //   },
  //   {
  //     title: '完成比',
  //     dataIndex: 'percent',
  //     render:(text)=>{
  //       return (
  //         parseInt(text)>=95?<span style={{color:'red'}}>{text}%</span>:<span style={{color:'green'}}>{text}%</span>
  //       )
  //     }
  //   },
  // ]
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
  goBack = ()=> {
    const {dispatch,queryData}=this.props;
    let url ='';
    if (queryData.url){
      url = 'financeApp/funding_plan/funding_plan_finance_report/'+queryData.url;
      queryData.arg_ou='联通软件研究院';
    }else{
      url = 'financeApp/funding_plan/funding_plan_finance_report';
    }
    dispatch(routerRedux.push({
      pathname: this.props.financeOrNot?url: 'financeApp/funding_plan/funding_plan_branch_finance_report',
      query:queryData
    }));
  };
  //点击查看团队跳转
  getDetail = (record)=> {
    const { dispatch }=this.props;
    dispatch(routerRedux.push({
      pathname:Cookie.get('OU') === '联通软件研究院本部'?
        '/financeApp/funding_plan/funding_plan_finance_report/funding_plan_dept_report/funding_plan_team_report_detail'
        :
        '/financeApp/funding_plan/funding_plan_branch_finance_report/funding_plan_dept_report/funding_plan_team_report_detail',
      query: {
        ou:this.props.queryOU,
        month:record.plan_year_month.split('-')[1],
        year:record.plan_year_month.split('-')[0],
        reportType:this.props.query.arg_report_type,
        deptName:record.deptname,
        deptId:record.deptid,
        flag:this.props.query.flag, //flag 为1代表返回到总院财务。flag为2，标识返回的分院财务报表
        queryBack:JSON.stringify(this.props.query)
      },
    }));
  };
  //点击tab页切换
  queryData=(key,record)=>{
    const { dispatch } = this.props;
    if(key === '1'){
      dispatch({
        type:'deptMgrReportDetail/getDeptMonthlyDetails',
        searchData:{
          arg_total_year:this.props.year,
          arg_total_month:this.props.month,
          arg_user_id:Cookie.get('userid'),
          arg_ou:this.props.queryOU,
          arg_dept_name:record.deptname,
          arg_dept_id:record.deptid,
        }
      });
    } else if(key === '4'){
      dispatch({
        type:'deptMgrReportDetail/getOldMonthDetails',
        searchData:{
          arg_total_year:this.props.year,
          arg_total_month:this.props.month,
          arg_user_id:Cookie.get('userid'),
          arg_ou:this.props.queryOU,
          arg_dept_name:record.deptname,
          arg_dept_id:record.deptid,
        }
      });
    }else if( key === '5'){
      dispatch({
        type:'deptMgrReportDetail/getCAPEXDetails',
        searchData:{
          arg_total_year:this.props.year,
          arg_total_month:this.props.month,
          arg_user_id:Cookie.get('userid'),
          arg_ou:this.props.queryOU,
          arg_dept_name:record.deptname,
          arg_dept_id:record.deptid,
        }
      });
    }
  };


  expandedRowRender = (record) => {
    let key = record.key;
    const {list}=this.props;
    return (
      <Tabs defaultActiveKey="1" onTabClick={key=>this.queryData(key,record)}>
        <TabPane tab="资金计划追加调整明细表" key="1">
          <div id ='expanded1'>
            <Table
              columns={this.expandedRowColumns}
              dataSource={list[key].addDetailForm}
              pagination={false}
            />
          </div>
        </TabPane>
        <TabPane tab="以前年度应付款支出明细表" key="4">
          <Table
            columns={this.expandedRowColumnsOld}
            dataSource={list[key].previousYears}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
        <TabPane tab="CAPEX现金支出明细表" key="5">
          <Table
            columns={this.expandedRowColumnsCAPEX}
            dataSource={list[key].queryOUCAPEX}
            className={styles.orderTable}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    );
  };
  goProjDetail=(expanded,record)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'deptMgrReportDetail/getDeptMonthlyDetails',
      searchData:{
        arg_total_year:this.props.year,
        arg_total_month:this.props.month,
        arg_user_id:Cookie.get('userid'),
        arg_ou:this.props.queryOU,
        arg_dept_name:record.deptname,
        arg_dept_id:record.deptid,
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
      exportExlFundingPlanDetail(addJectData,this.state.deptname+this.props.month+'月资金计划追加调整明细表')
    }else{
      message.info("资金计划追加调整明细表表格数据为空！")
    }
  };
  /*modal相关-start*/
  showModal = (record) => {
    this.setState({
      exportKey:record.key,
      deptname:record.deptname,
    });
    this.queryData('1',record);
    this.queryData('4',record);
    this.queryData('5',record);
    this.props.dispatch({
      type:'deptMgrReportDetail/changeModalVisible',
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
          this.expExlPublic(this.state.deptname,checkedList[i]);
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
      type:'deptMgrReportDetail/changeModalVisible',
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
  render(){
    const {list, visible, plainOptions,queryOU} = this.props;
    // 这里为每一条记录添加一个key，从0开始
    if(list.length){
      list.map((i,index)=>{
        i.key=index;
      })
    };

    return(
      <Spin tip="Loading..." spinning={this.props.loading}>
        <div style={{background:'white',padding:'10px 10px 10px 10px'}}>
          <div style={{textAlign:'right',marginBottom:5}}>
            <Button type="primary"  style={{marginBottom:'10px',marginRight:'5px'}} onClick={()=>this.expExlPublic(queryOU,'资金计划报表详情')}>{"导出"}</Button>
            <Button type="primary"  style={{marginBottom:'10px'}} onClick={this.goBack}>返回</Button>
          </div>
          <div style={{textAlign:'right',color:'red',marginBottom:'-20px'}}>金额单位：元</div>

          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab="部门" key="1">
              <Table
                pagination={false}
                columns={this.deptColumns}
                dataSource={list.filter(i=>i.deptname !=='合计')}
                className={styles.financeTable}
                expandedRowRender={this.expandedRowRender}
                onExpand={this.goProjDetail}
              />
              {
                list.filter(i=>i.deptname === '合计').length !== 0 ?
                  <Table
                    pagination={false}
                    columns={this.deptColumnsSum}
                    showHeader={false}
                    dataSource={list.filter(i=>i.deptname === '合计')}
                    className={styles.financeTable}
                  />
                  :
                  null
              }
            </TabPane>
            {/*<TabPane tab="项目" key="2">
            <Table
              pagination={this.pagination}
              columns={this.projColumns}
              dataSource={list}
              className={styles.orderTable}
              expandedRowRender={this.expandedRowRender}
            />
          </TabPane>*/}
          </Tabs>
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
              columns={this.deptColumnsForExpExl}
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
    )
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.deptMgrReportDetail,
    ...state.deptMgrReportDetail
  };
}
export default connect(mapStateToProps)(DeptMgrReportDetail);
