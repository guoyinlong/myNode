/**
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2020-06-10
 * 文件说明：工会慰问信息查询
 **/
import React, { Component } from 'react';
import { Button, Select, Table, message, Pagination, Card, Input, DatePicker } from "antd";
import { connect } from "dva";
import Cookie from "js-cookie";
import { routerRedux } from "dva/router";
import styles from './style.less';
import exportExcel from "./ExcelExport";
const { RangePicker } = DatePicker;
import moment from 'moment';

const { Option } = Select;

class personalSearch extends Component {
  constructor(props) {
    let dateList = [];
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    while ((endDate.getTime() - startDate.getTime()) >= 0) {
      let year = startDate.getFullYear();
      let month = (startDate.getMonth() + 1).toString().length === 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
      let day = startDate.getDate().toString().length === 1 ? "0" + startDate.getDate() : startDate.getDate();
      dateList.push(year + "-" + month + "-" + day);
      startDate.setDate(startDate.getDate() + 1);
    }

    const reset_start_time = dateList[0];
    const reset_end_time = dateList[dateList.length - 1];

    super(props);
    let dept_id = Cookie.get('dept_id');
    let user_id = Cookie.get('userid');
    let user_name = Cookie.get('username');
    const ou_search = Cookie.get('OU');
    this.state = {
      OU: ou_search,
      dept_id: dept_id,
      user_name: user_name,
      userid_or_username: user_id,
      absence_type: 'all',
      apply_status: 'all',
      start_time: reset_start_time,
      end_time: reset_end_time
    };
  }

  //改变OU，触发查询部门服务，重新获取该OU下的部门和职务列表。
  handleOuChange = (value) => {
    this.setState({
      OU: value,
      dept_id: 'all'
    });
    const { dispatch } = this.props;
    /**查询该机构下的部门的服务 */
    dispatch({
      type: 'person_info_search_model/getDept',
      arg_param: value
    });
  };

  //选择部门
  handleDeptChange = (value) => {
    this.setState({
      dept_id: value
    })
  };

  //选择请假类型
  handleTypeChange = (value) => {
    this.setState({
      absence_type: value
    });
  };

  //审批状态
  handleStatusChange = (value) => {
    this.setState({
      apply_status: value
    });
  };

  //选择时间
  handleselectDate = (value) => {
    this.setState({
      start_time: value[0].format("YYYY-MM-DD"),
      end_time: value[1].format("YYYY-MM-DD"),
    });
  }

  //输入姓名或者id
  InputNameOrId = ({ target: { value } }) => {
    this.setState({
      userid_or_username: value
    });
  }

  //清空查询条件，只保留OU
  clear = () => {
    const { permission, department_mananger } = this.props;
    const auth_ou = Cookie.get('OU');
    let dateList = [];
    let startDate = new Date();
    let endDate = new Date();
    endDate.setDate(startDate.getDate() + 30);
    while ((endDate.getTime() - startDate.getTime()) >= 0) {
      let year = startDate.getFullYear();
      let month = (startDate.getMonth() + 1).toString().length === 1 ? "0" + (startDate.getMonth() + 1).toString() : (startDate.getMonth() + 1);
      let day = startDate.getDate().toString().length === 1 ? "0" + startDate.getDate() : startDate.getDate();
      dateList.push(year + "-" + month + "-" + day);
      startDate.setDate(startDate.getDate() + 1);
    }

    const reset_start_time = dateList[0];
    const reset_end_time = dateList[dateList.length - 1];

    if (permission === '3') {
      this.setState({
        OU: auth_ou,
        dept_id: 'all',
        userid_or_username: '',
        user_name: '',
        absence_type: 'all',
        apply_status: 'all',
        start_time: reset_start_time,
        end_time: reset_end_time
      });
    } else if (permission === '2' || permission === '1' || department_mananger) {
      this.setState({
        userid_or_username: '',
        user_name: '',
        absence_type: 'all',
        apply_status: 'all',
        start_time: reset_start_time,
        end_time: reset_end_time
      });
    } else if (permission === '0') {
      this.setState({
        absence_type: 'all',
        apply_status: 'all',
        start_time: reset_start_time,
        end_time: reset_end_time
      });
    }
  };

  //查询
  search = () => {
    const { permission, department_mananger, deptList } = this.props;
    let user_role = '0';
    if (permission === '2' || department_mananger) {
      user_role = '2';
    } else {
      user_role = permission;
    }

    let arg_params = {};

    arg_params["arg_user_role"] = user_role;
    arg_params["arg_userid_or_username"] = this.state.userid_or_username;
    arg_params["arg_dept_id"] = this.state.dept_id;
    arg_params["arg_start_time"] = this.state.start_time;
    arg_params["arg_end_time"] = this.state.end_time;
    arg_params["arg_absence_type"] = this.state.absence_type;
    arg_params["arg_apply_status"] = this.state.apply_status;

    const { dispatch } = this.props;
    // 根据条件进行查询
    dispatch({
      type: 'person_info_search_model/personalAbsenceInfoQuery',
      query: arg_params
    });
  };

