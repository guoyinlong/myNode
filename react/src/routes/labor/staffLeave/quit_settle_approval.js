/**
 * 作者：晏学义
 * 日期：2019-06-25
 * 邮箱：yanxy65@chinaunicom.cn
 * 功能：离职清算审批
 */
import React, { Component } from "react";
import { Button, Card, Form, Input, Row, Select, Table, Col, message, DatePicker, Modal } from "antd";
import { connect } from "dva/index"
import { routerRedux } from "dva/router";
import Cookie from "js-cookie";
import moment from 'moment'

const FormItem = Form.Item;
const Option = Select.Option;

class QuitSettleApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClickable: true,
      sign: '',
      visible: false,
    };
  }

  gotoHome = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/labor/staffLeave_index'
    }));
  };
  getCurrentDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`
  }
  onChange(e) {
    this.setState({
      sign: e.target.value
    })
  }
  renderContent = (value) => {
    return {
      children: value,
      props: {},
    };
  };
  columns = [{
    title: '交接部门',
    dataIndex: 'dept_name',
    render: (value) => {
      return {
        children: value,
        props: {},
      };
    },
  }, {
    title: '交接手续',
    dataIndex: 'task_name',
    render: this.renderContent,
  }, {
    title: '办理人',
    dataIndex: 'user_name',
    render: (value) => {
      return {
        children: value,
        props: {},
      };
    },
  }, {
    title: '办理人签字',
    dataIndex: 'user_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      /* return input组件还是 return文本 */
      if (row.isEdit === '1') {
        return <Input placeholder="办理人签字" name="user_sign" onChange={this.onChange.bind(this)} />;
      }
      return obj;
    },
  }];

  columns1 = [{
    title: '交接部门',
    dataIndex: 'dept_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptnameRowSpan;
      return obj;
    },
  }, {
    title: '交接手续',
    dataIndex: 'task_name',
    render: this.renderContent,
  }, {
    title: '办理人',
    dataIndex: 'user_name',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.usernameRowSpan;
      return obj;
    },
  }, {
    title: '办理人签字',
    dataIndex: 'user_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.usersignRowSpan;
      return obj;
    },
  }, {
    title: '部门经理',
    dataIndex: 'dept_mgr',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptmgrRowSpan;
      return obj;
    },
  }, {
    title: '部门经理签字',
    dataIndex: 'dept_mgr_sign',
    render: (value, row) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.deptmgrsignRowSpan;
      return obj;
    },
  }];

  submitNext = (e) => {
    // 当前离职员工是否已完成项目团队退出流程 0:否，1：是
    let quitTeamInfo = this.props.quitTeamInfo;
    let quitTeam = this.props.quitTeam;
    if (quitTeam === '1') {
      this.setState({
        isClickable: false,
        visible: true
      })
    } else {
      message.info(quitTeamInfo);
      return;
    }
  }
  handleOk = (e) => {
    /* 调用审批服务 */
    this.setState({
      visible: false
    });
    let formData = this.props.form.getFieldsValue();
    let taskRecord = this.props.taskRecord;
    let create_person_id = taskRecord.create_person_id
    let theEnd = this.props.theEnd;
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let approval_advice = this.state.sign;
    let core_post = formData.core_post;
    let org_leave_time = formData.leaveConfirmTime.format("YYYY-MM-DD");

    const { dispatch } = this.props;
    let userName = Cookie.get('username');
    let i = Cookie.get('username').indexOf("(");
    if (i > -1) {
      userName = userName.substring(0, i);
    }
    if ((approval_advice === '' || approval_advice === null || approval_advice.indexOf(userName) <= -1) && theEnd !== '1') {
      message.error("办理人签字为空或者与签字信息未包含办理人姓名");
      this.setState({
        isClickable: true
      });
      return;
    }

    return new Promise((resolve) => {
      dispatch({
        type: 'quit_settle_approval_model/quitSettleApproval',
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        org_leave_time,
        theEnd,
        core_post,
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
      this.setState({ isClickable: true });
      dispatch(routerRedux.push({
        pathname: '/humanApp/labor/staffLeave_index'
      }));
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      isClickable: true,
    });
  };

  render() {
    const inputstyle = { color: '#000' };
    const { getFieldDecorator } = this.props.form;
    let theEnd = this.props.theEnd;
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
    let taskRecord = this.props.taskRecord;
    let dataSource = this.props.dataSource;
    let leaveConfirmTime = this.props.leaveTime;
    let currentDate = this.getCurrentDate();

    function disabledDate(current) {
      let leaveTime = '';
      if (leaveConfirmTime !== '') {
        leaveTime = `${leaveConfirmTime[0].total_year}-${leaveConfirmTime[0].total_month < 10 ? `0${leaveConfirmTime[0].total_month}` : `${leaveConfirmTime[0].total_month}`}-01`
      } else {
        leaveTime = this.getCurrentDate()
      }
      return current && current < moment(leaveTime).endOf('month');
    }
    return (
      <div>
        <br />
        <p>当前处理环节：<span>{taskRecord.step}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          当前处理人：<span>{taskRecord.user_name}</span></p>
        <br />
        <Row span={2} style={{ textAlign: 'center' }}><h2>{taskRecord.task_name}审批表</h2></Row>
        <br />
        <Card title="基本信息" >
          <Form style={{ marginTop: 10 }}>
            <Row gutter={12} >
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="姓    名" {...formItemLayout}>
                  {getFieldDecorator('user_name', {
                    initialValue: taskRecord.create_name
                  })
                    (<Input style={inputstyle} placeholder='' disabled={true} />)
                  }
                </FormItem>
              </Col>
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="所在部门" {...formItemLayout}>
                  {getFieldDecorator('deptname', {
                    initialValue: taskRecord.deptName
                  })
                    (<Input style={inputstyle} placeholder='' disabled={true} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12} >
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="项目组" {...formItemLayout}>
                  {getFieldDecorator('create_proj', {
                    initialValue: taskRecord.create_proj
                  })
                    (<Input style={inputstyle} placeholder='' disabled={true} />)
                  }
                </FormItem>
              </Col>
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="计划离职日期" {...formItemLayout}>
                  {getFieldDecorator('leave_time', {
                    initialValue: taskRecord.leave_time
                  })
                    (<Input style={inputstyle} placeholder='' disabled={true} />)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={12} >
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="工作岗位" {...formItemLayout}>
                  {getFieldDecorator('position_title', {
                    initialValue: taskRecord.position_title
                  })
                    (<Input style={inputstyle} placeholder='' disabled={true} />)
                  }
                </FormItem>
              </Col>
              <Col span={12} style={{ display: 'block' }}>
                <FormItem label="是否核心岗位" {...formItemLayout}>
                  {getFieldDecorator('core_post', {
                    initialValue: taskRecord.core_post
                  })(
                    <Select size="large" style={{ width: '100%', color: '#000' }} disabled={true}>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="审批信息" >
          {
            theEnd === "1"
              ?
              <Table dataSource={dataSource} columns={this.columns1} pagination={false}> </Table>
              :
              <Table dataSource={dataSource} columns={this.columns} pagination={false}> </Table>
          }
        </Card>
        <Card title="操作" >
          <div style={{ textAlign: "center" }}>
            <Button onClick={this.gotoHome} type="dashed">关闭</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={theEnd === '1' ? this.submitNext : this.handleOk} disabled={!this.state.isClickable}>{this.state.isClickable ? '提交' : '正在处理中...'}</Button>
          </div>
        </Card>
        { /* 当前日期是否已做完变动统计维护，如未做完:0，则开放人力资源专员选择离职时间权限，如做完了:1，则不可选离职时间，默认当前时间为离职时间。*/}
        <Modal
          title="选择离职时间"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div>
            <Form>
              <FormItem label={'离职时间'} {...formItemLayout}>
                {getFieldDecorator('leaveConfirmTime', {
                  initialValue: moment(currentDate, 'YYYY-MM-DD'),
                  rules: [
                    {
                      required: true,
                      message: '请选择离职时间'
                    },
                  ],
                })(
                  <DatePicker
                    placeholder="离职时间"
                    disabledDate={disabledDate}
                    format="YYYY-MM-DD"
                    placeholder="入职日期"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                    disabled={false}
                  />
                )}
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
    loading: state.loading.models.quit_settle_approval_model,
    ...state.quit_settle_approval_model
  };
}

QuitSettleApproval = Form.create()(QuitSettleApproval);
export default connect(mapStateToProps)(QuitSettleApproval);
