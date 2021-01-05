/**
 * 文件说明：培训计划审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-07-14
 */
import React, { Component } from "react";
import { Form, Card, Table, Row, Col, Input, Button, Select, Modal, Radio } from 'antd';
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from "../overtime/style.less";
import message from "../../components/commonApp/message";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class train_plan_look extends React.Component {
  constructor(props) {
    super(props);
    let auth_ouname = Cookie.get('deptname').split('-')[1];
    this.state = {
      auth_ouname: auth_ouname,
      budgetValue: 0,
    }
  }
  columns1 = [
    { title: '培训级别', dataIndex: 'train_level' },
    { title: '课程名称/方向', dataIndex: 'class_name', },
    { title: '受训部门/岗位', dataIndex: 'train_person', },
    { title: '计划培训时长（小时）', dataIndex: 'train_hour', },
    { title: '培训类型', dataIndex: 'train_kind', },
    { title: '计划培训时间', dataIndex: 'train_time', },
    { title: '课程来源/师资', dataIndex: 'train_teacher', },
    { title: '责任部门', dataIndex: 'duty_dept', },
    { title: '费用预算（元）', dataIndex: 'train_fee', },
    { title: '学分值', dataIndex: 'class_grade', },
    { title: '培训组织机构', dataIndex: 'deptname', },
    { title: '备注', dataIndex: 'remark', },
  ];
  columns2 = [
    { title: '培训级别', dataIndex: 'train_level' },
    { title: '课程级别', dataIndex: 'class_level' },
    { title: '课程名称/方向', dataIndex: 'class_name', },
    { title: '受训部门/岗位', dataIndex: 'train_person', },
    { title: '计划培训时长（小时）', dataIndex: 'train_hour', },
    { title: '培训类型', dataIndex: 'train_kind', },
    { title: '课程来源/师资', dataIndex: 'train_teacher', },
    { title: '责任部门', dataIndex: 'duty_dept', },
    { title: '费用预算（元）', dataIndex: 'train_fee', },
    { title: '学分值', dataIndex: 'class_grade', },
    { title: '培训组织机构', dataIndex: 'deptname', },
    { title: '备注', dataIndex: 'remark', },
  ];
  columns3 = [
    { title: '培训级别', dataIndex: 'train_level' },
    { title: '课程级别', dataIndex: 'class_level' },
    { title: '课程名称/方向', dataIndex: 'class_name', },
    { title: '培训对象', dataIndex: 'train_group', },
    { title: '培训人数', dataIndex: 'train_person', },
    { title: '计划培训时长（小时）', dataIndex: 'train_hour', },
    { title: '培训类型', dataIndex: 'train_kind', },
    { title: '培训时间', dataIndex: 'train_time', },
    { title: '责任部门', dataIndex: 'duty_dept', },
    { title: '课程来源/师资', dataIndex: 'train_teacher', },
    { title: '费用预算（元）', dataIndex: 'train_fee', },
    { title: '学分值', dataIndex: 'class_grade', },
    { title: '培训组织机构', dataIndex: 'deptname', },
    { title: '备注', dataIndex: 'remark', },
  ];
  columns4 = [
    { title: '部门名称', dataIndex: 'dept_name' },
    { title: '认证名称', dataIndex: 'exam_name' },
    { title: '考试人员', dataIndex: 'exam_person_name', },
    { title: '报销标准', dataIndex: 'claim_fee', },
    { title: '计划考试时间', dataIndex: 'exam_time', },
    { title: '考试费预算', dataIndex: 'exam_fee', },
  ];

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  }
  //清空填写内容
  handleReset = () => {
  }


  render() {
    //样式
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

    //课程信息
    const { dataInfoList } = this.props;
    let budgetValueTemp = 0;
    if (dataInfoList && dataInfoList.length) {
      dataInfoList.map((i, index) => {
        i.key = index;
      });
      if (dataInfoList[0].if_budget === '1') {
        budgetValueTemp = 1;
      }
      if (dataInfoList[0].if_budget === '2') {
        budgetValueTemp = 2;
      }
    }

    //意见列表
    const { approvalHiList } = this.props;
    const hidataList = approvalHiList.map(item =>
      <FormItem label={item.task_name} hasFeedback {...formItemLayout}>
        <Input style={{ color: '#000' }} value={item.task_detail} disabled={true}></Input>
      </FormItem>
    );

    //列表显示
    const { apply_type } = this.props;
    let infoTitle = [];
    let infotype = '';
    if (apply_type === '1' || apply_type === '5') {
      infoTitle = this.columns1;
      infotype = '总院必修';
    } else if (apply_type === '2' || apply_type === '6') {
      infoTitle = this.columns2;
      infotype = '总院选修';
    } else if (apply_type === '3' || apply_type === '7') {
      infoTitle = this.columns3;
      infotype = '通用';
    } else if (apply_type === '4' || apply_type === '8') {
      infoTitle = this.columns4;
      infotype = '认证考试';
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>{new Date().getFullYear()}年{infotype}培训计划审批</h2></Row>
        <Card title="培训计划课程信息" className={styles.r}>
          <br />
          <Table
            columns={infoTitle}
            dataSource={dataInfoList}
            pagination={false}
          />
          <br />
          <Row span={24}>
            <span>预算情况：</span>
            <Radio.Group value={budgetValueTemp}>
              <Radio value={0}>未超预算</Radio>
              <Radio value={1}>超过预算</Radio>
              <Radio value={2}>未匹配经费前一事一议计划</Radio>
            </Radio.Group>
          </Row>
          <br />
        </Card>

        <Card title="审批信息">
          <span style={{ textAlign: 'center' }}>
            {hidataList}
          </span>
        </Card>

        <br /><br />
        <div style={{ textAlign: "center" }}>
          <Button onClick={this.gotoHome} type="dashed">关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.train_plan_approval_model,
    ...state.train_plan_approval_model
  };
}

train_plan_look = Form.create()(train_plan_look);
export default connect(mapStateToProps)(train_plan_look);
