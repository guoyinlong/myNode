/**
 * 作者：翟金亭
 * 创建日期：2019-11-05
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：人工成本管理：项目转资本化
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
import exportExl from './exportExlForCap';
import { Select, DatePicker, Button, Table, message } from 'antd';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import watermark from 'watermark-dom';


class ExportCostToCapitalization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      OUID: Cookie.get("OUID"),
      proj_code: 'select',
      beginTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
      endTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
      //导出、生成控制
      export_flag: false,
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
  //比较日期
  diffDate(date1, date2) {
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  // 查询
  exportCostQuery = (item) => {
    const { dispatch } = this.props;
    if (item.ou_id === '' || item.ou_id === null || item.ou_id === undefined) {
      return;
    } else if (item.beginTime === null || item.beginTime === '' || item.beginTime === undefined) {
      message.error("请选择开始账期");
      return;
    } else if (item.endTime === null || item.endTime === '' || item.endTime === undefined) {
      message.error("请选择结束账期");
      return;
    } else if (this.diffDate(item.beginTime, item.endTime)) {
      message.error("结束账期不可小于开始账期");
      return;
    } else {
      dispatch({
        type: 'exportCostModel/costToCapitalizationQuery',
        formData: {
          arg_ou_id: item.ou_id,
          arg_proj_code: item.proj_code,
          arg_start_cycle_code: item.beginTime,
          arg_end_cycle_code: item.endTime,
        }
      });
    }
  }

  // 生成
  exportGenerateCost = () => {
    const { dispatch } = this.props;
    const { OUID, beginTime, endTime } = this.state;
    if (OUID === '' || OUID === null || OUID === undefined) {
      return;
    } else if (beginTime === null || beginTime === '' || beginTime === undefined) {
      message.error("请选择开始账期");
      return;
    } else if (endTime === null || endTime === '' || endTime === undefined) {
      message.error("请选择结束账期");
      return;
    } else if (this.diffDate(beginTime, endTime)) {
      message.error("结束账期不可小于开始账期");
      return;
    } else {
      dispatch({
        type: 'exportCostModel/capitalizationProjTeamQuery',
        formData: {
          arg_ou_id: OUID,
          arg_start_cycle_code: beginTime,
          arg_end_cycle_code: endTime,
        }
      });
    }
  }

  // 改变开始账期
  onChangeDatePicker_start = (dateString) => {
    this.setState({
      beginTime: new Date(dateString).getFullYear() + '-' + (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1)
    });
  };
  // 改变结束账期
  onChangeDatePicker_end = (dateString) => {
    this.setState({
      endTime: new Date(dateString).getFullYear() + '-' + (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1)
    });
  };

  // 改变项目名称
  handleProjNameChange = (value) => {
    const { OUID, beginTime, endTime } = this.state;
    this.setState({
      proj_code: value,
    });

    let formData = {
      'ou_id': OUID,
      'beginTime': beginTime,
      'endTime': endTime,
      'proj_code': value
    }
    this.exportCostQuery(formData);
  };

  // 点击导出按钮
  exportTable = () => {
    const { costToCapitalizationTeamList } = this.props;
    let { OU, beginTime, proj_code, endTime } = this.state;
    let projName = '';
    if (costToCapitalizationTeamList && costToCapitalizationTeamList[0]) {
      for (let i = 0; i < costToCapitalizationTeamList.length; i++) {
        if (costToCapitalizationTeamList[i].proj_code === proj_code) {
          projName = costToCapitalizationTeamList[i].proj_name;
        }
      }
    }
    //导出表名称
    var tableName = '研发项目转资--' + OU + '-' + projName + '(' + new Date(beginTime).getFullYear() + '年' + (new Date(beginTime).getMonth() + 1) + '月-' + new Date(endTime).getFullYear() + '年' + (new Date(endTime).getMonth() + 1) + '月)';

    //数据源
    const { costCapitalizationData } = this.props;
    if (costCapitalizationData !== null && costCapitalizationData.length !== 0) {
      exportExl(costCapitalizationData, tableName)
    } else {
      message.info("导出数据为空！")
    }
  }

  // 限制月份的选择
  disabledDate = (value) => {
    return value && value.valueOf() > moment().endOf('day')
  };

  columnList_a = [
    {
      title: '员工编号',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      fixed: 'left'
    },
    {
      title: '项目组人员',
      dataIndex: 'user_name',
      key: 'user_name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '工时占比',
      dataIndex: 'ratio',
      key: 'ratio',
      width: 100,
      fixed: 'left'
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
      key: 'dept_name',
      width: 150,
      fixed: 'left',
    },
    {
      title: '工资总额',
      dataIndex: 'total_sum',
      key: 'total_sum',
      width: 100,
      fixed: 'left',
    },
    {
      title: '社会保险费',
      children: [
        {
          title: '养老保险',
          dataIndex: 'shbx_yalbx',
          width: 100,
        },
        {
          title: '医疗保险',
          dataIndex: 'shbx_yilbx',
          width: 100,
        },
        {
          title: '失业保险',
          dataIndex: 'shbx_syebx',
          width: 100,
        },
        {
          title: '工伤保险',
          dataIndex: 'shbx_gsbx',
          width: 100,
        },
        {
          title: '生育保险',
          dataIndex: 'shbx_syubx',
          width: 100,
        },
        {
          title: '补充医疗保险',
          dataIndex: 'shbx_bcyilbx',
          width: 150,
        },
        {
          title: '企业年金',
          dataIndex: 'shbx_qynj',
          width: 100,
        },
        {
          title: '补充养老保险',
          dataIndex: 'shbx_bcyalbx',
          width: 150,
        },
        {
          title: '其他社会保险',
          dataIndex: 'shbx_qtbx',
          width: 150,
        },
      ]
    },
    {
      title: '住房公积金',
      children: [
        {
          title: '住房公积金',
          dataIndex: 'zf_gjj',
          width: 200,
        },
      ]
    },
    {
      title: '职工福利费',
      children: [
        {
          title: '防暑降温补贴',
          dataIndex: 'zgfl_fsjw',
          width: 150,
        },
        {
          title: '供暖费补贴',
          dataIndex: 'zgfl_gnf',
          width: 150,
        },
        {
          title: '独生子女费',
          dataIndex: 'zgfl_dszn',
          width: 150,
        },
        {
          title: '医药费用(体检费)',
          dataIndex: 'zgfl_ylfy',
          width: 200,
        },
        {
          title: '困难补助',
          dataIndex: 'zgfl_knbz',
          width: 100,
        },
        {
          title: '加班餐费',
          dataIndex: 'zgfl_jbcf',
          width: 100,
        },
        {
          title: '其他',
          dataIndex: 'zgfl_qt',
          width: 100,
        },
      ]
    },
    {
      title: '其他人工成本',
      children: [
        {
          title: '员工管理费',
          dataIndex: 'qtcb_yggl',
          width: 150,
        },
        {
          title: '劳动保护费',
          dataIndex: 'qtcb_ldbh',
          width: 150,
        },
        {
          title: '其他',
          dataIndex: 'qtcb_qt',
          width: 200,
        },
      ]
    },
    {
      title: '合计',
      dataIndex: 'total_fee',
      width: 100,
    },
  ];

  render() {
    const { loading, costToCapitalizationTeamList, costCapitalizationData } = this.props;

    let projNameList = [];
    if (costToCapitalizationTeamList) {
      if (costToCapitalizationTeamList.length > 0) {
        projNameList = costToCapitalizationTeamList.map((item, index) =>
          <Option key={index} value={item.proj_code} >{item.proj_name}</Option>
        );
      }
    }

    return (
      <div className={exportCost.container}>
        {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}

        <span>OU：
                <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px' }}>
            {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
          </Select>
        </span>

        <span style={{ display: 'inline-block', margin: '0 20px' }}>开始账期：
            <MonthPicker
            onChange={this.onChangeDatePicker_start}
            value={moment(this.state.beginTime ? this.state.beginTime : new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1), 'YYYY-MM')}
            disabledDate={this.disabledDate}
          />
        </span>
        ~
            <span style={{ display: 'inline-block', margin: '0 20px' }}>结束账期：
            <MonthPicker
            onChange={this.onChangeDatePicker_end}
            value={moment(this.state.endTime ? this.state.endTime : new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1), 'YYYY-MM')}
            disabledDate={this.disabledDate}
          />
        </span>

        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          <Button type="primary" onClick={this.exportGenerateCost}>查询</Button>&nbsp;&nbsp;
            </span>

        <span style={{ display: 'inline-block', marginTop: '10px' }}>选择项目组查看详细：
                <Select showSearch
            optionFilterProp="children"
            onChange={this.handleProjNameChange}
            dropdownMatchSelectWidth={false}
            value={this.state.proj_code}
            style={{ minWidth: '400px' }}
            disabled={costToCapitalizationTeamList[0] ? false : true}
          >
            {
              costToCapitalizationTeamList[0] ?
                <Option value='select'>选择项目组</Option>
                :
                <Option value='select'>各项目组无数据</Option>
            }
            {projNameList}
          </Select>
        </span>



        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          <Button type="primary" disabled={costCapitalizationData && costCapitalizationData[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
            </span>

        {/*查询条件结束*/}
        {costCapitalizationData && costCapitalizationData[0] ?
          /*查询结果结束*/
          <div style={{ marginTop: '20px' }}>
            <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px' }}>
              <Table columns={this.columnList_a} dataSource={costCapitalizationData} scroll={{ x: 3400, y: 400 }} pagination={false} loading={loading} />
            </div>

            <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} scroll={{ x: 3400, y: 400 }} style={{ display: "none" }}>
              <Table columns={this.columnList_a} dataSource={costCapitalizationData} pagination={false} />
            </div>

          </div>
          /*查询结果结束*/
          :
          <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px' }}>
            <Table columns={this.columnList_a} dataSource={costCapitalizationData} scroll={{ x: 3400, y: 400 }} pagination={false} loading={loading} />
          </div>
        }
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

export default connect(mapStateToProps)(ExportCostToCapitalization);
