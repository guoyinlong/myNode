/**
 * 文件说明：创建新加班审批流程
 * 作者：翟金亭
 * 邮箱：zhaijt3@chinaunicom.cn
 * 创建日期：2019-06-20
 */
import React, { Component } from 'react';
import {Form, Row, Col, Input, Button, Select, Modal, message} from 'antd';
import Cookie from "js-cookie";
import {connect} from "dva";
import {routerRedux} from "dva/router";

const FormItem = Form.Item;
const { TextArea } = Input;

class workHandover extends Component {
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    this.state = {
      visible:false,
      staff_name:user_name,
      dept_name:dept_name,
      user_id:user_id,
      dept_id:dept_id,
      isSubmitClickable:true,
      isSaveClickable:true,
      leave_hand_apply_id_save:'',
    }
  }
  //当前时间
  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month<10?`0${month}`:`${month}`}-${date<10?`0${date}`:`${date}`}`
  }

  //点击提交按钮弹框显示选择接收人姓名，接收人ID
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    let formWorkDetail = formData.workContent;
    let formHandDetail = formData.handList;
    let formOtherQuestion = formData.otherQuestion;
    if( formWorkDetail.length > 300 || formHandDetail.length > 300 || formOtherQuestion.length > 300 ){
      message.error("字数超限，最多200个汉字！");
      return;
    }
    this.props.form.validateFields((err)=> {
      if (err) {
        message.error("请填写必填项");
        this.setState({
          isSubmitClickable: true
        });
      } else {
          this.setState({
            visible: true,
          });
      }
    })
  }

  //保存
  saveLeaveInfo = () => {
    this.setState({
      isSaveClickable: false
    });
    const{dispatch} = this.props;

    let formData = this.props.form.getFieldsValue();
    let formCreatPersonProj = formData.create_project;
    let formWorkDetail = formData.workContent;
    let formHandDetail = formData.handList;
    let formOtherQuestion = formData.otherQuestion;

    if( formWorkDetail.length > 300 || formHandDetail.length > 300 || formOtherQuestion.length > 300 ){
      message.error("字数超限，最多200个汉字！");
      this.setState({
        isSaveClickable: true
      });
      return;
    }
    //封装基本信息
    let basicHandOverData = {};
    //离职交接申请ID
    let leave_hand_id = '';
    //如果已经存在保存状态的申请，将该申请的saveTaskId赋值给leave_apply_id
    if(this.state.leave_hand_apply_id_save !== '')
    {
      leave_hand_id = this.state.leave_hand_apply_id_save;
    }
    //新建离职申请，创建ID
    else {
      leave_hand_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
    }
    //封装离职信息传给后台
    basicHandOverData["arg_leave_hand_id"] = leave_hand_id;
    basicHandOverData["arg_create_person"] = this.state.user_id;
    basicHandOverData["arg_create_name"] = this.state.staff_name;
    basicHandOverData["arg_create_dept"] = this.state.dept_name;
    basicHandOverData["arg_create_proj"] = formCreatPersonProj;
    basicHandOverData["arg_create_time"] = this.getCurrentDate();
    basicHandOverData["arg_work_detail"] = formWorkDetail;
    basicHandOverData["arg_hand_detail"] = formHandDetail;
    basicHandOverData["arg_other_question"] = formOtherQuestion;
    basicHandOverData["arg_status"] = '0';
    basicHandOverData["arg_if_func"] = '0';
    /*封装基本信息，即leave_hand表数据 end */

    //提交基本信息
    return new Promise((resolve) => {
      dispatch({
        type:'createLeaveModels/leaveHandSave',
        basicHandOverData,
        leave_hand_id,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({
          leave_hand_apply_id_save: leave_hand_id,
          isSubmitClickable: true,
          visible: false,
        });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
          },500);
      }
      if(resolve === 'false')
      {
        this.setState({
          isSubmitClickable: true,
          visible: false,
        });
        setTimeout(() => {
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
          },500);
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'
      }));
    });
  };

  //提交
  handleOk = () => {
    const{dispatch} = this.props;
    let formData = this.props.form.getFieldsValue();
    let nextStepPersonName = formData.nextStepPersonName;
    let nextStepPersonID = formData.nextStepPersonID;
    let formHandPersonDept = formData.hand_dept;
    let formHandPersonProj = formData.hand_project;
    let formCreatPersonProj = formData.create_project;
    let formWorkDetail = formData.workContent;
    let formHandDetail = formData.handList;
    let formOtherQuestion = formData.otherQuestion;

    const roleFlag = this.props.roleFlag;
    let if_fun = '0';
    if(roleFlag === '3' || roleFlag === '2'){
      if_fun = '1';
    }else{
      if_fun = '0';
    }
    let query = {
      nextStepPersonID : nextStepPersonID,
    };

    //查询填写的下一步接收人的ID与姓名是否一致
    return new Promise((resolve) => {
      dispatch({
        type : 'createLeaveModels/personInfoQuery',
        query : query,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        const nextPersonInfo = this.props.personInfoDetail;
        //规整姓名,去掉带有括号的人员，
        let formPersonName = nextPersonInfo[0].username.replace(/\(.*?\)/g,'');
        if(formPersonName === nextStepPersonName && formPersonName !== this.state.staff_name){
          let basicHandOverData = {};
          //离职交接申请ID
          let leave_hand_id = '';
          let saveHnadTaskId = this.props.saveHnadTaskId;
          //如果已经存在保存状态的申请，将该申请的saveTaskId赋值给leave_apply_id
          if(saveHnadTaskId !== null && saveHnadTaskId !== '' && saveHnadTaskId !== undefined)
          {
            leave_hand_id = saveHnadTaskId;
          }
          else if(this.state.leave_hand_apply_id_save !== '')
          {
            leave_hand_id = this.state.leave_hand_apply_id_save;
          }
          //新建离职申请，创建ID
          else {
            leave_hand_id = this.state.user_id + Number(Math.random().toString().substr(3,7) + Date.now()).toString(32);
          }
          //封装离职信息传给后台
          basicHandOverData["arg_leave_hand_id"] = leave_hand_id;
          basicHandOverData["arg_create_person"] = this.state.user_id;
          basicHandOverData["arg_create_name"] = this.state.staff_name;
          basicHandOverData["arg_create_dept"] = this.state.dept_name;
          basicHandOverData["arg_create_proj"] = formCreatPersonProj;
          basicHandOverData["arg_create_time"] = this.getCurrentDate();
          basicHandOverData["arg_hand_person"] = nextStepPersonID;
          basicHandOverData["arg_hand_name"] = formPersonName;
          basicHandOverData["arg_hand_dept"] = formHandPersonDept;
          basicHandOverData["arg_hand_proj"] = formHandPersonProj;
          basicHandOverData["arg_work_detail"] = formWorkDetail;
          basicHandOverData["arg_hand_detail"] = formHandDetail;
          basicHandOverData["arg_other_question"] = formOtherQuestion;
          basicHandOverData["arg_status"] = '1';
          basicHandOverData["arg_if_func"] = if_fun;
          /*封装基本信息，即leave_hand表数据 end */

          /*封装审批信息，即leave_hand_approval表数据,申请人创建环节自动完成 begin */
          let approvalData = {};
          approvalData["arg_leave_hand_id"] = leave_hand_id;
          /*封装审批意见，创建人：自动填充审批意见为空，审批人*/
          approvalData["arg_user_id"] = this.state.user_id;
          approvalData["arg_user_name"] = this.state.staff_name;
          approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
          approvalData["arg_comment_detail"] = '';
          approvalData["arg_comment_time"] = this.getCurrentDate();
          approvalData["arg_state"] = '1';
          /*封装审批信息，即leave_approval表数据 end */

          /*封装下一环节审批信息，即leave_approval表数据,下一环节 begin */
          let approvalDataNext = {};
          approvalDataNext["arg_leave_hand_id"] = leave_hand_id;
          /*下一环节处理人为项目经理，直接在存储过程中写死*/
          approvalDataNext["arg_user_id"] = nextStepPersonID;
          approvalDataNext["arg_user_name"] = nextStepPersonName;
          approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
          approvalDataNext["arg_comment_detail"] = '';
          approvalDataNext["arg_comment_time"] = '';
          approvalDataNext["arg_state"] = '2';
          /*封装审批信息，即leave_hand_approval表数据， 下一环节end */

          //提交审批信息
          return new Promise((resolve) => {
            dispatch({
              type:'createLeaveModels/leaveHandSubmit',
              basicHandOverData,
              approvalData,
              approvalDataNext,
              leave_hand_id,
              resolve
            });
          }).then((resolve) => {
            if(resolve === 'success')
            {
              this.setState({
                leave_hand_apply_id_save: leave_hand_id,
                isSubmitClickable: true,
                visible: false,
              });
              setTimeout(() => {
                dispatch(routerRedux.push({
                  pathname:'/humanApp/labor/staffLeave_index'
                }));
              },500);
            }
            if(resolve === 'false')
            {
              this.setState({
                isSubmitClickable: true,
                visible: false,
              });
              setTimeout(() => {
                dispatch(routerRedux.push({
                  pathname:'/humanApp/labor/staffLeave_index'
                }));
              },500);
            }
          }).catch(() => {
            dispatch(routerRedux.push({
              pathname:'/humanApp/labor/staffLeave_index'
            }));
          });
        }else if(formPersonName === this.state.staff_name)
        {
          message.error("交接人不可以是本人！");
          return ;
        }else{
          message.error("您填写的接收人姓名与HR编号不符！");
          return ;
        }
      }
      if(resolve === 'false')
      {
        message.error("请核对您输入的接收人信息：HR编号否正确，HR编号与接收人姓名是否一致，请修正后重新提交！");
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'
      }));
    });
  };

  //取消
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const inputstyle = {color:'#000'};
    const { form } = this.props;
    const { getFieldDecorator } = form;

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
    const roleFlag = this.props.roleFlag;
    const projInfo = this.props.projInfo;

    const projName = projInfo[0] ? projInfo[0].proj_name : null;

    return (
      <div>
        <Row span={2} style={{ textAlign: 'center' }}><h1>工作交接清单</h1></Row>
        <br/><br/>
        <Form>
          <Row  gutter={12} >
            {/*姓名*/}
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'姓名'} {...formItemLayout2}>
                {getFieldDecorator('staff_name',{
                  initialValue:this.state.staff_name
                })(<Input style={inputstyle} placeholder = '' disabled={true}/>)}
              </FormItem>
            </Col>
            {/*部门*/}
            <Col span={12} style={{ display : 'block' }}>
              <FormItem label={'部门'} {...formItemLayout3}>
                {getFieldDecorator('dept_name',{
                  initialValue: this.state.dept_name
                })(<Input style={inputstyle} placeholder = '' disabled={true}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row >
            <Col style={{ display : roleFlag === '3' ? "none":"block" }}>
              {/*项目组*/}
              <FormItem label={'项目组'} {...formItemLayout}>
                {getFieldDecorator('create_project',{
                  initialValue:projName,
                })(<Input  style={inputstyle} placeholder ='' disabled={true} />)}
              </FormItem>
            </Col>
          </Row>
          <br/>
          <Row span={2} style={{ textAlign: 'center' }}>
            <h3>-----------------------------------------------------------------------------------------------------------------------------------</h3></Row>
          <br/><br/>
          <Row style={{ textAlign: 'center' }}>
            <Col >
              {/*工作描述*/}
              <FormItem label="工作内容描述" {...formItemLayout} >
                {getFieldDecorator('workContent',{
                  initialValue:'',
                  rules: [
                    {
                      required: true,
                      message: '请描述您的主要工作内容(200字以内)'
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请描述您的主要工作内容(200字以内)"
                    rows={4}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ textAlign: 'center' }}>
            <Col>
              {/*交接清单*/}
              <FormItem label="交接清单" {...formItemLayout} >
                {getFieldDecorator('handList',{
                  initialValue:'',
                  rules: [
                    {
                      required: true,
                      message: '描述交接清单(200字以内)！'
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="描述交接清单(200字以内)"
                    rows={4}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          <Row style={{ textAlign: 'center' }}>
          <Col >
            {/*其他问题*/}
            <FormItem label="其他问题" {...formItemLayout} >
              {getFieldDecorator('otherQuestion',{
                initialValue:'',
                rules: [
                  {
                    required: true,
                    message: '其他方面的补充(200字以内)'
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="其他方面的补充(200字以内)"
                  rows={4}
                  disabled={this.state.send_Flag}
                />
              )}
            </FormItem>
          </Col>
        </Row>
          <br/><br/>

          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Button onClick={this.saveLeaveInfo} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable ? '提交' : '正在处理中...'}</Button>
                <Modal
                title="流程处理"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
                <div>
                  <Form>
                    <FormItem label={'下一步环节'} {...formItemLayout}>
                      {getFieldDecorator('nextStep',{
                        initialValue:'交接人审批'
                      })(<Input placeholder = "交接人审批" disabled={true}/>)}
                    </FormItem>
                    <FormItem label={'接收人姓名'} {...formItemLayout}>
                      {getFieldDecorator('nextStepPersonName',{
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                            pattern: /^[\u4e00-\u9fa5]{2,9}$/,
                            message: "接收人姓名输入不合法！",
                          },
                        ],
                      })(
                        <Input placeholder = "接收人姓名（与HR编号一致）" disabled={false}/>
                      )}
                    </FormItem>
                    <FormItem label={'接收人HR编号'} {...formItemLayout}>
                      {getFieldDecorator('nextStepPersonID',{
                        initialValue: '',
                        rules: [
                          {
                            required: false,
                            pattern: /^\d{7}$/,
                            message: "HR编号输入不合法！",
                          },
                        ],
                      })(
                        <Input placeholder = "接收人HR编号" disabled={false}/>
                      )}
                    </FormItem>
                    <FormItem label={'接收人部门'} {...formItemLayout} >
                      {getFieldDecorator('hand_dept',{
                        initialValue:this.state.dept_name
                      })(<Input placeholder ='' disabled={true}/>)}
                    </FormItem>
                    {/* <FormItem label={'接收人项目组'} {...formItemLayout} style={{ display : roleFlag === '3' ? "none":"none" }}> */}
                    <FormItem label={'接收人项目组'} {...formItemLayout} style={{ display :  "none" }}>
                      {getFieldDecorator('hand_project',{
                        initialValue:''
                      })(<Input placeholder ='' />)}
                    </FormItem>
                  </Form>
                </div>
              </Modal>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading.models.createLeaveModels,
    ...state.createLeaveModels,
  };
}

workHandover = Form.create()(workHandover);
export default connect(mapStateToProps)(workHandover)

