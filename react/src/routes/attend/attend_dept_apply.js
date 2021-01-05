/**
* 作者：郭西杰
* 邮箱：guoxj116@chinaunicom.cn
* 创建日期：2020-07-02
* 文件说明：业务部门考勤统计创建
* */

import React, { Component } from 'react';
import { Button, Form, Row, Input, Card, Select, Table, DatePicker, message, Modal } from 'antd';

import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';
const { MonthPicker } = DatePicker
const FormItem = Form.Item;
const { Option } = Select;

class attend_dept_apply extends Component {
  constructor(props) {
    let dept_name = Cookie.get('dept_name');
    super(props);
    this.state = {
      visible: false,
      submitFlag: true,
      attend_apply_id_save: '',
      attend_apply_id: '',
      isSubmitClickable: true,
      dept_name: dept_name,
      choiseMonth: "none",
      selectedRowKeys: [],
      personvisible: false,
      worktime_dept_apply_id: Cookie.get("userid") + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32),
    };
  }
  //获取当前日期，（左上角显示：YYYY年MM月DD日）
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  };
  // 获取当前日期，（插入数据表专用：YYYY-MM-DD）
  getCurrentDate1() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  };
  // 提交按钮
  submitAction = () => {
    this.setState({
      visible: true,
    });
  };
  selectDate = (date, dateString) => {
    this.setState({
      attend_month: dateString,
    });

    this.setState({
      choiseMonth: "",
    })
    //获取部门id
    let dept_id = Cookie.get('dept_id');

    const { dispatch } = this.props;
    let param = {
      arg_dept_id: dept_id,
      arg_cycle_code: dateString,
      arg_if_submit: '0'
    };
    dispatch({
      type: 'attend_apply_model/deptQuery',
      param
    });
    dispatch({
      type: 'attend_apply_model/approvalQuery',
      param
    });
  };

  // 关闭按钮 
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/attend/index'
    }))
  };
  //查看按钮跳转到加班管理界面
  gotoTeamDetails = (record) => {
    if ((record.worktime_team_apply_id !== null) && (record.worktime_team_apply_id !== " ") && (record.worktime_team_apply_id !== undefined)) {
      const { dispatch } = this.props;
      let param = {
        arg_worktime_team_apply_id: record.worktime_team_apply_id,
        arg_cycle_code: record.cycle_code,
      };
      dispatch({
        type: 'attend_apply_model/queryTeamList',
        param,
      });
    }
    this.setState({
      personvisible: true,
    });
  }
  // 提交信息
  handleOk = () => {
    const { nextDataList } = this.props;
    let nextpostname = '';
    if (nextDataList && nextDataList[0]) {
      if (nextDataList.length > 0) {
        nextpostname = nextDataList[0].submit_user_name;
      }
    }
    let committee_type = 'dept'
    let formData = this.props.form.getFieldsValue();
    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;
    //月份
    if (formData.attend_month) {
      formData.attend_month = formData.attend_month.format("YYYY-MM");
    }

    /*封装基本信息，即apply表数据*/
    let basicInfoData = {};
    let worktime_dept_apply_id = this.state.worktime_dept_apply_id;

    basicInfoData["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
    basicInfoData["arg_create_person_id"] = Cookie.get("userid");
    basicInfoData["arg_create_person_name"] = Cookie.get('username');
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_cycle_code"] = formData.attend_month;
    basicInfoData["arg_ou_id"] = Cookie.get("OUID");
    basicInfoData["arg_dept_id"] = Cookie.get('dept_id');
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_apply_type"] = '4';
    // basicInfoData["arg_proc_inst_id"] = ''; --model补充
    /*封装基本信息，即apply表数据 end */
    let teamDataList = this.props.teamDataList;
    //多选项目组加班进行提交
    const selectedRowKeys = this.state.selectedRowKeys;
    let selectedItem = [];
    if (selectedRowKeys.length < 1) {
      message.error('请勾选需要汇总的项目组');
      this.setState({
        isSubmitClickable: true
      })
      return;
    } else {
      for (let j = 0; j < teamDataList.length; j++) {
        for (let i = 0; i < selectedRowKeys.length; i++) {
          let m = this.state.selectedRowKeys[i];
          if (m === teamDataList[j].key) {
            selectedItem.push(teamDataList[j]);
          }
        }
      }
    }

    let transforTeamDataList = [];
    selectedItem.map((item) => {
      let temp = {
        arg_worktime_department_apply_id: worktime_dept_apply_id,  //申请id
        arg_worktime_team_apply_id: item.worktime_team_apply_id  //项目申请id
      };
      transforTeamDataList.push(temp);
    });
    /*封装审批信息，即approval表数据,经办人申请环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
    /*下一环节处理人为经办人，直接填写经办人*/
    approvalData["arg_user_id"] = Cookie.get("userid");;
    approvalData["arg_user_name"] = Cookie.get("username");;
    approvalData["arg_post_id"] = ''; //===========
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate1();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即approval表数据 end */

    /*封装审批信息，即approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_worktime_department_apply_id"] = worktime_dept_apply_id;
    /*下一环节处理人为部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = formData.nextstepPerson1;
    approvalDataNext["arg_user_name"] = nextpostname;
    approvalDataNext["arg_post_id"] = '';//===========
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即approval表数据 end */
    return new Promise((resolve) => {
      dispatch({
        type: 'attend_apply_model/attendDeptApplySubmit',
        basicInfoData,
        transforTeamDataList,
        approvalData,
        approvalDataNext,
        worktime_dept_apply_id,
        committee_type,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/attend/index',
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/attend/index',
      }));
    });
  }
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    let attend_month = formData.attend_month;
    if (attend_month === null || attend_month === '' || attend_month === undefined) {
      message.error('考勤月份不能为空');
      this.setState({ isSaveClickable: true });
      return;
    };
    this.setState({
      visible: true,
    });
  }
  //选择多个项目组进行提交
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  // 提交信息取消
  handleCancle = (e) => {
    this.setState({
      visible: false
    });
  };

  full_attend_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
  ];

  absence_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '请假类型', dataIndex: 'absence_type' },
    { title: '请假天数', dataIndex: 'absence_days' },
    { title: '请假详情', dataIndex: 'absence_details' },
  ];

  business_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '出差天数', dataIndex: 'travel_days' },
    { title: '出差详情', dataIndex: 'travel_details' },
  ];

  out_trip_columns = [
    {
      title: '序号',
      dataIndex: 'indexID',
      key: 'indexID',
      width: 50,
      render: (text, record, index) => {
        return <span>{index + 1}</span>
      },
    },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    { title: '因公外出天数', dataIndex: 'away_days' },
    { title: '因公外出详情', dataIndex: 'away_details' },
  ];

  dept_columns = [
    { title: '编号', dataIndex: 'key' },
    { title: '项目组', dataIndex: 'proj_name' },
    {
      title: '操作', dataIndex: '', key: 'x', render: (text, record, index) => (
        <span>
          {
            <a onClick={() => this.gotoTeamDetails(record)}>查看</a>
          }
        </span>
      )
    },
  ];

  handleOk3 = () => {
    this.setState({
      personvisible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false
    });
  };
  handleCancel3 = () => {
    this.setState({
      personvisible: false,
    });
  }

  render() {
    const personFullDataList = this.props.personFullDataList;
    const personAbsenceDataList = this.props.personAbsenceDataList;
    const personTravelDataList = this.props.personTravelDataList;
    const personOutDataList = this.props.personOutDataList;
    const { nextDataList } = this.props;
    const personDataApprovalInfo = this.props.personDataApprovalInfo;

    //选择一下处理人信息\
    let nextpostname = '';
    let initperson = '';

    let nextdataList = null;
    if (nextDataList && nextDataList[0]) {
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
      }
      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }
    const hidataListTeam = personDataApprovalInfo.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );
    const { teamDataList } = this.props;
    if (teamDataList && teamDataList.length) {
      teamDataList.map((i, index) => {
        i.key = index + 1;
      })
    }
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    var hasSelected = 0;
    if (selectedRowKeys) {
      hasSelected = selectedRowKeys.length > 0;
    }

    const { getFieldDecorator } = this.props.form;
    const inputstyle = { color: '#000' };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
          <h2><font size="5" face="arial">业务部门考勤统计单</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{this.getCurrentDate()}</u></span></p>
        <br></br>
        <Card title="基本信息：" className={styles.r}>
          <Form style={{ marginTop: 10 }}>
            <Row style={{ textAlign: 'center' }}>
              <FormItem label="部门名称" {...formItemLayout}>
                {getFieldDecorator('deptname', {
                  initialValue: this.state.dept_name
                })
                  (<Input style={inputstyle} value='' disabled={true} />)
                }
              </FormItem>
            </Row>
            <Row>
              <FormItem label="考勤月份" {...formItemLayout}>
                {getFieldDecorator('attend_month', {
                  initialValue: this.props.saveViewControl == "none" ? moment(attend_month, 'YYYY-MM') : ''
                })(<MonthPicker
                  placeholder="选择考勤月份"
                  style={{ textAlign: 'left' }}
                  disabled={false}
                  onChange={this.selectDate}
                />)}
              </FormItem>
            </Row>
            <br />
          </Form>
        </Card>

        <Card title="考勤统计汇总" className={styles.r} style={{ display: this.state.choiseMonth }}>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `已选中 ${selectedRowKeys.length}个项目组` : ''}</span>
          <Table
            //选择指定的项目组进行提交
            rowSelection={rowSelection}
            columns={this.dept_columns}
            //这里的信息是点击节假日查询出来的列表信息
            dataSource={teamDataList}
            pagination={false}
          />
        </Card>
        <Modal
          title="考勤人员列表"
          visible={this.state.personvisible}
          onOk={this.handleOk3}
          onCancel={this.handleCancel3}
          width={"75%"}
        >
          <div>
            <Card title="*全勤类">
              <br />
              <Table
                columns={this.full_attend_columns}
                dataSource={personFullDataList}
                pagination={true}
                scroll={{ x: '100%', y: 450 }}
                width={'100%'}
                bordered={true}
              />
              <br />
            </Card>
            <Card title="*请假类">
              <br />
              <Table
                columns={this.absence_columns}
                dataSource={personAbsenceDataList}
                pagination={true}
                scroll={{ x: '100%', y: 450 }}
                width={'100%'}
                bordered={true}
              />
              <br />
            </Card>
            <Card title="*出差类">
              <br />
              <Table
                columns={this.business_trip_columns}
                dataSource={personTravelDataList}
                pagination={true}
                scroll={{ x: '100%', y: 450 }}

                width={'100%'}
                bordered={true}
              />
              <br />
            </Card>
            <Card title="*因公外出类">
              <br />
              <Table
                columns={this.out_trip_columns}
                dataSource={personOutDataList}
                pagination={true}
                scroll={{ x: '100%', y: 450 }}
                width={'100%'}
                bordered={true}
              />
              <br />
            </Card>
            <Card title="审批信息">
              <span style={{ textAlign: 'left', color: '#000' }}>
                {hidataListTeam}
              </span>
            </Card>
          </div>
        </Modal>
        <br />
        <br />
        <div span={24} style={{ textAlign: 'center' }}>
          <Button onClick={this.goBack}>{'关闭'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
        </div>
        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                {getFieldDecorator('nextpostname', {
                  initialValue: nextpostname
                })(
                  <Input style={{ color: '#000' }} disabled={true} />
                )}
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson1', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '%100' }} placeholder="请选择">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.attend_apply_model,
    ...state.attend_apply_model
  };
}

attend_dept_apply = Form.create()(attend_dept_apply);
export default connect(mapStateToProps)(attend_dept_apply);
