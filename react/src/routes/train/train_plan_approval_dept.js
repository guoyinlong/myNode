/**
 * 文件说明：培训计划审批
 * 作者：王福江
 * 邮箱：wangfj80@chinaunicom.cn
 * 创建日期：2019-07-14
 */
import React, { Component } from "react";
import { Form, Card, Row, Col, Input, Button, Modal, Select, Table } from 'antd';
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import Cookie from 'js-cookie';
import styles from './trainPlanChangeBasicInfo.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class train_plan_approval_dept extends Component {
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
      if_budget: '',
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
  //提交下一环节
  selectNext = () => {
    console.log("------------------------------------");
    console.log(this.props);
    console.log("------------------------------------");

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

  //提交弹窗
  handleOk = (e) => {
    const { trainType } = this.props;

    this.setState({ isClickable: false });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let create_person_id = this.props.create_person_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let nextstep = this.state.nextstep;
    let approval_type = trainType;
    let if_budget = this.props.if_budget;

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
  //结束关闭
  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/train/train_do'
    }));
  };

  columns = [
    {
      title: '名称',
      dataIndex: 'module',
      width: '15%',
      render: (value, row, index) => {
        return {
          children: value,
          props: { rowSpan: row.rowSpan },
        };
      },
    },
    {
      title: '调整项',
      dataIndex: 'modifyItem',
      width: '15%',
      render: (value, row, index) => {
        if (row.is_diff === '1') {
          return (<div style={{ color: 'red', textAlign: 'left' }}>{value}</div>);
        } else {
          return (<div style={{ textAlign: 'left' }}>{value}</div>);
        }
      }
    },
    {
      title: '原值',
      dataIndex: 'oldValue',
      width: '30%',
      render: (value, row, index) => {
        if ('isTextArea' in row && row.isTextArea === '1') {
          return (
            <TextArea
              value={value}
              autosize={{ minRows: 2, maxRows: 6 }}
              disabled={true}
              className={styles.textAreaStyle}>
            </TextArea>
          )
        } else {
          return (<div style={{ textAlign: 'left' }}>{value}</div>);
        }
      }
    },
    {
      title: '新值',
      dataIndex: 'newValue',
      width: '30%',
      render: (value, row, index) => {
        if (row.is_diff === '1') {
          if ('isTextArea' in row && row.isTextArea === '1') {
            return (
              <TextArea
                value={value}
                autosize={{ minRows: 2, maxRows: 6 }}
                disabled={true}
                style={{ color: 'red' }}
              />
            )
          } else {
            return (<div style={{ color: 'red', textAlign: 'left' }}>{value}</div>);
          }

        } else {
          if ('isTextArea' in row && row.isTextArea === '1') {
            return (
              <TextArea
                value={value}
                autosize={{ minRows: 2, maxRows: 6 }}
                disabled={true}
                style={{ color: 'black' }}
              />
            )
          } else {
            return (<div style={{ textAlign: 'left' }}>{value}</div>);
          }
        }
      }
    }
  ];

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataInfoList, changeReason, trainType } = this.props;

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
      if (create_person.length) {
        initperson = create_person[0].create_person_id;
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
            <FormItem style={{ textAlign: 'left' }} label={item.task_name} {...formItemLayout}>
              {getFieldDecorator('rejectIf', {
                initialValue: "同意",
              })(
                <Select size="large" style={{ width: 200 }} placeholder="请选择审批意见" disabled={false} onChange={this.choiseOpinion}>
                  <Option value="同意">同意</Option>
                  <Option value="不同意">不同意</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label="审批驳回意见" {...formItemLayout} style={{ display: this.state.choiseOpinionFlag, textAlign: 'left' }}>
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


    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h2>{new Date().getFullYear()}年 {trainType === '1' ? '全院必修' : (trainType === '2' ? '全院选修' : trainType === '3' ? '通用' : trainType === '4' ? '认证考试' : '')}计划调整审批</h2></Row>

        <p>当前申请环节：<span>审批</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{Cookie.get('username')}</span></p>
        <br></br>
        <div style={{ marginLeft: 20 }}>
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>调整原因：</span>
          <TextArea
            value={changeReason}
            autosize={{ minRows: 1, maxRows: 4 }}
            style={{ width: '90%', verticalAlign: 'top', color: 'black' }}
            disabled={true}
          >
          </TextArea>
        </div>
        <br />

        <Table dataSource={dataInfoList}
          columns={this.columns}
          pagination={false}
          className={styles.fullCostDeptTable}
        />

        <br />

        <Card title="审批信息">
          <span style={{ textAlign: 'left' }}>
            {hidataList}
          </span>
          <span style={{ textAlign: 'left' }}>
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

train_plan_approval_dept = Form.create()(train_plan_approval_dept);
export default connect(mapStateToProps)(train_plan_approval_dept);
