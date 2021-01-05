/**
 * 作者：翟金亭
 * 创建日期：2019-11-05
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：人工成本管理：研发项目人工成本-财务-按院、按月、按项目组查询、导出
 */
import React, { Component } from 'react';
import { connect } from "dva";
import Cookie from 'js-cookie';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import tableStyle from './table.less';
import styles from './costmainten.less';
import exportCost from './exportCost.css';
import exportExl from './exportExl';
import { Select, DatePicker, Tabs, Col, Button, Table } from 'antd';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
const TabPane = Tabs.TabPane;
import watermark from 'watermark-dom';

class ExportCostForFinance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      yearMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
    };
  };
  componentDidMount = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    let waterName = Cookie.get("username") + ' ' + `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : ` ${date}`}  ${hour}:${minutes}:${seconds}`
    watermark.load({ watermark_txt: waterName });
  }
  // 查询
  exportCostQuery = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'exportCostModel/costFinanceQuery',
      formData: {
        'arg_ou_id': Cookie.get('OUID'),
        'arg_year_month': item.arg_year + '-' + item.arg_month,
        'arg_query_type': item.arg_query_type,
      }
    });
  }

  // 改变年月
  onChangeDatePicker1 = (dateString) => {
    const { OUID } = this.state;
    this.setState({ yearMonth: dateString })
    let formData = {
      'arg_year': new Date(dateString).getFullYear(),
      'arg_month': (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1),
      'arg_ou_id': OUID,
      'arg_query_type': '0',
    }
    this.exportCostQuery(formData);
  };

  // 改变年月
  onChangeDatePicker2 = (dateString) => {
    const { OUID } = this.state;
    this.setState({ yearMonth: dateString })
    let formData = {
      'arg_year': new Date(dateString).getFullYear(),
      'arg_month': (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1),
      'arg_ou_id': OUID,
      'arg_query_type': '1',
    }
    this.exportCostQuery(formData);
  };


  // 点击导出按钮
  exportTable = () => {
    let { OU } = this.state;
    let yearMonth = this.state.yearMonth;
    var tableId = document.querySelector("#exportTable table");
    var tableName = '研发项目支出明细表-' + OU + '(' + new Date(yearMonth).getFullYear() + '年' + (new Date(yearMonth).getMonth() + 1 < 10 ? '0' + (new Date(yearMonth).getMonth() + 1) : new Date(yearMonth).getMonth() + 1) + '月 人工成本)';
    exportExl()(tableId, tableName)
  }

  // 限制月份的选择
  disabledDate = (value) => {
    return value && value.valueOf() > moment().endOf('day')
  };


  render() {
    const { loading, costFinanceData, costFinanceData2 } = this.props;
    const columnList = [
      {
        title: '研发项目支出明细表-' + this.state.OU + '(' + new Date(this.state.yearMonth).getFullYear() + '年' + (new Date(this.state.yearMonth).getMonth() + 1) + '月 人工成本)',
        children: [
          {
            title: '支出组织',
            dataIndex: 'out_orgination',
            width: '15%',
          },
          {
            title: '成本中心',
            dataIndex: 'cost_center',
            width: '20%',
          },
          {
            title: '项目编号',
            dataIndex: 'team_code',
            width: '20%',
          },
          {
            title: '支出类型',
            dataIndex: 'cost_type',
            width: '25%',
          },
          {
            title: '金额(元)',
            dataIndex: 'cost_fee',
            width: '20%',
          },
        ]
      },
    ];
    return (
      <div className={exportCost.container}>
        <Tabs
          defaultActiveKey='t1'
        >
          <TabPane tab="YZQ项目" key="t1">
            {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}
            <span>OU：
            <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px', color: '#000' }}>
                {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
              </Select>
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              月份：
            <MonthPicker onChange={this.onChangeDatePicker1} disabledDate={this.disabledDate} value={moment(this.state.yearMonth ? this.state.yearMonth : this.props.lastDate, 'YYYY-MM')} allowClear={false} />
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={costFinanceData[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          </span>

            {/*查询条件结束*/}
            {costFinanceData && costFinanceData[0] ?
              /*查询结果结束*/
              <div style={{ marginTop: '20px' }}>
                <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                  <Table columns={columnList} dataSource={costFinanceData} scroll={{ x: '100%', y: 400 }} loading={loading} pagination={false} />
                </div>
                <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ display: "none" }}>
                  <Table columns={columnList} dataSource={costFinanceData} pagination={false} />
                </div>
              </div>
              /*查询结果结束*/
              :
              <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                <Table
                  columns={columnList}
                  dataSource={costFinanceData}
                  scroll={{ x: '100%', y: 500 }}
                  loading={loading}
                />
              </div>
            }
          </TabPane>

          <TabPane tab="Z9E项目" key="t2">
            {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}
            <span>OU：
            <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px' }}>
                {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
              </Select>
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              月份：
            <MonthPicker onChange={this.onChangeDatePicker2} disabledDate={this.disabledDate} value={moment(this.state.yearMonth ? this.state.yearMonth : this.props.lastDate, 'YYYY-MM')} allowClear={false} />
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={costFinanceData2[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
          </span>

            {/*查询条件结束*/}
            {costFinanceData2 && costFinanceData2[0] ?
              /*查询结果结束*/
              <div style={{ marginTop: '20px' }}>
                <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                  <Table columns={columnList} dataSource={costFinanceData2} scroll={{ x: '100%', y: 400 }} loading={loading} pagination={false} />
                </div>
                <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ display: "none" }}>
                  <Table columns={columnList} dataSource={costFinanceData2} pagination={false} />
                </div>
              </div>
              /*查询结果结束*/
              :
              <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                <Table
                  columns={columnList}
                  dataSource={costFinanceData2}
                  scroll={{ x: '100%', y: 500 }}
                  loading={loading}
                />
              </div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.exportCostModel,
    ...state.exportCostModel
  };
}

export default connect(mapStateToProps)(ExportCostForFinance);
