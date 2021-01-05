/**
 * 文件说明：请假管理审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2020-04-20
 */

import React, { Component } from "react";
import { Button, Tabs, Table, Select, Modal, message, Divider, Form, Row, Card, Col, Input, DatePicker } from "antd";
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { TextArea } = Input;
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";
import { changeBr2RN } from "../project/projConst";
import moment from "moment";

const TabPane = Tabs.TabPane;
const Option = Select.Option;
class absence_approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSubmitClickable: true,
      isSaveClickable: true,
      leave_apply_id_save: '',
      absence_apply_id_save: '',
      isClickable: true,
      choiseOpinionFlag: "none",
      now_post_name: '',
      rel_start_date: '',
      rel_end_date: '',
    }
  }
  onChange(e) {
    let changePlan = this.state.addDataSource;
    changePlan[e.target.id][e.target.name] = e.target.value;
    this.setState({
      addDataSource: changePlan,
    })
  }
  choiseDate(start_date) {
    let rel_start_date = start_date.format("YYYY-MM-DD");
    this.setState({
      rel_start_date: rel_start_date
    })
  }
  choiseDate1(end_date) {
    let rel_end_date = end_date.format("YYYY-MM-DD");
    this.setState({
      rel_end_date: rel_end_date
    })
  }
  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/absence/absenceIndex'
    }));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    this.setState({ isClickable: false });
    this.setState({
      visible: false,
    });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_if_overDate = this.props.personsList;

    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");

    let rel_absence_days = this.props.form.getFieldValue("rel_absence_days");
    let rel_start_date = this.state.rel_start_date;
    let rel_end_date = this.state.rel_end_date;
    let now_post_name = this.state.now_post_name;

    if (now_post_name == '申请人销假') {
      if (rel_absence_days == '' || rel_absence_days == null || rel_start_date == '' || rel_start_date == null || rel_end_date == '' || rel_end_date == null) {
        message.error('销假信息不能为空或者格式不对！');
        this.setState({ isClickable: true });
        return;
      }
    }

    let nextpostid = this.state.next_post_id;
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'absence_approval_model/absenceApprovalSubmit',
        approval_if,
        orig_if_overDate,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        nextstepPerson,
        nextpostid,
        rel_absence_days,
        rel_start_date,
        rel_end_date,
        now_post_name,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex'
      }));
    });
  }
  submitcheck = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    if (approval_if == '不同意') {
      this.setState({ isClickable: false });
      let orig_proc_inst_id = this.props.proc_inst_id;
      let orig_if_overDate = this.props.personsList;
      let orig_proc_task_id = this.props.proc_task_id;
      let orig_apply_task_id = this.props.apply_task_id;
      let approval_if = this.props.form.getFieldValue("rejectIf");
      let approval_advice = this.props.form.getFieldValue("rejectAdvice");
      let nextstepPerson = '';
      let nextpostid = this.state.next_post_id;
      const { dispatch } = this.props;

      if (approval_if === '不同意' && approval_advice === '') {
        this.setState({ isClickable: true });
        message.error('意见不能为空');
      } else {
        return new Promise((resolve) => {
          dispatch({
            type: 'absence_approval_model/absenceApprovalSubmit',
            approval_if,
            approval_advice,
            orig_if_overDate,
            orig_proc_inst_id,
            orig_proc_task_id,
            orig_apply_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/absence/absenceIndex'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        });
      }


    } else {
      const { approvalNowList } = this.props;
      let if_end_task = '0';
      if (approvalNowList.length > 0) {
        this.state.now_post_name = approvalNowList[0].task_name;
        if (approvalNowList[0].task_name == '接口人归档' || approvalNowList[0].task_name == '人力资源部归档') {
          if_end_task = '1';
        }
      }
      /*最后一步*/
      if (if_end_task === '1') {
        this.setState({ isClickable: false });
        let orig_proc_inst_id = this.props.proc_inst_id;
        let orig_proc_task_id = this.props.proc_task_id;
        let orig_apply_task_id = this.props.apply_task_id;
        let approval_if = this.props.form.getFieldValue("rejectIf");
        let approval_advice = this.props.form.getFieldValue("rejectAdvice");
        let nextstepPerson = '';
        let nextpostid = this.state.next_post_id;
        const { dispatch } = this.props;

        return new Promise((resolve) => {
          dispatch({
            type: 'absence_approval_model/absenceApprovalEnd',
            approval_if,
            approval_advice,
            orig_proc_inst_id,
            orig_proc_task_id,
            orig_apply_task_id,
            nextstepPerson,
            nextpostid,
            resolve
          });
        }).then((resolve) => {
          if (resolve === 'success') {
            this.setState({ isClickable: true });
            setTimeout(() => {
              dispatch(routerRedux.push({
                pathname: '/humanApp/absence/absenceIndex'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/absence/absenceIndex'
          }));
        });
      } else {
        this.setState({
          visible: true,
        });
      }
    }
  }
  //选择不同意，显示驳回意见信息
  choiseOpinion = (value) => {
    if (value === "不同意") {
      this.setState({
        choiseOpinionFlag: "",
      })
    } else {
      this.setState({
        choiseOpinionFlag: "none",
      })
    }
  }
  breakOffInfo = [
    { title: '序号', dataIndex: 'indexID' },
    { title: '调休人姓名', dataIndex: 'absence_user_name' },
    { title: '调休人员工编号', dataIndex: 'absence_user_id' },
    { title: '起始日期', dataIndex: 'absenct_st' },
    { title: '结束日期', dataIndex: 'absenct_et' },
    { title: '调休天数', dataIndex: 'absence_days' },
    { title: '申请理由', dataIndex: 'absenct_reason' },
  ];
  render() {
    const inputstyle = { color: '#000' };
    const { getFieldDecorator } = this.props.form;
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
    const { approvalNowList, approvalHiList, personsList, applyPersonInfo } = this.props;
    let applyInfo = {};
    let absence_real_days = '';
    let absence_real_st = '';
    let absence_real_et = '';
    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
      absence_real_days = applyInfo.absence_real_days;
      absence_real_st = applyInfo.absence_real_st;
      absence_real_et = applyInfo.absence_real_et;
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );
    //评论信息
    let nowdataList = approvalNowList.map(item =>
      <span>
        <FormItem label={item.task_name} {...formItemLayout}>
          {getFieldDecorator('rejectIf', {
            initialValue: "同意",
          })(
            <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
              <Option value="同意">同意</Option>
              <Option value="不同意">不同意</Option>
            </Select>
          )}
        </FormItem>

        <FormItem label="审批驳回意见" {...formItemLayout} style={{ display: this.state.choiseOpinionFlag }}>
          {getFieldDecorator('rejectAdvice', {
            initialValue: "驳回原因",
            rules: [
              {
                required: true,
                message: '请填写驳回意见'
              },
            ],
          })(
            <TextArea
              style={{ minHeight: 32 }}
              placeholder="请填写驳回意见"
              rows={2}
            />
          )}
        </FormItem>
      </span>
    );
    if (approvalNowList.length > 0) {
      this.state.now_post_name = approvalNowList[0].task_name;
      if (approvalNowList[0].task_name == '接口人归档' || approvalNowList[0].task_name == '人力资源部归档') {
        // this.state.if_end_task = 1;
        nowdataList = '';
      }
    }
    //销假信息
    let ifabsence = true;
    let ifdisplay = true;
    if (approvalNowList.length > 0) {
      if (approvalNowList[0].task_name == '申请人销假') {
        nowdataList = '';
        ifabsence = false;
        ifdisplay = false;
      }
    }
    for (let i = 0; i < approvalHiList.length; i++) {
      if (approvalHiList[i].task_name == '申请人销假') {
        ifabsence = false;
      }
    }

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    let nextpostname = '';
    let initperson = '';
    if (nextDataList.length > 0) {
      initperson = nextDataList[0].submit_user_id;
      nextpostname = nextDataList[0].submit_post_name;
      this.state.next_post_id = '1000000000001';
    }
    const nextdataList = nextDataList.map(item =>
      <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
    );

    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2>中国联通济南软件研究院员工调休申请审批表</h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
        <br /><br />
        <Form>
          <Card title="基本信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <Row>
                <Col span="24">
                  <FormItem label="员工编号" {...formItemLayout}>
                    <Input style={inputstyle} value={applyInfo.create_person_id} disabled={true} />
                  </FormItem>
                </Col>
                <Col span="24">
                  <FormItem label="姓名" {...formItemLayout}>
                    <Input style={inputstyle} value={applyInfo.create_person_name} disabled={true} />
                  </FormItem>
                </Col>
              </Row>
              <FormItem label="所在部门" {...formItemLayout}>
                <Input style={inputstyle} value={applyInfo.dept_name} disabled={true} />
              </FormItem>
              <FormItem label="所在项目" {...formItemLayout}>
                <Input style={inputstyle} value={applyInfo.proj_name} disabled={true} />
              </FormItem>
              <FormItem label="请假类型" {...formItemLayout}>
                <Input style={inputstyle} value={applyInfo.absence_type} disabled={true} />
              </FormItem>
            </Form>
          </Card>

          <Card title="申请信息" className={styles.r}>
            <div>
            </div>
            <br></br>
            <Table style={{}}
              columns={this.breakOffInfo}
              dataSource={personsList}
              pagination={false}
              bordered={true}
            />
          </Card>

          <Card title="销假信息" className={styles.r} width={'100%'} hidden={ifabsence}>
            <Form>
              <FormItem label={'实际调休天数'} {...formItemLayout}>
                {getFieldDecorator('rel_absence_days', {
                  initialValue: absence_real_days,
                  rules: [{ pattern: /^([1-9][0-9]*)?$/, required: true, message: '请填写调休天数' },],
                })(
                  <Input placeholder="调休天数" style={{ width: '150', color: '#000' }} name="absence_days" disabled={ifdisplay} />
                )}
              </FormItem>
              {
                this.state.now_post_name == "申请人销假"
                  ?
                  <FormItem label={'实际调休日期'} {...formItemLayout}>
                    {getFieldDecorator('rel_start_date', {
                      initialValue: '',
                      rules: [{ required: true, message: '请选择调休开始日期' },],
                    })(
                      <DatePicker
                        placeholder="开始日期"
                        style={{ width: '150' }}
                        disabled={ifdisplay}
                        format="YYYY-MM-DD"
                        onChange={this.choiseDate.bind(this)}
                      />
                    )}&nbsp;--&nbsp;
                    {getFieldDecorator('rel_end_date', {
                      initialValue: '',
                      rules: [{ required: true, message: '请选择调休结束日期' },],
                    })(
                      <DatePicker
                        placeholder="结束日期"
                        style={{ width: '150' }}
                        disabled={ifdisplay}
                        format="YYYY-MM-DD"
                        onChange={this.choiseDate1.bind(this)}
                      />
                    )}
                  </FormItem>
                  :
                  <FormItem label={'实际调休日期'} {...formItemLayout}>
                    <Input placeholder="开始日期" value={absence_real_st} style={{ width: '150', color: '#000' }} name="rel_start_date" disabled={ifdisplay} />
                    &nbsp;--&nbsp;
                    <Input placeholder="结束日期" value={absence_real_et} style={{ width: '150', color: '#000' }} name="rel_end_date" disabled={ifdisplay} />
                  </FormItem>
              }
            </Form>
          </Card>
          <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
              {nowdataList}
            </span>
          </Card>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.submitcheck} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </Col>
          <br></br>
        </Form>

        <Modal
          title="流程处理"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'下一步环节'} {...formItemLayout}>
                <Input style={inputstyle} value={nextpostname} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择处理人">
                    {nextdataList}
                  </Select>)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.absence_approval_model,
    ...state.absence_approval_model,
  };
}
absence_approval = Form.create()(absence_approval);
export default connect(mapStateToProps)(absence_approval)

