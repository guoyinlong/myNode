/**
 * 文件说明：请假管理审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2020-04-20
 */

import React, { Component } from "react";
import { Button, Tabs, Table, Select, Modal, message, Divider, Form, Row, Card, Col, Input, DatePicker } from "antd";
const FormItem = Form.Item;
const { TextArea } = Input;
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";
import { changeBr2RN } from "../project/projConst";
import moment from "moment";

class year_approval_look extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  //结束关闭
  goBack = () => {
    const { dispatch,editAble} = this.props;
    if (editAble === 'true'){
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/personalSearch'
      }))
    }else{
      dispatch(routerRedux.push({
        pathname: '/humanApp/absence/absenceIndex'
      }))
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
    let personInfo = {};
    if (personsList.length > 0) {
      personInfo = personsList[0];
    }
    const hidataList = approvalHiList.map(item =>
      <FormItem >
        {item.task_name}: &nbsp;&nbsp;{item.task_detail}
      </FormItem>
    );
    //销假信息
    let ifabsence = true;
    if (approvalNowList.length > 0) {
      if (approvalNowList[0].task_name == '申请人销假') {
        ifabsence = false;
      }
    }
    for (let i = 0; i < approvalHiList.length; i++) {
      if (approvalHiList[i].task_name == '申请人销假') {
        ifabsence = false;
      }
    }

    const { absenceYearInfo } = this.props;

    let absenceLastdays = {};
    let absenceNowdays = {};
    let absenceNowdaysRemain = {};
    let absenceLastdaysRemain = {};

    if (absenceYearInfo.length == 1) {
      absenceNowdays = absenceYearInfo[0];
    }
    else if (absenceYearInfo.length == 2) {
      absenceNowdays = absenceYearInfo[1];
      absenceLastdays = absenceYearInfo[0];
    }
    absenceNowdaysRemain = (absenceNowdays.break_remain == null || absenceNowdays.break_remain == '' || absenceNowdays.break_remain == undefined) ? '0' : absenceNowdays.break_remain;
    absenceLastdaysRemain = (absenceLastdays.break_remain == null || absenceLastdays.break_remain == '' || absenceLastdays.break_remain == undefined) ? '0' : absenceLastdays.break_remain;

    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2>中国联通济南软件研究院员工年假申请</h2></Row>
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
            <Form style={{ marginTop: 10 }}>
              <FormItem label={new Date().getFullYear() - 1 + "年年休假剩余："}  {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={absenceLastdaysRemain} disabled={true} />
                <span>  天</span>
              </FormItem>
              <FormItem label={new Date().getFullYear() + "年年休假剩余："} {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={absenceNowdaysRemain} disabled={true} />
                <span>  天</span>
              </FormItem>
              <FormItem label="年休假申请天数" {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absence_days} disabled={true} />
              </FormItem>
              <FormItem label="年休假起止日期" {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absenct_st} disabled={true} />--
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absenct_et} disabled={true} />
              </FormItem>
              <FormItem label="年休假申请事由" {...formItemLayout}>
                <TextArea style={{ width: '500', color: '#000' }} value={personInfo.absenct_reason} disabled={true} />
              </FormItem>
            </Form>
          </Card>

          <Card title="销假信息" className={styles.r} width={'100%'} hidden={ifabsence}>
            <Form>
              <FormItem label={'实际年休假天数'} {...formItemLayout}>
                <Input placeholder="调休天数" value={absence_real_days} style={{ width: '150', color: '#000' }} name="absence_days" disabled={true} />
              </FormItem>
              <FormItem label={'实际年休假日期'} {...formItemLayout}>
                <Input placeholder="开始日期" value={absence_real_st} style={{ width: '150', color: '#000' }} name="rel_start_date" disabled={true} />
                &nbsp;--&nbsp;
                <Input placeholder="结束日期" value={absence_real_et} style={{ width: '150', color: '#000' }} name="rel_end_date" disabled={true} />
              </FormItem>
            </Form>
          </Card>
          <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
            </span>
          </Card>
          <br></br>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={this.goBack}>{'返回'}</Button>
          </Col>
          <br></br>
        </Form>

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
year_approval_look = Form.create()(year_approval_look);
export default connect(mapStateToProps)(year_approval_look)

