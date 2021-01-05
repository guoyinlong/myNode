/**
 * 文件说明：导入工资
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-10-16
 **/
import React, { Component } from 'react';
import { connect } from "dva";
import { Button, Card, Form, Row, Select, Table } from "antd";
import Cookie from "js-cookie";
const { Option } = Select;
import { message } from "antd";
import watermark from 'watermark-dom';

import { routerRedux } from "dva/router";

import { DatePicker } from 'antd';
import moment from 'moment';
const { MonthPicker } = DatePicker;

import ExcelImportContract from "./excelImportLabor";
import exportExl from './exportExlForImportLabor';
import { darken } from 'material-ui/utils/colorManipulator';
import styles from './costmainten.less';

class importLaborInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaveClickable: true,
      isSuccess: false,
      personPostDataList: [],
      ou_name: Cookie.get("OU"),
      user_id: Cookie.get("userid"),
      dept_id: Cookie.get("dept_id"),
      //显示：1：导入显示，2：查询显示，默认是查询显示
      showTablesDataFlag: '2',
      saveFlag: true,
      columns: [
        { title: '序号', dataIndex: 'indexID', fixed: 'left', width: '20%' },
        { title: '月份', dataIndex: 'month', fixed: 'left', width: '20%' },
        { title: '部门', dataIndex: 'dept_name', fixed: 'left', width: '20%' },
        { title: '员工编号', dataIndex: 'user_id', fixed: 'left', width: '20%' },
        { title: '员工名称', dataIndex: 'user_name', fixed: 'left', width: '20%' },
      ],
      month: '',
    }
  }

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
    if (codeVerify != rand_code || codeVerify == undefined || codeVerify == null || codeVerify == '') {
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: '/humanApp/costlabor/costVerify',
      }));
    }
  }
  //查询本院人员工资信息计划
  queryAllPostInfo = () => {
    let arg_params = {};
    arg_params["arg_ou_id"] = Cookie.get('OUID');
    if (this.state.dept_id !== '') {
      arg_params["arg_dept_id"] = this.state.dept_id; //部门传参加上前缀
    }
    if (this.state.month !== '') {
      arg_params["arg_month"] = this.state.month; //部门传参加上前缀
    } else {
      message.error('月份不能为空！');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'importLaborModel/laborSearch',
      arg_param: arg_params
    });
  }
  handlePostChange = (e) => {
    this.setState({
      dept_id: e,
    });
  };
  //更新状态
  updateVisible = (value) => {
    /*if(value === true){
      this.setState({
        showTablesDataFlag: 1,
        saveFlag: false,
      });
    }*/
  };

  disabledDate = (value) => {
    const time = new Date().toLocaleDateString();
    if (value) {
      var lastDateValue = moment(time).valueOf();
      return value.valueOf() >= lastDateValue
    }
  }
  onChangeDatePickerOne = (date, dateString) => {
    if (dateString !== '') {
      this.setState({
        month: dateString
      });
    }
  }

  // 点击导出按钮
  exportTable = () => {
    let { ou_name } = this.state;
    let { month } = this.state;
    var tableName = ou_name + '-' + month;

    //数据源
    const { importLaborDataList } = this.props;
    let importLaborTitleList = [];
    if (this.props.importLaborTitleList.length > 0) {
      importLaborTitleList = this.props.importLaborTitleList;
    } else {
      importLaborTitleList = this.state.columns;
    }

    if (importLaborDataList !== null && importLaborDataList.length !== 0) {
      exportExl(importLaborDataList, tableName, importLaborTitleList)
    } else {
      message.info("导出数据为空！")
    }
  }

  render() {
    const { loading, ouList, deptList, importLaborDataList } = this.props;
    //公司列表
    let ouOptionList = '';
    if (ouList.length) {
      ouOptionList = ouList.map(item =>
        <Option key={item.OU}>{item.OU}</Option>
      );
    };
    const auth_ou = Cookie.get("OU");

    //部门列表
    let deptListData = '';
    if (deptList.length) {
      deptListData = deptList.map(item =>
        <Option key={item.court_dept_id}>{item.court_dept_name}</Option>
      );
    };
    const initdeptID = Cookie.get("dept_name");

    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let nowmonth = year + '-' + month;
    if (this.state.month !== null && this.state.month !== '') {
      nowmonth = this.state.month;
    } else {
      this.setState({
        month: nowmonth
      });
    }

    let importLaborTitleList = [];
    if (this.props.importLaborTitleList.length > 0) {
      importLaborTitleList = this.props.importLaborTitleList;
    } else {
      importLaborTitleList = this.state.columns;
    }

    let if_export = true;
    console.log("===" + this.state.dept_id + '===');
    if (importLaborDataList[0]) {
      if (this.state.dept_id != '' && this.state.dept_id != ' ' && this.state.dept_id != null) {
        if_export = false;
      }
    }

    return (
      <div>
        <br /><br />
        <br />
        <div className={styles.nocopy} style={{ float: 'left' }}>

          <span> 组织单元： </span>
          <Select style={{ width: 160 }} defaultValue={auth_ou} disabled={true}>
            {ouOptionList}
          </Select>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 部门： </span>
          <Select style={{ width: 160 }} defaultValue={initdeptID} onSelect={this.handlePostChange} >
            <Option key=' '>全部</Option>
            {deptListData}
          </Select>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 月份： </span>
          <MonthPicker onChange={this.onChangeDatePickerOne} value={moment(nowmonth, 'YYYY-MM')} />

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          <Button type="primary" onClick={this.queryAllPostInfo} disabled={this.state.isSaveClickable ? false : (this.state.isSuccess ? false : true)}>查询</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            this.state.isSaveClickable ?
              <ExcelImportContract dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
              : (this.state.isSuccess ?
                <ExcelImportContract dispatch={this.props.dispatch} updateVisible={this.updateVisible} />
                :
                null
              )
          }
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" disabled={if_export} onClick={this.exportTable}>导出</Button>&nbsp;&nbsp;
        </div>
        <br /><br />
        <br />

        <Row span={2} style={{ textAlign: 'center' }}><h2>{this.state.ou_name + "人员工资信息"}</h2></Row>
        <br />

        <Card id='exportTable' className={styles.nocopy}>
          <br />
          <Table
            columns={importLaborTitleList}
            dataSource={importLaborDataList}
            pagination={true}
            scroll={{ x: 10000 }}
            loading={loading}
          />
        </Card>

        <br />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.importLaborModel,
    ...state.importLaborModel
  };
}

importLaborInfo = Form.create()(importLaborInfo);
export default connect(mapStateToProps)(importLaborInfo);
