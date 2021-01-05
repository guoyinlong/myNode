/**
 * 作者：张楠华
 * 日期：2018-2-27
 * 邮箱：zhangnh6@chinaunicom.cn
 * 文件说明：资金计划个人查询
 */
import React from 'react';
import {connect} from 'dva';
import {detailName} from '../../../../../components/finance/detailName'
import {MoneyComponent} from '../../../../../components/finance/FormatData'
import {stateCodeFill,renderContent,renderContentMoney} from '../../common'
import {Tabs, Spin, DatePicker, Select, Table, Button, TreeSelect} from 'antd'
import tableStyle from '../../../../../components/finance/table.less'

const {TabPane} = Tabs;
const {MonthPicker} = DatePicker;
const Option = Select.Option;
import styles from '../../query.less'
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class PersonFundingPlanQuery extends React.Component {

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

  render() {
    const column = [
      {
        title:'序号',
        width:'100px',
        fixed:'left',
        dataIndex:'index_num'
      },
      {
        title: '年度',
        width: '100px',
        fixed: 'left',
        dataIndex: 'plan_year'
      },
      {
        title: '月份',
        width: '100px',
        fixed: 'left',
        dataIndex: 'plan_month',
      },
      {
        title:'姓名',
        width:'100px',
        fixed:'left',
        dataIndex:'apply_username'
      },
      {
        title: '资金类型',
        dataIndex: 'funds_type',
        width: '150px',
        render: (text) => {return(text ?(text ==='1'?'个人':text==='2'?'公共':'他购'):'')},
      },
      {
        title: '科目名称',
        dataIndex: "subject_name",
        width: '200px',
        render: (text, record) => detailName(text, record.childRows)
      },
      {
        title: '资金计划（元）',
        dataIndex: "funds_plan",
        width: '150px',
        render : renderContent,
      },
      {
        title: '填报状态',
        dataIndex: "fill_state_code",
        width: '150px',
        render: (text, record) => stateCodeFill(text, record)
      },
      {
        title: '填报阶段备注',
        dataIndex: "remark1",
        width: '150px',
        render : renderContent,
      },
      {
        title: '调整后资金计划（元）',
        dataIndex: "funds_current_amount",
        width: '200px',
        render : renderContentMoney,
      },
      {
        title: '调整阶段状态',
        dataIndex: "adjust_state_code",
        width: '150px',
        render: (text, record) => stateCodeFill(text, record)
      },
      {
        title: '调整阶段备注',
        dataIndex: "remark2",
        //width:'150px',
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
        title: '年度',
        width: '100px',
        fixed: 'left',
        dataIndex: 'plan_year'
      },
      {
        title: '月份',
        width: '100px',
        fixed: 'left',
        dataIndex: 'plan_month',
      },
      {
        title:'姓名',
        width:'100px',
        fixed:'left',
        dataIndex:'apply_username'
      },
      {
        title: '资金类型',
        dataIndex: 'funds_type',
        width: '150px',
        render: (text) => {return(text ?(text ==='1'?'个人':text==='2'?'公共':'他购'):'')},
      },
      {
        title: '科目名称',
        dataIndex: "subject_name",
        width: '200px',
        render: (text, record) => detailName(text, record.childRows)
      },
      {
        title: '具体付款事项描述',
        dataIndex: "spe_pay_description",
        width: '200px',
      },
      {
        title: '资金计划（元）',
        dataIndex: "funds_plan",
        width: '150px',
        render : renderContent,
      },
      {
        title: '填报状态',
        dataIndex: "fill_state_code",
        width: '150px',
        render: (text, record) => stateCodeFill(text, record),
      },
      {
        title: '填报备注',
        dataIndex: "remark1",
        width: '150px',
        render : renderContent,
      },
      // {
      //   title:'资金计划调整',
      //   dataIndex:"fundsAdjust",
      //   width:'130px',
      //   //render : text =>MoneyComponent(text)
      // },
      {
        title: '调整后资金计划（元）',
        dataIndex: "funds_current_amount",
        width: '200px',
        render : renderContentMoney,
      },
      {
        title: '调整阶段状态',
        dataIndex: "adjust_state_code",
        width: '150px',
        render: (text, record) => stateCodeFill(text, record)
      },
      {
        title: '调整阶段备注',
        dataIndex: "remark2",
        render : renderContent,
      },
    ];
    let {loading, list,oldList, feeList, beginPlanTime, endPlanTime, feeName, planType, beginPlanTimeOld, endPlanTimeOld, feeNameOld, planTypeOld} = this.props;
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
                <Button onClick={this.clearQuery} type="primary">重置</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={column} dataSource={list} scroll={{x: 1700}}/>
              </div>
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
                <Button onClick={this.clearQueryOld} type="primary">重置</Button>
              </div>
              <div>
                <Table rowKey='index_num' className={tableStyle.financeTable} columns={columnOld} dataSource={oldList} scroll={{x: 1900}}/>
              </div>
            </TabPane>
          </Tabs>
          <div style={{marginTop:'20px',color:'red'}}>注：合计为有效金额合计，即预填报阶段审核通过的数据与追加阶段审核通过的数据和</div>
        </div>
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.fundingPlanQuery,
    ...state.fundingPlanQuery
  };
}

export default connect(mapStateToProps)(PersonFundingPlanQuery);
