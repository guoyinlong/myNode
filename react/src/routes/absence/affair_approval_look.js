/**
 * 文件说明：事假已办查看
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-05-13
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

class affair_approval_look extends Component { 
  constructor(props) {
    super(props);
    this.state = {
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
    return (
      <div>
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2>中国联通济南软件研究院员工事假申请</h2></Row>
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
            </Form>
          </Card>

          <Card title="申请信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <FormItem label="请假类型" {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absence_type_name} disabled={true} />
              </FormItem>
              <FormItem label="请假天数" {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absence_days} disabled={true} />
              </FormItem>
              <FormItem label="申请日期" {...formItemLayout}>
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absenct_st} disabled={true} />--
                <Input style={{ width: '150', color: '#000' }} value={personInfo.absenct_et} disabled={true} />
              </FormItem>
              <FormItem label="申请事由" {...formItemLayout}>
                <TextArea style={{ width: '500', color: '#000' }} value={personInfo.absenct_reason} disabled={true} />
              </FormItem>
            </Form>
          </Card>

          <Card title="销假信息" className={styles.r} width={'100%'} hidden={ifabsence}>
            <Form>
              <FormItem label={'实际请假天数'} {...formItemLayout}>
                <Input placeholder="请假天数" value={absence_real_days} style={{ width: '150', color: '#000' }} name="absence_days" disabled={true} />
              </FormItem>
              <FormItem label={'实际日期'} {...formItemLayout}>
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
    loading: state.loading.models.absence_approve_look_model,
    ...state.absence_approve_look_model,
  };
}
affair_approval_look = Form.create()(affair_approval_look);
export default connect(mapStateToProps)(affair_approval_look)

