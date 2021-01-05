/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划个人查询
 */
import React from 'react';
import {connect } from 'dva';
import {detailName} from '../../../../../components/finance/detailName'
import {MoneyComponent} from '../../../../../components/finance/FormatData'
import {stateCodeFill,renderContent,renderContentMoney} from '../../common'
import {Tabs, Spin, DatePicker, Select, Table, Button, TreeSelect,Input,Modal,Radio} from 'antd'
import tableStyle from '../../../../../components/finance/table.less'
const {MonthPicker} = DatePicker;
const Option = Select.Option;
import styles from '../../query.less'
const { TabPane } = Tabs;
import moment from 'moment';
import exportExl from '../../../../../components/commonApp/exportExl';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class DeptMgrFundingPlanQuery extends React.Component{
  state = { visible1: false,visible2: false };
  queryData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundingPlanQuery/query',
    });
  };
  queryDataOld = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundingPlanQuery/queryOld',
    });
  };
  clearQuery = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundingPlanQuery/clearQuery',
    });
  };
  clearQueryOld = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundingPlanQuery/clearQueryOld',
    });
  };
  callback = (key) => {
    const {dispatch} = this.props;
    if (key === '1') {
      dispatch({
        type: 'fundingPlanQuery/query',
      });
    } else if (key === '2') {
      dispatch({
        type: 'fundingPlanQuery/queryOld',
      });
    }
  };
  changeState = (...arg) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'fundingPlanQuery/changeState',
      arg,
    })
  };
  showModal = (flag) => {
    this.setState({
      ['visible'+flag]: true,
      type:'1',
      typeOld:'1'
    });
  };
  handleOk = (flag) => {
    this.setState({
      ['visible'+flag]: false,
    });
    let { type,typeOld } = this.state;
    if(flag === '1' && type === '1'){
      let tab=document.querySelector(`#table1 table`);
      exportExl()(tab,'月份资金计划');
      return;
    }
    if(flag === '1' && type === '2'){
      let tabs=document.querySelector(`#table3 table`);
      exportExl()(tabs,'capex详情');
      return;
    }
    if(flag === '2' && typeOld === '1'){
      let tab=document.querySelector(`#table2 table`);
      exportExl()(tab,'以前年度应付款');
      return;
    }
    if(flag === '2' && typeOld === '2'){
      let tabs=document.querySelector(`#table4 table`);
      exportExl()(tabs,'capex详情');
    }
  };
  handleCancel = (flag) => {
    this.setState({
      ['visible'+flag]: false,
    })
  };
  render(){
    let columnsCapex = [
      {
        title: '项目批复年度',
        dataIndex: 'proj_approval_year',
        width:'8%',
      },
      {
        title: '批复项目名称',
        dataIndex: 'approved_proj_name',
        width:'8%',
      },
      {
        title: '批复项目编号',
        dataIndex: 'approved_item_number',
        width:'8%',
      },
      {
        title: '项目总预算',
        dataIndex: 'total_proj_budget',
        width:'8%',
      },
      {
        title: '合同名称',
        dataIndex: 'contract_title',
        width:'8%',
      },
      {
        title: '合同总金额',
        dataIndex: 'contract_amount',
        width:'8%',
      },
      {
        title: '累计已支付金额',
        dataIndex: 'accumulated_amount_paid',
        width:'8%',
      },
      {
        title: '本月付款金额',
        dataIndex: 'payment_amount_this_month',
        width:'8%',
      },
      {
        title: '填报状态',
        dataIndex: 'fill_state_code',
        width:'8%',
        render:(text)=>{
          return(
            <div>
              {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
            </div>
          )
        }
      },
      {
        title: '本月调整后付款金额',
        dataIndex: 'adjust_payment_amount_this_month',
        width:'8%',
      },
      {
        title: '调整阶段状态',
        dataIndex: 'adjust_state_code',
        width:'8%',
        render:(text)=>{
          return(
            <div>
              {text ==='0'?'新增':text ==='1'?'保存':text==='2'?'待审核':text==='3'?'审核通过':text ==='4'?'退回':'-'}
            </div>
          )
        }
      },
    ];
    let column = [
      {
        title:'序号',
        width:'100px',
        fixed:'left',
        dataIndex:'index_num'
      },
      {
        title:'年度',
        width:'100px',
        fixed:'left',
        dataIndex:'plan_year'
      },
      {
        title:'月份',
        width:'100px',
        fixed:'left',
        dataIndex:'plan_month',
      },
      {
        title:'小组名称',
        width:'200px',
        fixed:'left',
        dataIndex:'team_name',
        render: (text) => {return(<div style={{textAlign:'left'}}>{text}</div>)},
      },
      {
        title:'姓名',
        width:'100px',
        fixed:'left',
        dataIndex:'apply_username'
      },
      {
        title:'资金类型',
        dataIndex:'funds_type',
        width:'150px',
        render: (text) => {return(text ?(text ==='1'?'个人':text==='2'?'公共':'他购'):'')},
      },
      {
        title:'科目名称',
        dataIndex:"subject_name",
        width:'200px',
        render:(text,record)=>detailName(text,record.childRows)
      },
      {
        title:'资金计划（元）',
        dataIndex:"funds_plan",
        width:'150px',
        //render : text =>MoneyComponent(text)
        render : renderContent,
      },
      {
        title:'填报状态',
        dataIndex:"fill_state_code",
        width:'150px',
        render:(text,record)=>stateCodeFill(text,record)
      },
      {
        title:'填报阶段备注',
        dataIndex:"remark1",
        render : renderContent,
      },
      // {
      //   title:'资金计划调整',
      //   dataIndex:"fundsAdjust",
      //   width:'130px',
      //   //render : text =>MoneyComponent(text)
      // },
      {
        title:'调整后资金计划（元）',
        dataIndex:"funds_current_amount",
        width:'200px',
        render : renderContentMoney,
        //render : text =>MoneyComponent(text)
      },
      {
        title:'调整阶段状态',
        dataIndex:"adjust_state_code",
        width:'150px',
        render:(text,record)=>stateCodeFill(text,record)
      },
      {
        title:'调整阶段备注',
        dataIndex:"remark2",
        render : renderContent,
      },
    ];
    let columnOld = [
      {
        title:'序号',
        width:'100px',
        fixed:'left',
        dataIndex:'index_num'
      },
      {
        title:'年度',
        width:'100px',
        fixed:'left',
        dataIndex:'plan_year'
      },
      {
        title:'月份',
        width:'100px',
        fixed:'left',
        dataIndex:'plan_month',
      },
      {
        title:'小组名称',
        width:'200px',
        fixed:'left',
        dataIndex:'team_name',
        render: (text) => {return(<div style={{textAlign:'left'}}>{text}</div>)},
      },
      {
        title:'姓名',
        width:'100px',
        fixed:'left',
        dataIndex:'apply_username'
      },
      {
        title:'资金类型',
        dataIndex:'funds_type',
        width:'150px',
        render: (text) => {return(text ?(text ==='1'?'个人':text==='2'?'公共':'他购'):'')},
      },
      {
        title:'科目名称',
        dataIndex:"subject_name",
        width:'200px',
        render:(text,record)=>detailName(text,record.childRows)
      },
      {
        title:'具体付款事项描述',
        dataIndex:"spe_pay_description",
        width:'200px',
      },
      {
        title:'资金计划（元）',
        dataIndex:"funds_plan",
        width:'150px',
        render : renderContent,
        //render : text =>MoneyComponent(text)
      },
      {
        title:'填报状态',
        dataIndex:"fill_state_code",
        width:'150px',
        render:(text,record)=>stateCodeFill(text,record)
      },
      {
        title:'填报阶段备注',
        dataIndex:"remark1",
        width:'150px',
        render : renderContent,
      },
      // {
      //   title:'资金计划调整',
      //   dataIndex:"fundsAdjust",
      //   width:'130px',
      //   //render : text =>MoneyComponent(text)
      // },
      {
        title:'调整后资金计划（元）',
        dataIndex:"funds_current_amount",
        width:'200px',
        render : renderContentMoney,
        //render : text =>MoneyComponent(text)
      },
      {
        title:'调整阶段状态',
        dataIndex:"adjust_state_code",
        width:'150px',
        render:(text,record)=>stateCodeFill(text,record)
      },
      {
        title:'调整阶段备注',
        dataIndex:"remark2",
        render : renderContent,
      },
    ];
    let {loading, list,oldList, feeList, teamList,beginPlanTime, endPlanTime, feeName, planType, beginPlanTimeOld, endPlanTimeOld, feeNameOld, planTypeOld,applyUser,applyUserOld,team,teamOld} = this.props;
    return (
      <Spin tip="加载中..." spinning={loading}>
        <div className={styles.wrap}>
          <Tabs defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab='月份资金计划' key="1">
              <div className={styles.title}>
                <div>
                  开始时间：
                  <MonthPicker onChange={(value) => this.changeState(value, 'beginPlanTime')} value={beginPlanTime}/>
                </div>
                <div>
                  结束时间：
                  <MonthPicker onChange={(value) => this.changeState(value, 'endPlanTime')} value={endPlanTime}/>
                </div>
                <div>
                  小组名称：
                  <Select onChange={(value) => this.changeState(value, 'team')} style={{width: '200px'}}
                          value={team}>
                    {teamList.map((i,index)=><Option key={index} value={i.id}>{i.team_name}</Option>)}
                  </Select>
                </div>
                <div>
                  姓名：
                  {/*<Select onChange={(value) => this.changeState(value, 'applyUser')} style={{width: '100px'}}*/}
                          {/*value={applyUser}>*/}
                    {/*{canApplyUserList.map((i)=> <Option key={i.apply_userid}>{i.apply_username}</Option>)}*/}
                  {/*</Select>*/}
                  <Input onChange={(e) => this.changeState(e.target.value, 'applyUser')} style={{width: '100px'}} value={applyUser}/>
                </div>
                <div>
                  资金类型：
                  <Select onChange={(value) => this.changeState(value, 'planType')} style={{width: '100px'}}
                          value={planType}>
                    <Option key="1">个人</Option>
                    <Option key="2">公共</Option>
                    <Option key="3">他购</Option>
                  </Select>
                </div>
                <div>
                  科目名称：
                  <TreeSelect
                    value={feeName}
                    treeData={feeList}
                    style={{width: 200}}
                    onChange={(value) => this.changeState(value, 'feeName')}
                  />
                </div>
              </div>
              <div style={{textAlign: 'right', margin: '5px 0'}}>
                <Button onClick={this.queryData} type="primary">查询</Button>&nbsp;&nbsp;
                <Button onClick={this.clearQuery} type="primary">重置</Button>&nbsp;&nbsp;
                <Button onClick={()=>this.showModal('1')} type="primary">导出</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={column} dataSource={list} scroll={{x: 1900}}/>
                <div id="table1" style={{display:"none"}}>
                  <Table rowKey='index_num' columns={column} dataSource={list} pagination={false}/>
                </div>
                <div id="table3" style={{display:"none"}}>
                  <Table rowKey='uuid' columns={columnsCapex}
                         dataSource={
                           function (list=[]) {
                             let res = [];
                             for(let i=0;i<list.length;i++){
                               if(list[i].hasOwnProperty('childRows') && list[i].childRows){
                                 res = res.concat(JSON.parse(list[i].childRows))
                               }
                             }
                             return res;
                           }(list)
                         } pagination={false}/>
                </div>
              </div>
              <Modal
                title="导出"
                visible={this.state.visible1}
                onOk={()=>this.handleOk('1')}
                onCancel={()=>this.handleCancel('1')}
              >
                <Radio.Group onChange={(e)=>this.setState({type:e.target.value})} value={this.state.type}>
                  <Radio value={'1'}>月资金计划</Radio>
                  <Radio value={'2'}>其他capex</Radio>
                </Radio.Group>
              </Modal>
            </TabPane>
            <TabPane tab='以前年度应付款' key="2">
              <div className={styles.title}>
                <div>
                  开始时间：
                  <MonthPicker onChange={(value) => this.changeState(value, 'beginPlanTimeOld')}
                               value={beginPlanTimeOld}/>
                </div>
                <div>
                  结束时间：
                  <MonthPicker onChange={(value) => this.changeState(value, 'endPlanTimeOld')} value={endPlanTimeOld}/>
                </div>
                <div>
                  小组名称：
                  <Select onChange={(value) => this.changeState(value, 'teamOld')} style={{width: '200px'}}
                          value={teamOld}>
                    {teamList.map((i,index)=><Option key={index} value={i.id}>{i.team_name}</Option>)}
                  </Select>
                </div>
                <div>
                  姓名：
                  <Input onChange={(e) => this.changeState(e.target.value, 'applyUserOld')} style={{width: '100px'}} value={applyUserOld}/>
                </div>
                <div>
                  资金类型：
                  <Select onChange={(value) => this.changeState(value, 'planTypeOld')} style={{width: '150px'}} value={planTypeOld}>
                    <Option key="1">个人</Option>
                    <Option key="2">公共</Option>
                    <Option key="3">他购</Option>
                  </Select>
                </div>
                <div>
                  科目名称：
                  <TreeSelect
                    value={feeNameOld}
                    treeData={feeList}
                    style={{width: 200}}
                    onChange={(value) => this.changeState(value, 'feeNameOld')}
                  />
                </div>
              </div>
              <div style={{textAlign: 'right', margin: '5px 0'}}>
                <Button onClick={this.queryDataOld} type="primary">查询</Button>&nbsp;&nbsp;
                <Button onClick={this.clearQueryOld} type="primary">重置</Button>&nbsp;&nbsp;
                <Button onClick={()=>this.showModal('2')} type="primary">导出</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={columnOld} dataSource={oldList} scroll={{x: 2100}}/>
                <div id="table2" style={{display:"none"}}>
                  <Table rowKey='index_num' columns={columnOld} dataSource={oldList} pagination={false}/>
                </div>
                <div id="table4" style={{display:"none"}}>
                  <Table rowKey='uuid' columns={columnsCapex}
                   dataSource={
                     function (oldList = []) {
                       let res = [];
                       for(let i=0;i<oldList.length;i++){
                         if(oldList[i].hasOwnProperty('childRows') && oldList[i].childRows){
                           res = res.concat(JSON.parse(oldList[i].childRows))
                         }
                       }
                       return res;
                     }(oldList)
                   } pagination={false}/>
                </div>
              </div>
              <Modal
                title="导出"
                visible={this.state.visible2}
                onOk={()=>this.handleOk('2')}
                onCancel={()=>this.handleCancel('2')}
              >
                <Radio.Group onChange={(e)=>this.setState({typeOld:e.target.value})} value={this.state.typeOld}>
                  <Radio value={'1'}>以前年度应付款</Radio>
                  <Radio value={'2'}>其他capex</Radio>
                </Radio.Group>
              </Modal>
            </TabPane>
          </Tabs>
          <div style={{marginTop:'20px',color:'red'}}>注：合计为有效金额合计，即预填报阶段审核通过的数据与追加阶段审核通过的数据和</div>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps (state) {

  return {
    loading: state.loading.models.fundingPlanQuery,
    ...state.fundingPlanQuery
  };
}
export default connect(mapStateToProps)(DeptMgrFundingPlanQuery);
