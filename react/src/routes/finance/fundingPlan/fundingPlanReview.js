/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划审核
 */
import React from 'react';
import { connect } from 'dva';
import { Button,Table,Modal,Input,Spin,Icon,Popover } from 'antd';
import Style from '../../../components/employer/employer.less'
import tableStyle from '../../../components/finance/fundingPlanTable.less'
import Error from './errorPage/noDataFundingPlan';
const { TextArea } = Input;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
function change2Thousands (value) {
  if(value){
    return (parseFloat(value).toFixed(2)+'').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
  }else{
    return '-';
  }
}
function detailName(text,record,capexItemList ) {
  let detailName = [];
  if(capexItemList !== undefined){
    for(let k=0;k<capexItemList.length;k++){
      if(record.budgetId === capexItemList[k].budget_id){
          detailName.push(
            {
              projApprovalYear:capexItemList[k].proj_approval_year,
              approvedProjName:capexItemList[k].approved_proj_name,
              approvedItemNumber:capexItemList[k].approved_item_number,
              totalProjBudget:capexItemList[k].total_proj_budget,
              contractTitle:capexItemList[k].contract_title,
              contractAmount:capexItemList[k].contract_amount,
              contractAmountPaid:capexItemList[k].accumulated_amount_paid,
              paymentAmountMonth:capexItemList[k].payment_amount_this_month,
              key:k,
            }
          )
      }
    }
  }
  const columns = [
    {
    title: '项目批复年度',
    dataIndex: 'projApprovalYear',
    key: 'projApprovalYear',
    },
    {
    title: '批复项目名称',
    dataIndex: 'approvedProjName',
    key: 'approvedProjName',
    },
    {
    title: '批复项目编号',
    dataIndex: 'approvedItemNumber',
    key: 'approvedItemNumber',
    },
    {
    title: '项目总预算（元）',
    dataIndex: 'totalProjBudget',
    key: 'totalProjBudget',
    render:(text)=>change2Thousands(text)
    },
    {
    title: '合同名称',
    dataIndex: 'contractTitle',
    key: 'contractTitle',
    },
    {
    title: '合同总金额（元）',
    dataIndex: 'contractAmount',
    key: 'contractAmount',
    render:(text)=>change2Thousands(text)
    },
    {
    title: '累计已支付金额（元）',
    dataIndex: 'contractAmountPaid',
    key: 'contractAmountPaid',
    render:(text)=>change2Thousands(text)
    },
    {
    title: '本月付款金额（元）',
    dataIndex: 'paymentAmountMonth',
    key: 'paymentAmountMonth',
    render:(text)=>change2Thousands(text)
    }
  ];
  return(
    <div>
      <span>{text}</span>
      {
          text === '其他capex' || text === '资产购置'?
            <Popover placement="top"  title={text+'详情'} content ={<Table dataSource={detailName} columns={columns} className={tableStyle.financeTable} pagination={false}/>}>
              <Icon type="info-circle-o" style={{ marginLeft:10 }}/>
            </Popover>
            :
            []
      }
    </div>
  )
}
class fundingPlanReview extends React.Component{
  constructor(props){
    super(props);
  }
  state = {
    selectedRowKeys: [],
    selectedRows:{},
    visible:false,
    reason:'',
    yearMonth:''
  };
  //通过
  pass = () => {
    let that = this;
    this.props.dispatch({
      type:'fundingPlanReview/pass',
      selectedRows : that.state.selectedRows
    });
    this.setState({
      selectedRowKeys: [],
    });
  };
  showModal=()=>{
    this.setState({
      visible:true
    });
  };
  cancelModal=()=>{
    this.setState({
      visible:false
    })
  };
  //退回
  returnReason=()=>{
    let that = this;
    this.props.dispatch({
      type:'fundingPlanReview/returnCrl',
      selectedRows : that.state.selectedRows,
      ...this.state,
    });
    this.setState({
      selectedRowKeys: [],
      visible:false,
      reason:'',
    });
  };
  //编辑退回原因
  seasonHandle=(e)=>{
    this.setState({
      reason:e.target.value
    })
  };
  //选择某条记录
  onSelectChange = (selectedRowKeys,selectedRows) => {
    this.setState({ selectedRowKeys : selectedRowKeys,selectedRows:selectedRows });
  };

