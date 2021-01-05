/**
 * 作者：翟金亭
 * 创建日期：2019-12-04
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：培训管理-人力专员：全院课程查询：详情/概要查询，导出
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
import { Select, Tabs, Button, Table } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class TrainClassInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      year: new Date().getFullYear(),
      dept: 'all',
      query_type: 't1',
      personGroup: '全体员工'
    };
  };

  // 查询
  exportCostQuery = () => {
    const { dispatch } = this.props;
    const { year, dept, query_type, personGroup } = this.state;
    dispatch({
      type: 'trainClassInfoModel/trainClassInfoQuery',
      formData: {
        'arg_ou_id': Cookie.get('OUID'),
        'arg_curr_year': year,
        'arg_dept_id': dept === 'all' ? 'all' : dept,
        'arg_type_flag': query_type === 't1' ? '0' : '1',
        'arg_person_flag': personGroup,
      }
    });
  }

  //选择年份
  handleYearChange = (value) => {
    this.setState({ year: value })
  };

  //选择部门
  handleDeptChange = (value) => {
    this.setState({
      dept: value
    })
  };

  //选择群体
  handleGroupChange = (value) => {
    this.setState({
      personGroup: value
    })
  };


  //切换面板
  changeTabs = (value) => {
    this.setState({
      query_type: value
    })
  }
  // 点击导出按钮
  //济南分院员工培训获取学分统计及明细数据—截止10.28提供历史台账数据
  exportTable = () => {
    let { OU } = this.state;
    let year = this.state.year;
    var tableId = document.querySelector("#exportTable table");
    var tableName = OU + year + '年' + '员工培训获取学分统计及明细数据';
    exportExl()(tableId, tableName)
  }


  render() {
    const { loading, trainClassFullData, trainClassDetailData, deptList, personList } = this.props;
    //统计
    const columnListDetail = [
      {
        title: '组织单位',
        dataIndex: 'deptname_p',
        width: 80,
      },
      {
        title: '部门名称',
        dataIndex: 'deptname',
        width: 80,
      },
      {
        title: '员工编号',
        dataIndex: 'user_id',
        width: 80,
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
        width: 80,
      },
      {
        title: '已学课程数量',
        dataIndex: 'learned_num',
        width: 80,
      },
      {
        title: '已学课时数',
        dataIndex: 'is_get_hour',
        width: 80,
      },
      {
        title: '已学课程积分',
        dataIndex: 'is_get_credit',
        width: 80,
      },
      {
        title: '已学线下培训积分',
        dataIndex: 'get_outline_score',
        width: 80,
      },
      {
        title: '已学线上培训积分',
        dataIndex: 'get_online_score',
        width: 80,
      },
      {
        title: '需核减线上培训积分',
        dataIndex: 'is_minus_online_score',
        width: 80,
      },
      {
        title: '已学有效积分',
        dataIndex: 'get_real_score',
        width: 80,
      },
    ];
    //详情
    const columnListFull = [
      {
        title: '组织单位',
        dataIndex: 'deptname_p',
        width: 80,
      },
      {
        title: '部门名称',
        dataIndex: 'deptname',
        width: 80,
      },
      {
        title: '员工编号',
        dataIndex: 'user_id',
        width: 80,
      },
      {
        title: '姓名',
        dataIndex: 'user_name',
        width: 80,
      },
      {
        title: '课程名称',
        dataIndex: 'class_name',
        width: 200,
      },
      {
        title: '课程类别',
        dataIndex: 'class_type',
        width: 80,
      },
      {
        title: '课程形式',
        dataIndex: 'train_kind',
        width: 80,
      },
      {
        title: '培训开始时间',
        dataIndex: 'train_start_time',
        width: 160,
      },
      {
        title: '培训结束时间',
        dataIndex: 'train_end_time',
        width: 160,
      },
      {
        title: '课程学时',
        dataIndex: 'get_hour',
        width: 80,
      },
      {
        title: '课程学分',
        dataIndex: 'get_score',
        width: 80,
      },
    ];

    //获取前四年的年份
    let date = new Date;
    let yearArray = [];
    for (let i = 0; i < 4; i++) {
      yearArray.push(date.getFullYear() - i);
    }
    const currentDate = date.getFullYear();
    const yearList = yearArray.map((item) => {
      return (
        <Option key={item} value={item.toString()}>
          {item}
        </Option>
      )
    });

    //部门列表
    let deptOptionList = '';
    if (deptList !== undefined) {
      deptOptionList = deptList.map(item =>
        <Option value={item.deptid}>{item.deptname}</Option>
      );
    }

    //群体列表
    let personOptionList = '';
    if (personList !== undefined) {
      personOptionList = personList.map(item =>
        <Option value={item.train_group}>{item.train_group}</Option>
      );
    }
    return (
      <div className={exportCost.container}>
        <Tabs
          defaultActiveKey='t1'
          onChange={this.changeTabs}
        >
          <TabPane tab="统计信息" key="t1">
            {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}
            <span>OU：
                <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px', color: '#000' }}>
                {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              请选择年度：
                <Select style={{ minWidth: '160px' }} onSelect={this.handleYearChange} defaultValue={currentDate}>
                {yearList}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              请选择部门：
                <Select style={{ minWidth: '220px' }} onSelect={this.handleDeptChange} value={this.state.dept}>
                <Option value={'all'}>全部</Option>
                {deptOptionList}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span >
              请选择培训群体：
                <Select style={{ minWidth: '160px' }} onSelect={this.handleGroupChange} value={this.state.personGroup}>
                {personOptionList}
              </Select>
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={false} onClick={this.exportCostQuery}>查询</Button>&nbsp;&nbsp;
            </span>

            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={trainClassDetailData[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
            </span>

            {/*查询条件结束*/}
            {trainClassDetailData && trainClassDetailData[0] ?
              /*查询结果结束*/
              <div style={{ marginTop: '20px' }}>
                <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                  <Table columns={columnListDetail} dataSource={trainClassDetailData} scroll={{ x: 1940, y: 550 }} loading={loading} pagination={false} />
                </div>
                <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ display: "none" }}>
                  <Table columns={columnListDetail} dataSource={trainClassDetailData} pagination={false} />
                </div>
              </div>
              /*查询结果结束*/
              :
              <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                <Table
                  columns={columnListDetail}
                  dataSource={trainClassDetailData}
                  scroll={{ x: 1940, y: 500 }}
                  loading={loading}
                />
              </div>
            }
          </TabPane>

          <TabPane tab="明细信息" key="t2">
            {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}
            <span>OU：
                <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px', color: '#000' }}>
                {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              请选择年度：
                <Select style={{ minWidth: '160px' }} onSelect={this.handleYearChange} defaultValue={currentDate}>
                {yearList}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span >
              请选择部门：
                <Select style={{ minWidth: '220px' }} onSelect={this.handleDeptChange} value={this.state.dept}>
                <Option value={'all'}>全部</Option>
                {deptOptionList}
              </Select>
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span >
              请选择培训群体：
                <Select style={{ minWidth: '160px' }} onSelect={this.handleGroupChange} value={this.state.personGroup}>
                {personOptionList}
              </Select>
            </span>
            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={false} onClick={this.exportCostQuery}>查询</Button>&nbsp;&nbsp;
            </span>

            <span style={{ display: 'inline-block', margin: '0 20px' }}>
              <Button type="primary" disabled={trainClassFullData[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
            </span>

            {/*查询条件结束*/}
            {trainClassFullData && trainClassFullData[0] ?
              /*查询结果结束*/
              <div style={{ marginTop: '20px' }}>
                <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                  <Table columns={columnListFull} dataSource={trainClassFullData} scroll={{ x: 1570, y: 550 }} loading={loading} pagination={false} />
                </div>
                <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ display: "none" }}>
                  <Table columns={columnListFull} dataSource={trainClassFullData} pagination={false} />
                </div>
              </div>
              /*查询结果结束*/
              :
              <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable} style={{ marginTop: '15px' }}>
                <Table
                  columns={columnListFull}
                  dataSource={trainClassFullData}
                  scroll={{ x: 1570, y: 500 }}
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
  const { deptList } = state.trainClassInfoModel;
  return {
    loading: state.loading.models.trainClassInfoModel,
    ...state.trainClassInfoModel,
    deptList
  };
}

export default connect(mapStateToProps)(TrainClassInfo);