  columns = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '部门', dataIndex: 'deptname' },
    { title: 'HR编号', dataIndex: 'user_id', },
    { title: '姓名', dataIndex: 'user_name', },
    { title: '请假类型', dataIndex: 'absence_type' },
    { title: '申请时间', dataIndex: 'apply_time' },
    { title: '流程状态', dataIndex: 'flow_status' },
    { title: '当前审批环节', dataIndex: 'next_name' },
    { title: '审批人', dataIndex: 'next_person' },
    {
      title: '详情', dataIndex: '', key: 'x', render: (text, record) => (
        <span>
          <a onClick={() => this.gotoLook(record)}>查看</a>
        </span>
      )
    },
  ];

  //跳转到记录信息查看
  gotoLook = (record) => {
    const { dispatch } = this.props;
    let query = {
      absence_apply_id: record.absence_apply_id,
      absence_apply_type: record.absence_type,
    }
    if (record.absence_type === "调休申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/absence_approve_look',
        query
      }));
    } else if (record.absence_type === "事假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/affair_approval_look',
        query
      }));
    }
    else if (record.absence_type === "年假申请") {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex/year_approval_look',
        query
      }));
    }
  };

  //导出应该是根据当前搜索的条件，查询完后再导出
  exportExcel = () => {
    const { tableDataList } = this.props;

    let condition = {};
    condition = {
      '部门': 'deptname',
      'HR编号': 'user_id',
      '姓名': 'user_name',
      '请假类型': 'absence_type',
      '申请时间': 'apply_time',
      '流程状态': 'flow_status',
      '当前审批环节': 'next_name',
      '审批人': 'next_person',
    };
    if (tableDataList.length > 0) {
      exportExcel(tableDataList, '请假信息数据', condition);
    } else {
      message.info("没有请假信息数据！");
    }
  };

  render() {
    const { loading, tableDataList, ouList, deptList, permission, department_mananger } = this.props;

    if (tableDataList.length > 0 && tableDataList) {
      for (let i = 0; i < tableDataList.length; i++) {
        tableDataList[i]["indexID"] = i + 1;
      }
    }
    const ouOptionList = ouList.map((item) => {
      return (
        <Option key={item.OU}>
          {item.OU}
        </Option>
      )
    });
    let deptOptionList = deptList.map((item) => {
      return (
        <Option key={item.dept_id} value={item.dept_id}>
          {item.dept_name}
        </Option>
      )
    });
    deptOptionList.push(<Option key='all' value={'all'}>全部</Option>);
    // 这里为每一条记录添加一个key，从0开始
    if (tableDataList.length) {
      tableDataList.map((i, index) => {
        i.key = index;
      })
    }
    const dateFormat = 'YYYY-MM-DD';

    return (
      <div>
        <Card>
          <div style={{ marginBottom: '15px' }}>
            <span>组织机构：</span>
            <Select style={{ width: '15%', color: '#000' }} onSelect={this.handleOuChange} value={this.state.OU} disabled={true}>
              {ouOptionList}
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;所在部门：
            <Select
              style={{ width: '15%', color: '#000' }}
              onSelect={this.handleDeptChange}
              value={this.state.dept_id}
              disabled={permission === '2' ? false : true}
            >
              {deptOptionList}
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;姓名/员工编号：
            <Input style={{ width: '10%', color: '#000' }} onChange={this.InputNameOrId} defaultValue={this.state.user_name} disabled={permission === '2' || permission === '1' || department_mananger ? false : true}>
            </Input>

            <br />
            <br />
            请假类型：
            <Select style={{ width: '15%', color: '#000' }} onSelect={this.handleTypeChange} value={this.state.absence_type}>
              <Option value='all'>全部</Option>
              <Option value='0'>调休申请</Option>
              <Option value='1'>事假申请</Option>
              <Option value='2'>年休假申请</Option>
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;审批状态：
            <Select style={{ width: '15%', color: '#000' }} onSelect={this.handleStatusChange} value={this.state.apply_status}>
              <Option value='all'>全部</Option>
              <Option value='1'>审批中</Option>
              <Option value='2'>审批完成</Option>
            </Select>

            &nbsp;&nbsp;&nbsp;&nbsp;申请时间 区间：
            <RangePicker style={{ width: '25%', color: '#000' }}
              onChange={this.handleselectDate}
              value={[moment(this.state.start_time, dateFormat), moment(this.state.end_time, dateFormat)]}
            />

            <div className={styles.btnLayOut}>
              <Button type="primary" onClick={() => this.search()}>{'查询'}</Button>
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={() => this.exportExcel()}>{'导出'}</Button>
              &nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={this.clear}>{'重置'}</Button>
            </div>
          </div>
          <br />
          <Table
            columns={this.columns}
            dataSource={tableDataList}
            pagination={true}
            loading={loading}
            bordered={true}
          />
        </Card>
      </div>);
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.person_info_search_model,
    ...state.person_info_search_model,
  };
}
export default connect(mapStateToProps)(personalSearch);

