/**
 * 文件说明：离职交接审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-06-14
 */
import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox } from 'antd';
import Cookie from 'js-cookie';
import message from "../../../components/commonApp/message";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class leave_hand_approval extends Component {
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
    }
  }

  //提交下一环节
  selectNext = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    //message.info(approval_if);
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
    let approval_type = '2';
    const { dispatch } = this.props;
    this.setState({
      visible: false,
    });
    if (approval_if === '不同意' && approval_advice === '') {
      this.setState({ isClickable: true });
      message.error('意见不能为空');
    } else {
      return new Promise((resolve) => {
        dispatch({
          type: 'leave_approval_model/submitApproval',
          approval_if,
          approval_advice,
          nextstepPerson,
          nextstep,
          orig_proc_inst_id,
          orig_proc_task_id,
          orig_apply_task_id,
          approval_type,
          create_person_id,
          resolve
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
  //清空填写内容
  handleReset = () => {
  }
  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/staffLeave_index'
    }));
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

    const formItemLayout2 = {
      labelCol: {
        sm: { span: 14 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };

    const formItemLayout3 = {
      labelCol: {
        sm: { span: 3 },
      },
      wrapperCol: {
        md: { span: 7 },//input框长度
      },
    };

    const { getFieldDecorator } = this.props.form;
    const { approvalApplyInfo } = this.props;
    let ApplyInfo = {};
    if (approvalApplyInfo != null && approvalApplyInfo != '' && approvalApplyInfo != undefined) {
      ApplyInfo = approvalApplyInfo[0];
    }
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
        initperson = create_person[0].create_person_name;
        nextdataList = create_person.map(item =>
          <Option value={item.create_person_id}>{item.create_person_name}</Option>
        );
      }
    }

    let nowdataList = '';
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
                <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" onChange={this.choiseOpinion}>
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
        <Input style={inputstyle} value={item.task_detail} disabled={true}></Input>
      </FormItem>
    );

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>工作交接清单</h1></Row>
        <br /><br />
        <Form>


          <Row gutter={12} >
            {/*姓名*/}
            <Col span={12} style={{ display: 'block' }}>
              <FormItem label={'移交人'} {...formItemLayout2}>
                <Input style={inputstyle} value={ApplyInfo.create_name} disabled={true} />
              </FormItem>
            </Col>
            {/*部门*/}
            <Col span={12} style={{ display: 'block' }}>
              <FormItem label={'部门'} {...formItemLayout3}>
                <Input style={inputstyle} value={ApplyInfo.create_dept} disabled={true} />
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col style={{ display: ApplyInfo.create_proj ? "block" : "none" }}>
              {/*项目组*/}
              <FormItem label={'项目组'} {...formItemLayout}>
                <Input style={inputstyle} value={ApplyInfo.create_proj} disabled={true} />
              </FormItem>
            </Col>
          </Row>
          <Row span={2} style={{ textAlign: 'center' }}>
          </Row>
          <br />
          <Row gutter={12} >
            {/*姓名*/}
            <Col span={12} style={{ display: 'block' }}>
              <FormItem label={'接收人'} {...formItemLayout2}>
                <Input style={inputstyle} value={ApplyInfo.hand_name} disabled={true} />
              </FormItem>
            </Col>
            {/*部门*/}
            <Col span={12} style={{ display: 'block' }}>
              <FormItem label={'部门'} {...formItemLayout3}>
                <Input style={inputstyle} value={ApplyInfo.hand_dept} disabled={true} />
              </FormItem>
            </Col>
          </Row>
          <Row >
            <Col style={{ display: ApplyInfo.create_proj ? "block" : "none" }}>
              {/*项目组*/}
              <FormItem label={'项目组'} {...formItemLayout}>
                <Input style={inputstyle} value={ApplyInfo.create_proj} disabled={true} />
              </FormItem>
            </Col>
          </Row>

          <Row span={2} style={{ textAlign: 'center' }}>
            <h3>-----------------------------------------------------------------------------------------------------------------------------------</h3>
          </Row>
          <br /><br />
          <Row style={{ textAlign: 'center' }}>
            <Col >
              <FormItem label="工作内容描述" {...formItemLayout} >
                <TextArea
                  style={{ minHeight: 32, color: '#000' }}
                  value={ApplyInfo.work_detail}
                  rows={4}
                  disabled='true'
                />
              </FormItem>
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Col>
              <FormItem label="交接清单" {...formItemLayout} >
                <TextArea
                  style={{ minHeight: 32, color: '#000' }}
                  value={ApplyInfo.hand_detail}
                  rows={4}
                  disabled='true'
                />
              </FormItem>
            </Col>
          </Row>

          <Row style={{ textAlign: 'center' }}>
            <Col >
              <FormItem label="其他问题" {...formItemLayout} >
                <TextArea
                  style={{ minHeight: 32, color: '#000' }}
                  value={ApplyInfo.other_question}
                  rows={4}
                  disabled='true'
                />
              </FormItem>
            </Col>
          </Row>

          <Row span={2} style={{ textAlign: 'center' }}>
            <h3>-----------------------------------------------------------------------------------------------------------------------------------</h3>
          </Row>
          <Row span={8} style={{ textAlign: 'center' }}><h3>以上说明及交接清单经移交人员和转接人员确认无误</h3></Row>
          <br /><br />

          <span style={{ textAlign: 'center' }}>
            {hidataList}
          </span>
          <span style={{ textAlign: 'center' }}>
            {nowdataList}
          </span>
        </Form>

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
                <Input value={this.state.nextstep} />
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
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.leave_approval_model,
    ...state.leave_approval_model
  };
}
leave_hand_approval = Form.create()(leave_hand_approval);
export default connect(mapStateToProps)(leave_hand_approval);
