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
import {Tabs, Spin, DatePicker, Select, Table, Button, TreeSelect,Input, Checkbox, Modal} from 'antd'
import tableStyle from '../../../../../components/finance/table.less'
const {MonthPicker} = DatePicker;
const Option = Select.Option;
import styles from '../../query.less'
const { TabPane } = Tabs;
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import exportExl from '../../exportExl';
const CheckboxGroup = Checkbox.Group;

class TeamFundingPlanQuery extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      visible1: false,
      visible2: false,
      teamTableValue1: ['teamTable1'],
      teamTableValue2: ['teamTable2']
    }
  }
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
  capexDataSource = (list = []) => {
    let capex = [];
    list.forEach(((v, i) => {
      if (v.childRows) {
        try {
          capex = [
            ...capex,
            ...JSON.parse(v.childRows)
          ]
        } catch(e) {
          throw new Error(`${e}\n序号的${i}数据无法解析`)
        }
      }
    }));
    return capex;
  }
  
  // 弹出导出选择框
  exportBtnClick = flag => {
    this.setState({
      ['visible' + flag]: true
    })
  }
  // 选择需要导出的表
  selectTable = (value, flag) => {
    this.setState({
      ['teamTableValue' + flag]: value
    })
  }
  // 导出表格
  exportTable = tableValue => {
    let titleMap = {
      teamTable1: '资金计划表',
      teamTableCapex1: 'capex表',
      teamTable2: '以前年度资金计划表',
      teamTableCapex2: '以前年度capex表'
    }
    for (let v of tableValue) {
      exportExl()(document.querySelector(`#${v} table`), titleMap[v]);
    }
  }
  // 确认导出
  handleOk = flag => {
    switch (flag) {
      case '1':
        this.exportTable(this.state.teamTableValue1);
        break;
      case '2':
        this.exportTable(this.state.teamTableValue2);
        break;
    }
    this.setState({
      ['visible' + flag]: false
    })
  }
  // 取消
  handleCancel = flag => {
    this.setState({
      ['visible' + flag]: false
    })
  }

  render(){
    // 导出用
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
    const column = [
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
        //render : text =>MoneyComponent(text)
        render : renderContentMoney,
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
    const columnOld = [
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
      {
        title:'调整后资金计划（元）',
        dataIndex:"funds_current_amount",
        width:'200px',
        render : renderContentMoney,
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
    let {loading, list,oldList, feeList,beginPlanTime, endPlanTime, feeName, planType, beginPlanTimeOld, endPlanTimeOld, feeNameOld, planTypeOld,applyUser,applyUserOld} = this.props;
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
                  姓名：
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
                <Button onClick={() => this.exportBtnClick('1')} type="primary">导出</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={column} dataSource={list} scroll={{x: 1700}}/>
              </div>
              <div>
                <div id="teamTable1" style={{display:"none"}}>
                  <Table rowKey='index_num' columns={column} dataSource={list} pagination={false}/>
                </div>
                <div id="teamTableCapex1" style={{display:"none"}}>
                  <Table rowKey='uuid' columns={columnsCapex} dataSource={this.capexDataSource(list)} pagination={false}/>
                </div>
              </div>
              <Modal
                title="导出"
                visible={this.state.visible1}
                onOk={()=>this.handleOk('1')}
                onCancel={()=>this.handleCancel('1')}
              >
                <CheckboxGroup
                  options={[
                    {
                      label: '月资金计划',
                      value: 'teamTable1'
                    },
                    {
                      label: '其他capex',
                      value: 'teamTableCapex1'
                    }
                  ]}
                  value={this.state.teamTableValue1}
                  onChange={value => this.selectTable(value, '1')}
                />
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
                  姓名：
                  {/*<Select onChange={(value) => this.changeState(value, 'applyUserOld')} style={{width: '100px'}}*/}
                  {/*value={applyUserOld}>*/}
                  {/*{canApplyUserList.map((i)=><Option key={i.apply_userid}>{i.apply_username}</Option>*/}
                  {/*)}*/}
                  {/*</Select>*/}
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
                <Button onClick={() => this.exportBtnClick('2')} type="primary">导出</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={columnOld} dataSource={oldList} scroll={{x: 1900}}/>
              </div>
              <div>
                <div id="teamTable2" style={{display:"none"}}>
                  <Table rowKey='index_num' columns={columnOld} dataSource={oldList} pagination={false}/>
                </div>
                <div id="teamTableCapex2" style={{display:"none"}}>
                  <Table rowKey='uuid' columns={columnsCapex} dataSource={this.capexDataSource(oldList)} pagination={false}/>
                </div>
              </div>
              <Modal
                title="导出"
                visible={this.state.visible2}
                onOk={()=>this.handleOk('2')}
                onCancel={()=>this.handleCancel('2')}
              >
                <CheckboxGroup
                  options={[
                    {
                      label: '月资金计划',
                      value: 'teamTable2'
                    },
                    {
                      label: '其他capex',
                      value: 'teamTableCapex2'
                    }
                  ]}
                  value={this.state.teamTableValue2}
                  onChange={value => this.selectTable(value, '2')}
                />
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
export default connect(mapStateToProps)(TeamFundingPlanQuery);
