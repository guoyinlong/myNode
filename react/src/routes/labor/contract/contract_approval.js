/**
 * 作者：王福江
 * 创建日期：2019-09-12
 * 邮箱：wangfj80@chinaunicom.cn
 * 功能：合同续签审批
 */
import React, { Component } from "react";
import { Button, Row, Form, Input, Card, Table, Select, message, Col, Checkbox, Modal } from "antd";
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

import { connect } from "dva";
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import styles from "../../overtime/style.less";

class contract_approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choiseOpinionFlag: "none",
      isClickable: true,
      visible: false,
      visible2: false,
      visible3: true,
      nextstep: '',
      endstepflag: false,
      dataListScore: [],
      dataListScoreResult: [],
    };
  }
  columns = [
    { title: '序号', dataIndex: 'key' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    {
      title: '部门名称', dataIndex: 'dept_name',
      render: (text, record, index) => {
        return (record.dept_name.split('-')[1]);
      }
    },
    { title: '项目组名称', dataIndex: 'team_name' },
    { title: '合同类型', dataIndex: 'contract_type' },
    { title: '合同期限（月）', dataIndex: 'contract_time' },
    { title: '起始日期', dataIndex: 'start_time' },
    { title: '截止日期', dataIndex: 'end_time' },
    { title: '已签合同数', dataIndex: 'sign_number' },
    { title: '距离合同续签天数', dataIndex: 'end_day' },
    { title: '是否通过', dataIndex: 'if_pass' }
  ];
  columns2 = [
    { title: '序号', dataIndex: 'key' },
    { title: '员工编号', dataIndex: 'user_id' },
    { title: '员工姓名', dataIndex: 'user_name' },
    {
      title: '出勤情况', dataIndex: 'attendence', render: (text, record) => (
        <span>
          <Select placeholder="请选择" defaultValue='10' size="large"
            onSelect={(value) => this.changeSelectValue(value, record, 'attendence')}
          >
            <Option value='10'>10</Option>
            <Option value='9'>9</Option>
            <Option value='8'>8</Option>
            <Option value='7'>7</Option>
            <Option value='6'>6</Option>
            <Option value='5'>5</Option>
            <Option value='4'>4</Option>
            <Option value='3'>3</Option>
            <Option value='2'>2</Option>
            <Option value='1'>1</Option>
          </Select>
        </span>
      )
    },
    {
      title: '专业水平', dataIndex: 'major', render: (text, record) => (
        <span>
          <Select placeholder="请选择" defaultValue='10' size="large"
            onSelect={(value) => this.changeSelectValue(value, record, 'major')}>
            <Option value='10'>10</Option>
            <Option value='9'>9</Option>
            <Option value='8'>8</Option>
            <Option value='7'>7</Option>
            <Option value='6'>6</Option>
            <Option value='5'>5</Option>
            <Option value='4'>4</Option>
            <Option value='3'>3</Option>
            <Option value='2'>2</Option>
            <Option value='1'>1</Option>
          </Select>
        </span>
      )
    },
    {
      title: '工作态度', dataIndex: 'attitude', render: (text, record) => (
        <span>
          <Select placeholder="请选择" defaultValue='10' size="large"
            onSelect={(value) => this.changeSelectValue(value, record, 'attitude')}>
            <Option value='10'>10</Option>
            <Option value='9'>9</Option>
            <Option value='8'>8</Option>
            <Option value='7'>7</Option>
            <Option value='6'>6</Option>
            <Option value='5'>5</Option>
            <Option value='4'>4</Option>
            <Option value='3'>3</Option>
            <Option value='2'>2</Option>
            <Option value='1'>1</Option>
          </Select>
        </span>
      )
    },
    {
      title: '工作质量', dataIndex: 'quality', render: (text, record) => (
        <span>
          <Select placeholder="请选择" defaultValue='10' size="large"
            onSelect={(value) => this.changeSelectValue(value, record, 'quality')}>
            <Option value='10'>10</Option>
            <Option value='9'>9</Option>
            <Option value='8'>8</Option>
            <Option value='7'>7</Option>
            <Option value='6'>6</Option>
            <Option value='5'>5</Option>
            <Option value='4'>4</Option>
            <Option value='3'>3</Option>
            <Option value='2'>2</Option>
            <Option value='1'>1</Option>
          </Select>
        </span>
      )
    },
    {
      title: '工作业绩描述', dataIndex: 'description', render: (text, record) => (
        <span>
          <input style={{ width: 300 }}
            onChange={(value) => this.changeInputValue(value, record, 'description')} />
        </span>
      )
    }
  ];
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

  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/staffLeave_index'
    }));
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
    let approval_type = '4';
    let contractlist = this.state.dataListScore;
    let if_score = this.state.visible3;

    //console.log("contractlist==="+JSON.stringify(contractlist));
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
          type: 'leave_approval_model/submitApprovalContract',
          approval_if,
          approval_advice,
          nextstepPerson,
          nextstep,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approval_type,
          create_person_id,
          resolve,
          contractlist,
          if_score
        });
      }).then((resolve) => {
        if (resolve === 'success') {
          this.setState({ isClickable: true });
          setTimeout(() => {
            dispatch(routerRedux.push({
              pathname: '/humanApp/labor/staffLeave_index'
            }));
          }, 500);
        }
        if (resolve === 'false') {
          this.setState({ isClickable: true });
        }
      }).catch(() => {
        dispatch(routerRedux.push({
          pathname: '/humanApp/labor/staffLeave_index'
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

  //取消弹窗
  handleCancel2 = (e) => {
    //this.state.dataListScoreResult = this.state.dataListScore;
    //console.log("this.state.dataListScoreResult==="+JSON.stringify(this.state.dataListScoreResult));
    for (let i = 0; i < this.state.dataListScore.length; i++) {
      let datascore = this.state.dataListScore[i];
      let addnum = 0;
      if (datascore.major < 8) addnum++;
      if (datascore.attitude < 8) addnum++;
      if (datascore.quality < 8) addnum++;
      if (datascore.attendence < 8) addnum++;

      if (addnum >= 2) {
        this.state.dataListScore[i]["if_pass"] = '不通过';
      } else {
        this.state.dataListScore[i]["if_pass"] = '通过';
      }
    }

    this.setState({
      visible2: false,
    });
  }

  changeSelectValue = (value, record, colType) => {
    this.state.dataListScore[record.key - 1][colType] = value;
    //console.log(value.target.value);
    //console.log(record);
    //console.log(colType);
    //console.log("this.state.dataListScore==="+JSON.stringify(this.state.dataListScore));
  }
  changeInputValue = (value, record, colType) => {
    this.state.dataListScore[record.key - 1][colType] = value.target.value;
    //console.log("this.state.dataListScore==="+JSON.stringify(this.state.dataListScore));
  }

  //审批人提交
  gotowork = () => {
    this.setState({
      visible2: true,
    });
  }
  //审批人提交
  submit = () => {

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
    //信息
    const { dataInfoList } = this.props;
    this.state.dataListScore = dataInfoList;
    //意见列表
    const { approvalHiList, approvalNowList } = this.props;
    //下一环节
    const { nextPersonList } = this.props;
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
      if (create_person.length) {
        initperson = create_person[0].create_person_id;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }

    let nowdataList = '';
    //console.log('this.state.nextstep==='+this.state.nextstep);
    //console.log('approvalNowList==='+JSON.stringify(approvalNowList));
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
    if (approvalHiList.length !== 0) {
      this.state.visible3 = "none";
    }

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>合同续签审批</h2></Row>
        <Card title="合同信息列表" className={styles.r}>
          <div className={styles.btnLayOut} style={{ display: this.state.visible3 }}>
            <Button type="primary" onClick={() => this.gotowork()}>{'劳动期满工作评议'}</Button>
            &nbsp;&nbsp;&nbsp;
          </div>
          <br />
          <Table
            columns={this.columns}
            dataSource={this.state.dataListScore}
            pagination={false}
          />
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

        <Modal
          title="合同期满员工工作评议"
          visible={this.state.visible2}
          width={'1200px'}
          footer={[
            <Button key="submit" type="primary" size="large" onClick={this.handleCancel2}>
              确定
            </Button>
          ]}
        >
          <div>
            <Form>
              <span>
                工作内容及表现：<br />
                请对下列情况做评分（每项分值为1至10分，分数越高越好）<br />
                说明：以下打分，6分以下为表现不合格，6分-7分为表现一般，8分为良好，9分为好，10分为优秀。<br />
                有两项以上（含）打分为7分以下（含7分）者，不予续聘，须解除劳动合同。<br />
              </span>
              <br />
              <Table
                columns={this.columns2}
                dataSource={this.state.dataListScore}
                pagination={false}
              />
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.loading.models.leave_approval_model,
    ...state.leave_approval_model
  };
}
contract_approval = Form.create()(contract_approval);
export default connect(mapStateToProps)(contract_approval);