  pagination={
    //showQuickJumper:true,
    showSizeChanger:true,
  };
  //合并单元格
  MergeCells =(list)=>{
    let rowSpanNum = 1;
    let rowSpanArray = [];
    for(let i=1;i<list.length;i++){
      if(list[i].applyUserName !== list[i-1].applyUserName){
        rowSpanArray.push(rowSpanNum);
        rowSpanNum = 1;
      }else{
        rowSpanNum++;
        if(i===list.length-1 && list[i].applyUserName === list[i-1].applyUserName){
          rowSpanArray.push(rowSpanNum);
        }
      }
    }
    //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
    for(let i=1;i<list.length;i++){
      list[0].rowSpan = null;
      if(list[i].applyUserName === list[i-1].applyUserName){
        list[i].rowSpan = 0;
      }else{
        list[i].rowSpan = null;
      }
    }
    let j=0;
    for(let i=0;i<list.length;i++){
      if(list[i].rowSpan === null){
        list[i].rowSpan = rowSpanArray[j];
        j++;
      }
    }
  };
  MergeCellsDept=(list)=>{
    let rowSpanNum1 = 1;
    let rowSpanArray1 = [];
    for(let i=1;i<list.length;i++){
      if(list[i].deptName !== list[i-1].deptName){
        rowSpanArray1.push(rowSpanNum1);
        rowSpanNum1 = 1;
      }else{
        rowSpanNum1++;
        if(i===list.length-1 && list[i].deptName === list[i-1].deptName){
          rowSpanArray1.push(rowSpanNum1);
        }
      }
    }
    //部门小计与合计不加rowSpan，重复的加rowSpan=0，不重复的（第一个）加rowSpan=null。
    for(let i=1;i<list.length;i++){
      list[0].rowSpan1 = null;
      if(list[i].deptName === list[i-1].deptName){
        list[i].rowSpan1 = 0;
      }else{
        list[i].rowSpan1 = null;
      }
    }
    let j1=0;
    for(let i=0;i<list.length;i++){
      if(list[i].rowSpan1 === null){
        list[i].rowSpan1 = rowSpanArray1[j1];
        j1++;
      }
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { list } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    if(list.length){
      list.map((i,index)=>{
        i.key=index+'a';
      })
    }
    const hasSelected = selectedRowKeys.length > 0;
    this.MergeCells(this.props.list);
    this.MergeCellsDept(this.props.list);
    //let scroll =1200;
    const columns = [
      {
      title: '姓名',
      dataIndex: 'applyUserName',
      width:'100px',
      //fixed:'left',
      render: (text, record) => {return{children : <div>{record.applyUserName}</div>, props:{rowSpan:record.rowSpan}}},
    },
      {
      title: '部门',
      dataIndex: 'deptName',
      width:'150px',
      render: (text, record) => {return{children : <div>{record.deptName.includes('-')?record.deptName.split('-')[1]:record.deptName}</div>, props:{rowSpan:record.rowSpan1}}},
    },
      {
      title: '年月',
      dataIndex: 'yearMonth',
      width:'100px',
      render:(text,record)=>{ return(<div>{record.planYear+'.'+record.planMonth}</div>) }
    },
      {
      title: '科目',
      dataIndex: 'subjectName',
      width:'180px',
      render:(text,record)=>detailName(text,record,this.props.capexList)
    },
      {
      title: '金额（元）',
      dataIndex: 'fundsPlan',
      width:'180px',
    },
      {
        title: '合计（元）',
        dataIndex: 'personAll',
        width:'180px',
        render: (text, record) => {return{children : <div>{text}</div>, props:{rowSpan:record.rowSpan}}},
      },
      {
      title: '填报阶段',
      dataIndex: 'reportType',
      width:'150px',
      render:(text)=>{ return(text === '1'? '预填报资金计划':text === '2'?'调整资金计划':'追加资金计划') }
      },
      {
        title: '备注',
        dataIndex: 'remark',
        width:'150px',
      },
      {
      title: '是否以前年度',
      dataIndex: 'isPreYearFunds',
      width:'150px',
      render:(text)=>{ return(text ==='1'? '以前年度':'本月') }
      },
    ];
    if( this.props.fundStageData.report_type === '2' ){
      columns.push(
        {
          title: '填报方式',
          dataIndex: 'isModifyFlag',
          width:'150px',
          render:(text)=>{ return(text ==='1'? '追加':'新增') }
        }
      );
      //scroll = 1250 + 150;
    }
    return (
      <div>
        {
          this.props.isGenerate === '1' ?
            <Spin tip="加载中..." spinning={this.props.loading}>
              <div className={Style.wrap}>
                    <div style={{ marginBottom: 16 }}>
                      <Button type="primary" onClick={this.pass} disabled={!hasSelected}>通过</Button>
                      <span style={{ marginLeft: 8 }}>
                      <Button type="primary" onClick={this.showModal} disabled={!hasSelected}>退回</Button>
                    </span>
                      <span style={{ marginLeft: 8 }}>
                      {hasSelected ? `选中 ${selectedRowKeys.length} 条` : ''}
                    </span>
                      <p style={{float:'right',fontSize:'16px',marginTop:'5px'}}>{this.props.list.length !== 0?this.props.list[0].teamName:[]}</p>
                      {/*<div style={{textAlign:'right',color:'red',marginTop:'-20px',marginBottom:'5px'}}>金额单位：元</div>*/}
                    </div>
                    <Table
                      className={tableStyle.financeTable}
                      rowSelection={rowSelection}
                      columns={columns}
                      pagination={false}
                      dataSource={this.props.list}
                      />
                <Modal
                  title="退回原因"
                  visible={this.state.visible}
                  onCancel={this.cancelModal}
                  onOk={this.returnReason}
                >
                  <TextArea rows={4} value={this.state.reason} onChange={this.seasonHandle}/>
                </Modal>
                {
                  this.props.fundStageData.report_type === '2'?
                    <div style={{color: '#FA7252', fontStyle: 'italic', marginTop: 32}}>
                      <p>提示：</p>
                      <p>填报方式为追加，表示在原来的基础上调整的，并且金额中包含填报阶段审核通过的金额。</p>
                      <p>填报方式为新增，表示不是在原来的基础上调整的，并且金额中不存在填报阶段的金额。</p>
                    </div>
                    :
                    ''
                }
              </div>
            </Spin>
          :
            <div  className={Style.wrap} style={{minWidth: 700}}>
              <Error />
            </div>
        }
      </div>
    );
  }
}
function mapStateToProps (state) {

  return {
    loading: state.loading.models.fundingPlanReview,
    ...state.fundingPlanReview
  };
}
export default connect(mapStateToProps)(fundingPlanReview);
