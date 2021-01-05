/**
 * 作者：郭西杰
 * 邮箱：guoxj116@chinaunicom.cn
 * 创建日期：2020-06-15 
 * 文件说明：工会慰问审批
 */

import React, { Component } from "react";
import { Button, Select, Modal, message, Form, Row, Card, Col, Input } from "antd";
const FormItem = Form.Item;
const { TextArea } = Input;
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import styles from "./style.less";
import CheckFile from "./checkFile";

const Option = Select.Option;
class labor_sympathy_approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isSubmitClickable: true,
      isSaveClickable: true,
      isClickable: true,
      choiseOpinionFlag: "none",
      now_post_name: '',
      if_end_task: 0,
    }
  }
  //结束关闭
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/humanApp/laborSympathy/index'
    }));
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    let sympathyDataSource = this.props.applyPersonInfo;
    let committee_type1 = sympathyDataSource && sympathyDataSource[0] && sympathyDataSource[0].sympathy_type ? sympathyDataSource[0].sympathy_type : ''

    this.setState({ isClickable: false });
    this.setState({
      visible: false,
    });
    let orig_proc_inst_id = this.props.proc_inst_id;
    let orig_proc_task_id = this.props.proc_task_id;
    let orig_apply_task_id = this.props.apply_task_id;
    let apply_id = this.props.sympathy_apply_id;
    let approval_if = this.props.form.getFieldValue("rejectIf");
    let approval_advice = this.props.form.getFieldValue("rejectAdvice");
    let nextstepPerson = this.props.form.getFieldValue("nextstepPerson");
    let now_post_name = this.state.now_post_name;
    let nextpostid = this.state.next_post_id;
    const { dispatch } = this.props;
    return new Promise((resolve) => {
      dispatch({
        type: 'labor_sympathy_approval_model/laborSympathyApprovalSubmit',
        approval_if,
        apply_id,
        approval_advice,
        orig_proc_inst_id,
        orig_proc_task_id,
        orig_apply_task_id,
        nextstepPerson,
        nextpostid,
        now_post_name,
        committee_type1,
        resolve
      });
    }).then((resolve) => {
      if (resolve === 'success') {
        this.setState({ isClickable: true });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/laborSympathy/index'
          }));
        }, 500);
      }
      if (resolve === 'false') {
        this.setState({ isClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname: '/humanApp/laborSympathy/index'
      }));
    });
  }
  submitcheck = () => {
    let approval_if = this.props.form.getFieldValue("rejectIf");
    if (approval_if == '不同意') {
      this.setState({ isClickable: false });
      let orig_proc_inst_id = this.props.proc_inst_id;
      let orig_proc_task_id = this.props.proc_task_id;
      let orig_apply_task_id = this.props.apply_task_id;
      let apply_id = this.props.apply_task_id;
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
            type: 'labor_sympathy_approval_model/laborSympathyApprovalSubmit',
            approval_if,
            apply_id,
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
                pathname: '/humanApp/laborSympathy/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/laborSympathy/index'
          }));
        });
      }


    } else {
      /*最后一步*/
      if (this.state.if_end_task == '1') {
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
            type: 'labor_sympathy_approval_model/laborSympathyApprovalEnd',
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
                pathname: '/humanApp/laborSympathy/index'
              }));
            }, 500);
          }
          if (resolve === 'false') {
            this.setState({ isClickable: true });
          }
        }).catch(() => {
          dispatch(routerRedux.push({
            pathname: '/humanApp/laborSympathy/index'
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

  render() {
    const inputstyle = { color: '#000' };
    const { getFieldDecorator } = this.props.form;
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
    const { approvalNowList, approvalHiList, applyPersonInfo } = this.props;

    let applyInfo = {};
    if (applyPersonInfo.length > 0) {
      applyInfo = applyPersonInfo[0];
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
      if (approvalNowList[0].task_name == '接口人归档' || approvalNowList[0].task_name == '人力资源部归档'|| approvalNowList[0].task_name == '工会办理') {
        this.state.if_end_task = 1;
        nowdataList = '';
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

    //附件信息
    //获取下载文件列表
    let filelist = this.props.fileDataList;
    if (filelist && filelist.length > 0) {
      for (let i = 0; i < filelist.length; i++) {
        filelist[i].uid = i + 1;
        filelist[i].status = "done";
      }
    }
    return (
      <div>
        <br />
        <Row span={1} style={{ textAlign: 'center' }}>
          <h2><font size="6" face="arial">中国联通济南软件研究院</font></h2>
          <h2><font size="6" face="arial">工会会员慰问及困难帮扶申请单</font></h2></Row>
        <p style={{ textAlign: 'right' }}>申请日期：<span><u>{applyInfo.create_time}</u></span></p>
        <br></br>
        <Form>
          <Card title="申请信息" className={styles.r}>
            <Form style={{ marginTop: 10 }}>
              <Row gutter={12} >
                {/*姓名*/}
                <Col span={12} style={{ display: 'block' }}>
                  <FormItem label={'所在工会'} {...formItemLayout2}>
                    {getFieldDecorator('labor_name', {
                      initialValue: applyInfo.labor_name,
                    })(
                      <Input style={inputstyle} disabled={true} />
                    )}
                  </FormItem>
                </Col>
                {/*部门*/}
                <Col span={12} style={{ display: 'block' }}>
                  <FormItem label={'经办人'} {...formItemLayout3}>
                    {getFieldDecorator('create_person_name', {
                      initialValue: applyInfo.create_person_name,
                    })(<Input style={inputstyle} disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="申请类别" {...formItemLayout}>
                  {getFieldDecorator('sympathy_type', {
                    initialValue: applyInfo.sympathy_type,
                    rules: [{
                      required: true,
                      message: '',
                    }],
                  })
                    (<Input style={inputstyle} disabled={true} />)
                  }
                </FormItem>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="慰问对象" {...formItemLayout}
                >
                  {getFieldDecorator('sympathy_objects', {
                    rules: [{
                      required: true,
                      message: '请填写正确格式（不超过30字）',
                    }],
                    initialValue: applyInfo.sympathy_objects,
                  })
                    (
                      <Input style={inputstyle} disabled={true} />
                    )
                  }
                </FormItem>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="慰问标准" {...formItemLayout}>
                  {getFieldDecorator('sympathy_standard', {
                    rules: [{
                      required: true,
                      message: '请填写正确格式（不超过20字）',
                    }],
                    initialValue: applyInfo.sympathy_standard,
                  })
                    (<Input style={inputstyle} disabled={true} />)
                  }
                </FormItem>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="慰问事项简述" {...formItemLayout}
                >
                  {getFieldDecorator('sympathy_remarks', {
                    rules: [{
                      required: true,
                      message: '请填写正确格式（不超过300字）',
                    }],
                    initialValue: applyInfo.sympathy_remarks,
                    // initialValue: 'aaaa'
                  })
                    (
                      <Input style={inputstyle} disabled={true} />
                    )
                  }
                </FormItem>
              </Row>

              <Row style={{ textAlign: 'center' }}>
                <FormItem label="备注" {...formItemLayout}>
                  {getFieldDecorator('remarks', {
                    initialValue: applyInfo.remarks,
                  })
                    (<Input style={inputstyle} disabled={true} />)
                  }
                </FormItem>
              </Row>
            </Form>
          </Card>
          <Card title="查看申请附件"
            style={{ display: (filelist && filelist[0] && filelist[0].name) ? "" : "none" }}
          >
            <CheckFile filelist={filelist} />
          </Card>
          <Card title="审批信息">
            <span style={{ textAlign: 'left', color: '#000' }}>
              {hidataList}
              {nowdataList}
            </span>
          </Card>
          <br></br>
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
    loading: state.loading.models.labor_sympathy_approval_model,
    ...state.labor_sympathy_approval_model,
  };
}
labor_sympathy_approval = Form.create()(labor_sympathy_approval);
export default connect(mapStateToProps)(labor_sympathy_approval)

