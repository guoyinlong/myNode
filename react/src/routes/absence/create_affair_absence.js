/**
* 作者：郭西杰
* 创建日期：2020-5-12 
* 邮箱：guoxj116@chinaunicom.cn
* 功能：实现创建事假申请界面  
*/
import React, { Component } from "react";
import { Button, Form, Col, Row, Input, Card, DatePicker, Select, message, Modal } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
import styles from './style.less';
import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment';

class create_affair_absence extends Component {
  constructor(props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let ou_id = Cookie.get('OUID');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    // let saveAddDataSource = this.props.addDataSource && this.props.addDataSource[0]?this.props.addDataSource:[];
    this.state = {
      post_name: "",
      dateFlag: false,
      displayFlag: "none",
      visible: false,
      visible2: false,
      addDataSource: [],
      start_date: '',
      end_date: '',
      reason: '',
      use_days: '',
      absence_affair_type: '',
      submitFlag: true,
      absence_apply_id_save: '',
      absence_role_info: '',
      absence_role_info_temp: '',
      user_name: user_name,
      dept_name: dept_name,
      user_id: user_id,
      dept_id: dept_id,
      ou_id: ou_id,
      isSaveClickable: true,
      isSubmitClickable: true,
    };
  }
  // 获取当前日期 （右上角申请日期格式YYYY年MM月DD日）
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month < 10 ? `0${month}` : `${month}`}月${date < 10 ? `0${date}` : `${date}`}日`
  }
  // 获取当前日期（插入数据库日期格式YYYY-MM-DD）
  getCurrentDate1() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  }

  // 选择日期
  selectDate1 = (date, dateString) => {
    this.setState({
      start_date: dateString,
    });
  };
  // 结束日期
  selectDate2 = (date, dateString) => {
    this.setState({
      end_date: dateString,
    });
  };
  // 结束日期必须大于或等于起始日期稽核
  dateValuecheck1(dataStr1, dataStr2) {
    let absence_date1 = dataStr1.replace(/\-/g, "");
    let absence_date2 = dataStr2.replace(/\-/g, "");
    return (absence_date2 >= absence_date1);
  }
  // 请假日期必须大于等于申请当天稽核
  dateValuecheck(dataStr) {
    let overtime = dataStr.replace(/\-/g, "");
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentTime = `${year}${month < 10 ? `0${month}` : `${month}`}${date < 10 ? `0${date}` : `${date}`}`;
    return (overtime >= currentTime);
  }

  onChange(e) {
    let changePlan = this.state.addDataSource;
    changePlan[e.target.id][e.target.name] = e.target.value;
    this.setState({
      addDataSource: changePlan,
    })
  }
  submitAction = () => {
    this.setState({
      visible: true,
    });
  }
  // 结束关闭按钮
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/absence/absenceIndex'
    }));
  }
  // 保存请假申请信息
  saveInfo = () => {
    let proj_id_tept = this.props.form.getFieldValue("proj_id");
    let proj_id_temp = proj_id_tept;
    this.setState({ isSaveClickable: false });
    let formData = this.props.form.getFieldsValue();
    const { dispatch } = this.props;


    /*非空校验*/
    let absencetype = this.props.form.getFieldValue("absencetype");
    let proj_id_value = this.props.form.getFieldValue("proj_id");
    if (proj_id_value === null || proj_id_value === '' || proj_id_value === undefined) {
      message.error('项目组不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }

    /*封装基本信息，即overtime_team_apply表数据*/
    let basicInfoData = {};
    let absence_apply_id = '';

    let absence_apply_id_temp = this.props.absence_apply_id;

    if (absence_apply_id_temp == '' || absence_apply_id_temp == null || absence_apply_id_temp == undefined) {
      absence_apply_id_temp = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.absence_apply_id_save !== '') {
      absence_apply_id = this.state.absence_apply_id_save;
    }
    else {
      absence_apply_id = absence_apply_id_temp;
    }

    basicInfoData["arg_absence_apply_id"] = absence_apply_id;
    basicInfoData["arg_create_person_id"] = this.state.user_id;
    basicInfoData["arg_create_person_name"] = this.state.user_name;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_dept_id"] = this.state.dept_id;
    basicInfoData["arg_ou_id"] = this.state.ou_id;
    basicInfoData["arg_proj_name"] = proj_id_temp;
    basicInfoData["arg_status"] = '0';
    basicInfoData["arg_absence_type"] = '1';

    let dateValueCheck = true;
    let dateValueCheck1 = true;
    let absenceDataList = [];

    if (formData.start_date) {
      formData.start_date = formData.start_date.format("YYYY-MM-DD");
    }
    if (formData.end_date) {
      formData.end_date = formData.end_date.format("YYYY-MM-DD");
    }

    absenceDataList['arg_absence_apply_id'] = absence_apply_id;
    absenceDataList['arg_absence_type'] = '1';
    absenceDataList['arg_absenct_type_name'] = formData.absenct_affair_type;
    absenceDataList['arg_user_id'] = this.state.user_id;
    absenceDataList['arg_user_name'] = this.state.user_name;
    absenceDataList['arg_absenct_days'] = formData.absenceDays;
    absenceDataList['arg_absenct_st'] = formData.start_date;
    absenceDataList['arg_absenct_et'] = formData.end_date;
    absenceDataList['arg_absenct_reason'] = formData.absenceReason;

    if (absenceDataList.arg_absenct_type_name == null || absenceDataList.arg_absenct_type_name == '' || absenceDataList.arg_absenct_type_name == undefined) {
      message.error('请假类型不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_days == null || absenceDataList.arg_absenct_days == '' || absenceDataList.arg_absenct_days == undefined) {
      message.error('请假天数不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_st == null || absenceDataList.arg_absenct_st == '' || absenceDataList.arg_absenct_st == undefined) {
      message.error('起始日期不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_et == null || absenceDataList.arg_absenct_et == '' || absenceDataList.arg_absenct_et == undefined) {
      message.error('结束日期不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_reason == null || absenceDataList.arg_absenct_reason == '' || absenceDataList.arg_absenct_reason == undefined) {
      message.error('申请事由不能为空');
      this.setState({ isSaveClickable: true });
      return;
    }

    /*请假日期不能小于当前日期*/
    let rt = this.dateValuecheck(absenceDataList.arg_absenct_st);
    if (rt === false) {
      dateValueCheck = false;
    }
    /*请假日期范围限制*/
    let rt1 = this.dateValuecheck1(absenceDataList.arg_absenct_st, absenceDataList.arg_absenct_et);
    if (rt1 === false) {
      dateValueCheck1 = false;
    }
    if (dateValueCheck === false) {
      message.error('请假日期必须大于等于申请当天，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }
    if (dateValueCheck1 === false) {
      message.error('结束日期必须大于或等于起始日期，请修改后再保存提交');
      this.setState({ isSaveClickable: true });
      return;
    }

    return new Promise((resolve) => {
      dispatch({
        type: 'create_affair_absence_model/absenceApprovalSave',
        basicInfoData,
        absenceDataList,
        absence_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSaveClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absence_index'
      }));
    });
  };

  // 提交请假申请信息
  handleOk = () => {
    let proj_id_tept = this.props.form.getFieldValue("proj_id");
    let proj_id_temp = proj_id_tept;
    let formData = this.props.form.getFieldsValue();

    this.setState({ isSubmitClickable: false });
    this.setState({
      visible: false,
    });
    const { dispatch } = this.props;

    /*封装基本信息，即overtime_team_apply表数据 begin */
    let basicInfoData = {};
    let absence_apply_id = '';

    let absence_apply_id_temp = this.props.absence_apply_id;

    if (absence_apply_id_temp == '' || absence_apply_id_temp == null || absence_apply_id_temp == undefined) {
      absence_apply_id_temp = this.state.user_id + Number(Math.random().toString().substr(3, 7) + Date.now()).toString(32);
    }

    if (this.state.absence_apply_id_save !== '') {
      absence_apply_id = this.state.absence_apply_id_save;
    }
    else {
      absence_apply_id = absence_apply_id_temp;
    }

    basicInfoData["arg_absence_apply_id"] = absence_apply_id;
    basicInfoData["arg_create_person_id"] = this.state.user_id;
    basicInfoData["arg_create_person_name"] = this.state.user_name;
    basicInfoData["arg_create_time"] = this.getCurrentDate1();
    basicInfoData["arg_dept_id"] = this.state.dept_id;
    basicInfoData["arg_ou_id"] = this.state.ou_id;
    basicInfoData["arg_proj_name"] = proj_id_temp;
    basicInfoData["arg_status"] = '1';
    basicInfoData["arg_absence_type"] = '1';

    /*封装基本信息，即apply表数据 end */

    /*封装人员信息，即person表数据 begin */
    let dateValueCheck = true;
    let dateValueCheck1 = true;
    let absenceDataList = [];

    if (formData.start_date) {
      formData.start_date = formData.start_date.format("YYYY-MM-DD");
    }
    if (formData.end_date) {
      formData.end_date = formData.end_date.format("YYYY-MM-DD");
    }

    absenceDataList['arg_absence_apply_id'] = absence_apply_id;
    absenceDataList['arg_absence_type'] = '1';
    absenceDataList['arg_absenct_type_name'] = formData.absenct_affair_type;
    absenceDataList['arg_user_id'] = this.state.user_id;
    absenceDataList['arg_user_name'] = this.state.user_name;
    absenceDataList['arg_absenct_days'] = formData.absenceDays;
    absenceDataList['arg_absenct_st'] = formData.start_date;
    absenceDataList['arg_absenct_et'] = formData.end_date;
    absenceDataList['arg_absenct_reason'] = formData.absenceReason;

    if (absenceDataList.arg_absenct_type_name == null || absenceDataList.arg_absenct_type_name == '' || absenceDataList.arg_absenct_type_name == undefined) {
      message.error('请假类型不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_days == null || absenceDataList.arg_absenct_days == '' || absenceDataList.arg_absenct_days == undefined) {
      message.error('请假天数不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_st == null || absenceDataList.arg_absenct_st == '' || absenceDataList.arg_absenct_st == undefined) {
      message.error('起始日期不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_et == null || absenceDataList.arg_absenct_et == '' || absenceDataList.arg_absenct_et == undefined) {
      message.error('结束日期不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (absenceDataList.arg_absenct_reason == null || absenceDataList.arg_absenct_reason == '' || absenceDataList.arg_absenct_reason == undefined) {
      message.error('申请事由不能为空');
      this.setState({ isSubmitClickable: true });
      return;
    }

    /*加班日期不能小于等于当前时间*/
    /*请假日期不能小于当前日期*/
    let rt = this.dateValuecheck(absenceDataList.arg_absenct_st);
    if (rt === false) {
      dateValueCheck = false;
    }
    /*请假日期范围限制*/
    let rt1 = this.dateValuecheck1(absenceDataList.arg_absenct_st, absenceDataList.arg_absenct_et);
    if (rt1 === false) {
      dateValueCheck1 = false;
    }
    if (dateValueCheck === false) {
      message.error('请假日期必须大于等于申请当天，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }
    if (dateValueCheck1 === false) {
      message.error('结束日期必须大于或等于起始日期，请修改后再保存提交');
      this.setState({ isSubmitClickable: true });
      return;
    }

    /*封装审批信息，即overtime_team_approval表数据,接口人申请环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_absence_apply_id"] = absence_apply_id_temp;
    /*下一环节处理人为项目接口人，直接填写申请人*/
    approvalData["arg_user_id"] = this.state.user_id;
    approvalData["arg_user_name"] = this.state.user_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate1();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即overtime_team_approval表数据 end */

    /*封装审批信息，即overtime_team_approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_absence_apply_id"] = absence_apply_id_temp;
    /*下一环节处理人为项目经理、或者部门经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = formData.nextstepPerson;
    approvalDataNext["arg_user_name"] = formData.nextstepPerson;
    approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即overtime_team_approval表数据 end */
    const absence_role_info = this.props.userRoleData

    return new Promise((resolve) => {

      dispatch({
        type: 'create_affair_absence_model/absenceApprovalSubmit',
        basicInfoData,
        absenceDataList,
        approvalData,
        approvalDataNext,
        absence_role_info,
        absence_apply_id,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ absence_apply_id_save: absence_apply_id });
        this.setState({ isSubmitClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex'
      }));
    });
  }
  // 取消按钮
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const inputstyle = { color: '#000' };
    const inputstyle1 = {
      color: '#000',
      width: '120px'
    };
    const inputstyle2 = {
      color: '#000',
      width: '400px'
    };
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { userProjectDataList, nextDataList } = this.props;

    const projectList1 = userProjectDataList.map(item => item.proj_name);
    const projectList = (projectList1 == null || projectList1 == '' || projectList1 == undefined) ? this.state.dept_name : projectList1[0];

    //选择一下处理人信息
    let nextpostname = '';
    let initperson = '';
    let nextdataList = null;
    if (nextDataList !== undefined) {
      if (nextDataList.length > 0) {
        initperson = nextDataList[0].submit_user_id;
        nextpostname = nextDataList[0].submit_post_name;
        this.state.next_post_id = '1000000000001';
      }
      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 9
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      style: { marginBottom: 10 }
    };

    const defaultDataSource1 = this.props.defaultDataSource1;
    let absenceDays = '';
    let absenct_et = '';
    let absenct_st = '';
    let absenct_reason = '';
    let absenct_affair_type1 = '';
    if (this.props.saveViewControl == "none") {
      absenceDays = Number(defaultDataSource1.map(item => item.absence_days));
      absenct_et = defaultDataSource1.map(item => item.absenct_et);
      absenct_st = defaultDataSource1.map(item => item.absenct_st);
      absenct_reason = String(defaultDataSource1.map(item => item.absenct_reason));
      absenct_affair_type1 = String(defaultDataSource1.map(item => item.absence_type_name));
    }

    let formData = this.props.form.getFieldsValue();
    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院员工事假申请表</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{this.getCurrentDate()}</u></span></p>
        <br></br>
        <Card title="基本信息" className={styles.r}>
          <Form style={{ marginTop: 10 }}>
            <Row>
              <Col span="24">
                <FormItem label="员工编号" {...formItemLayout}>
                  {getFieldDecorator('userid', {
                    initialValue: this.state.user_id
                  })
                    (<Input style={inputstyle} value='' disabled={true} />)
                  }
                </FormItem>
              </Col>
              <Col span="24">
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('username', {
                    initialValue: this.state.user_name
                  })
                    (<Input style={inputstyle} value='' disabled={true} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <FormItem label="所在部门" {...formItemLayout}>
              {getFieldDecorator('deptname', {
                initialValue: this.state.dept_name
              })
                (<Input style={inputstyle} value='' disabled={true} />)
              }
            </FormItem>
            <FormItem label="所在项目" {...formItemLayout}>
              {getFieldDecorator('proj_id', {
                initialValue: projectList
              })(<Input style={inputstyle} value='' disabled={true} />)}
            </FormItem>
          </Form>
        </Card>


        <Card title="申请信息" className={styles.r}>
          <Form style={{ marginTop: 10 }}>
            <FormItem label="请假类型" {...formItemLayout}>
              {getFieldDecorator('absenct_affair_type', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: absenct_affair_type1
              })
                (
                  <Select placeholder="请假类型" initialValue={'absenct_affair_type1'} disabled={false}>
                    <Option value="事假">事假</Option>
                    <Option value="病假">病假</Option>
                    <Option value="婚假">婚假</Option>
                    <Option value="丧假">丧假</Option>
                    <Option value="产假">产假</Option>
                    <Option value="护理假">护理假</Option>
                    <Option value="计划生育假">计划生育假</Option>
                    <Option value="探亲假">探亲假</Option>
                    <Option value="陪考假">陪考假</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="请假天数" {...formItemLayout}>
              {getFieldDecorator('absenceDays', {
                rules: [{
                  required: true,
                  pattern: /^([1-9][0-9]*)?$/,
                  message: '请填写正确格式（整数）',
                }],
                initialValue: absenceDays
              })
                (<Input style={inputstyle} value='' />)
              }
            </FormItem>

            <FormItem label="请假日期" {...formItemLayout}>
              {getFieldDecorator('start_date', {
                initialValue: this.props.saveViewControl == "none" ? moment(absenct_st, 'YYYY-MM-DD') : ''
              })(<DatePicker
                placeholder="起始日期"
                disabled={false}
                onChange={this.selectDate1}
              />)}
              <span> - </span>
              {getFieldDecorator('end_date', {
                initialValue: this.props.saveViewControl == "none" ? moment(absenct_et, 'YYYY-MM-DD') : ''
              })(<DatePicker
                placeholder="结束日期"
                disabled={false}
                onChange={this.selectDate2}
              />)}
            </FormItem>

            <FormItem label="请假事由" {...formItemLayout}>
              {getFieldDecorator('absenceReason', {
                rules: [{
                  required: true,
                  message: '必填',
                  whitespace: true
                }],
                initialValue: absenct_reason
              })
                (<Input style={inputstyle} name="reason" />)
              }
            </FormItem>
          </Form>
        </Card>
        <div style={{ textAlign: 'center' }}>
          <br></br>
          <Button type="primary" onClick={this.saveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={this.gotoHome}>关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit" onClick={this.submitAction} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
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
                <Input style={{ color: '#000' }} value={nextpostname} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '%100' }} initialValue={initperson} placeholder="请选择团队负责人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
        <br /><br />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.create_affair_absence_model,
    ...state.create_affair_absence_model
  };
}
create_affair_absence = Form.create()(create_affair_absence);
export default connect(mapStateToProps)(create_affair_absence);
