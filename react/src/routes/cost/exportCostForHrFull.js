/**
 * 作者：翟金亭
 * 创建日期：2019-11-05
 * 邮箱：zhaijt3@chinaunicom.cn
 * 文件说明：人工成本管理：研发项目人工成本明汇总全成本-按院、按月、按项目组查询、导出
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
import { routerRedux } from "dva/router";
import exportExl from './exportExl';
import { Select, DatePicker, Button, Table } from 'antd';
const Option = Select.Option;
const { MonthPicker } = DatePicker;
import watermark from 'watermark-dom';

class ExportCostForHrFull extends Component {
  constructor(props) {
    super(props);
    this.state = {
      OUDataList: [],
      OU: Cookie.get("OU"),
      OUID: Cookie.get("OUID"),
      yearMonth: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1),
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
    const { codeVerify } = this.props;
    const { rand_code } = this.props;
    console.log('costVerifyRouter', codeVerify)
    console.log('rand_code', rand_code)

    if (codeVerify != rand_code || codeVerify == undefined || codeVerify == null || codeVerify == '') {
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify',
      }));
    }
  }

  // 改变年月
  onChangeDatePicker = (dateString) => {
    this.setState({
      yearMonth: dateString,
    })

    const { OUID } = this.state;
    let formData = {
      'arg_year': new Date(dateString).getFullYear(),
      'arg_month': (new Date(dateString).getMonth() + 1 < 10 ? '0' + (new Date(dateString).getMonth() + 1) : new Date(dateString).getMonth() + 1),
      'arg_ou_id': OUID,
    }
    this.exportGenerateCost(formData);
  };


  // 点击导出按钮
  exportTable = () => {
    let { OU } = this.state;
    let yearMonth = this.state.yearMonth;
    var tableId = document.querySelector("#exportTable table");
    var tableName = OU + '-' + new Date(yearMonth).getFullYear() + '年' + (new Date(yearMonth).getMonth() + 1 < 10 ? '0' + (new Date(yearMonth).getMonth() + 1) : new Date(yearMonth).getMonth() + 1) + '月全口径项目人工成本信息';
    exportExl()(tableId, tableName)
  }

  // 限制月份的选择
  disabledDate = (value) => {
    return value && value.valueOf() > moment().endOf('day')
  };

  // 生成
  exportGenerateCost = (item) => {
    const { dispatch } = this.props;
    const { OUID } = this.state;
    let yearMonth = item.arg_year + '-' + item.arg_month;

    if (!yearMonth || yearMonth === '') {
      message.error("请选择要生成的年月");
    }
    else {
      dispatch({
        type: 'exportCostModel/generateCostFullQuery',
        formData: {
          'arg_ou_id': OUID,
          'arg_year_month': yearMonth,
        }
      });
    }
  }

  columnList = [
    {
      title: 'OU组织',
      dataIndex: 'OU',
      width: '15%',
    },
    {
      title: '部门名称',
      dataIndex: 'dept_name',
      width: '15%',
    },
    {
      title: '项目编码',
      dataIndex: 'team_code',
      width: '10%',
    },
    {
      title: '项目名称',
      dataIndex: 'team_name',
      width: '30%',
    },
    {
      title: '当月人工成本费用',
      dataIndex: 'month_fee',
      width: '20%',
      textAlign: 'center'
    },
  ];

  render() {
    const { loading, costFullData } = this.props;

    return (
      <div className={exportCost.container}>
        {/* 各院查询各自分院的，给总院人留有接口，数据查询控制 */}
        <span>OU：
          <Select value={this.state.OU} disabled={true} style={{ minWidth: '160px' }}>
            {this.state.OUDataList.map((i, index) => <Option key={index} value={i.OU}>{i.OU}</Option>)}
          </Select>
        </span>
        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          月份：
          <MonthPicker onChange={this.onChangeDatePicker} disabledDate={this.disabledDate} value={moment(this.state.yearMonth ? this.state.yearMonth : this.props.lastDate, 'YYYY-MM')} allowClear={false} />
        </span>

        <span style={{ display: 'inline-block', margin: '0 20px' }}>
          <Button type="primary" disabled={costFullData[0] ? false : true} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
        </span>

        {/*查询条件结束*/}
        {costFullData && costFullData[0] ?
          /*查询结果结束*/
          <div style={{ marginTop: '20px' }}>
            {/*项目信息开始*/}
            {/*项目组信息结束*/}
            <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px', textAlign: 'center' }}>
              <Table columns={this.columnList} dataSource={costFullData} scroll={{ x: '100%', y: 400 }} pagination={false} loading={loading} />
            </div>
            <div id='exportTable' className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ display: "none" }}>
              <Table columns={this.columnList} dataSource={costFullData} pagination={false} />
            </div>
          </div>
          /*查询结果结束*/
          :
          <div className={styles.costmaintenTable + ' ' + tableStyle.orderTable + ' ' + styles.nocopy} style={{ marginTop: '15px', textAlign: 'center' }}>
            <Table columns={this.columnList} dataSource={costFullData} scroll={{ x: '100%', y: 400 }} pagination={false} loading={loading} />
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

export default connect(mapStateToProps)(ExportCostForHrFull);
