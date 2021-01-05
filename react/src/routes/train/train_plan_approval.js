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

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class train_plan_approval extends React.Component {
  constructor(props) {
    super(props);
    let auth_ouname = Cookie.get('deptname').split('-')[1];
    this.state = {
      auth_ouname: auth_ouname,
      choiseOpinionFlag: "none",
      isClickable: true,
      visible: false,
      nextstep: '',
      endstepflag: false,
      budgetValue: 0,
    }
  }
  columns1 = [
    { title: '培训级别', dataIndex: 'train_level' },
    { title: '课程名称/方向', dataIndex: 'class_name', },
    { title: '受训部门/岗位', dataIndex: 'train_person', },
    { title: '计划培训时长（小时）', dataIndex: 'train_hour', },
    { title: '培训类型', dataIndex: 'train_kind', },
    { title: '赋分规则', dataIndex: 'assign_score' },
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
    { title: '赋分规则', dataIndex: 'assign_score' },
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
    { title: '赋分规则', dataIndex: 'assign_score' },
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
  //提交下一环节
  selectNext = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");

    if (approval_if === '不同意') {
      this.setState({
        nextstep: "驳回至申请人",
      });
    } else {
      this.setState({
        nextstep: "",
      });
    }
    this.setState({
      visible: true,
    });

    const { dataInfoList } = this.props;
    if (dataInfoList && dataInfoList.length) {
      if (dataInfoList[0].if_budget === '1' || dataInfoList[0].if_budget === 1) {
        this.setState({
          budgetValue: 1
        });
      }
    }


  }
  //提交弹窗
  handleOk = (e) => {
    this.setState({ isClickable: false });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let create_person_id = this.props.create_person_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextstep = this.state.nextstep;
    let approval_type = this.props.apply_type;

    let if_budget = this.state.budgetValue;

    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    if (approval_if === '不同意' && approval_advice === '') {
      this.setState({ isClickable: true });
      //message.error('意见不能为空');
    } else {
      return new Promise((resolve) => {
        dispatch({
          type: 'train_plan_approval_model/submitApproval',
          approval_if,
          approval_advice,
          nextstepPerson,
          nextstep,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approval_type,
          create_person_id,
          if_budget,
          resolve
        });
      }).then((resolve) => {
        if (resolve === 'success') {
          this.setState({ isClickable: true });
          setTimeout(() => {
            dispatch(routerRedux.push({
              pathname: '/humanApp/train/train_do'
            }));
          }, 500);
        }
        if (resolve === 'false') {
          this.setState({ isClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname: '/humanApp/train/train_do'
        }));
      });
    }
  }
  //取消弹窗
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  //清空填写内容
  handleReset = () => {
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

  render() {
    const { getFieldDecorator } = this.props.form;
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
    const { approvalHiList, approvalNowList } = this.props;
    //下一环节
    const { nextPersonList } = this.props;
    console.log("nextPersonList===" + nextPersonList);
    let initperson = '';
    let nextdataList = '';
    if (this.state.nextstep !== '驳回至申请人') {
      if (nextPersonList.length) {
        this.state.nextstep = nextPersonList[0].submit_post_name;
        initperson = nextPersonList[0].submit_user_id;
        nextdataList = nextPersonList.map(item =>
          <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
        );
      }
    } else {
      const { create_person } = this.props;
      console.log("create_person===" + create_person);
      if (create_person.length) {
        initperson = create_person[0].create_person_id;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }
    let nowdataList = '';
    console.log('this.state.nextstep===' + this.state.nextstep);
    console.log('approvalNowList===' + JSON.stringify(approvalNowList));
    if (approvalNowList.length > 0 && approvalNowList[0].task_name.endsWith("归档")) {
      nowdataList = '';
    } else {
      if (this.state.nextstep.endsWith("结束")) {
        nowdataList = '';
      } else {
        nowdataList = approvalNowList.map(item =>
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
      }
    }
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
          <span style={{ textAlign: 'center' }}>
            {nowdataList}
          </span>
        </Card>

        <br /><br />
        <div style={{ textAlign: "center" }}>
          <Button onClick={this.gotoHome} type="dashed">关闭</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
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
                <Input style={{ color: '#000' }} value={this.state.nextstep} disabled={true} />
              </FormItem>
              <FormItem label={'下一处理人'} {...formItemLayout}>
                {getFieldDecorator('nextstepPerson', {
                  initialValue: initperson
                })(
                  <Select size="large" style={{ width: '100%' }} initialValue={initperson} placeholder="请选择负责人">
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
    loading: state.loading.models.train_plan_approval_model,
    ...state.train_plan_approval_model
  };
}

train_plan_approval = Form.create()(train_plan_approval);
export default connect(mapStateToProps)(train_plan_approval);
