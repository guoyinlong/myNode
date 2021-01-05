/**
 * 文件说明：查看未提交的工作交接
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox,message,Table} from 'antd';
import { connect } from 'dva';
import Cookie from "js-cookie";
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
import {routerRedux} from "dva/router";


class CheckworkHandover extends Component {
  constructor (props) {
    super(props);
    let dept_name = Cookie.get('dept_name');
    let user_name = Cookie.get('username');
    this.state = {
      visible:false,
      send_Flag:false,
      recv_Flag:true,
      send_teamleader_Flag:true,
      send_leader_Flag:true,
      recv_leader_Flag:true,
      staffname: "",
      staffdept:"",
      position:"",
      recv_staffname: "",
      recv_staffdept:"",
      recv_position:"",
      work_Content:"",
      handList:"",
      otherQuestion:"",
      isClickable:true,
      isSubmitClickable:true,
      isSaveClickable:true,
      dept_name:dept_name,
      staff_name:user_name,
    }
  }


  //当前时间
  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}-${month<10?`0${month}`:`${month}`}-${date<10?`0${date}`:`${date}`}`
  }

  //提交申请信息
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    let formWorkDetail = formData.work_detail;
    let formHandDetail = formData.hand_detail;
    let formOtherQuestion = formData.other_question;
    if( formWorkDetail.length > 300 || formHandDetail.length > 300 || formOtherQuestion.length > 300 ){
      message.error("字数超限，最多200个汉字！");
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log("err");
      } else {
        this.setState({
          visible: true,
        });
      }
      console.log('Received values of form: ', values);
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  //清空填写内容
  handleReset = () => {
    this.props.form.resetFields();
  }


  /**提交工作交接信息 */
  handleOk = (e) => {
    
    let formData = this.props.form.getFieldsValue();
    const{dispatch} = this.props;
    


    let query ={
      nextStepPersonID : formData.hand_person
    };
    /** 查询填写的下一步接收人的ID与姓名是否一致*/

    console.log("查询人"+query.nextStepPersonID);
    console.log("查询交接人");

    //add by jintingzhai
    const roleFlag = this.props.roleFlag;
    let if_fun = '0';
    if(roleFlag === '3' || roleFlag === '2'){
      if_fun = '1';
    }else{
      if_fun = '0';
    }

    //查询填写的下一步接收人的ID与姓名是否一致
    return new Promise((resolve) => {
      dispatch({
        type : 'staff_leave_index_model/personInfoQuery',
        query : query,
        resolve
      });
    }).then((resolve) => {
      console.log("jinru");
      console.log(resolve+"hahaahahah")
      if(resolve === 'success')
      {
        const nextPersonInfo = this.props.personInfoDetail;
        //规整姓名,去掉带有括号的人员，
        let formPersonName = nextPersonInfo[0].username.replace(/\(.*?\)/g,'');
        if(formPersonName === formData.hand_name && formPersonName !== this.state.staff_name){
          let basicHandOverData = {};
          //离职交接申请ID
          let leave_hand_id = formData.leave_hand_id;
          
          
          //封装离职信息传给后台
          basicHandOverData["arg_leave_hand_id"] = leave_hand_id;
          basicHandOverData["arg_create_person"] = formData.create_person;
          basicHandOverData["arg_create_name"] = formData.create_name;
          basicHandOverData["arg_create_dept"] = formData.create_dept;
          basicHandOverData["arg_create_proj"] = formData.create_proj;
          basicHandOverData["arg_create_time"] = '';
          basicHandOverData["arg_hand_person"] = formData.hand_person;
          basicHandOverData["arg_hand_name"] = formData.hand_name;
          basicHandOverData["arg_hand_dept"] = formData.hand_dept;
          basicHandOverData["arg_hand_proj"] = formData.hand_proj;
          basicHandOverData["arg_work_detail"] = formData.work_detail;
          basicHandOverData["arg_hand_detail"] = formData.hand_detail;
          basicHandOverData["arg_other_question"] = formData.other_question;
          basicHandOverData["arg_status"] = '1';
          //overwrite by jintingzhai
          basicHandOverData["arg_if_func"] = if_fun;
          /*封装基本信息，即leave_hand表数据 end */

          /*封装审批信息，即leave_hand_approval表数据,申请人创建环节自动完成 begin */
          let approvalData = {};
          approvalData["arg_leave_hand_id"] = leave_hand_id;
          /*封装审批意见，创建人：自动填充审批意见为空，审批人*/
          approvalData["arg_user_id"] = formData.create_person;
          approvalData["arg_user_name"] = formData.create_name;
          approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
          approvalData["arg_comment_detail"] = '';
          approvalData["arg_comment_time"] = this.getCurrentDate();
          approvalData["arg_state"] = '1';
          /*封装审批信息，即leave_approval表数据 end */

          /*封装下一环节审批信息，即leave_approval表数据,下一环节 begin */
          let approvalDataNext = {};
          approvalDataNext["arg_leave_hand_id"] = leave_hand_id;
          /*下一环节处理人为项目经理，直接在存储过程中写死*/
          approvalDataNext["arg_user_id"] = formData.hand_person;
          approvalDataNext["arg_user_name"] = formData.hand_name;
          approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
          approvalDataNext["arg_comment_detail"] = '';
          approvalDataNext["arg_comment_time"] = '';
          approvalDataNext["arg_state"] = '2';
          /*封装审批信息，即leave_hand_approval表数据， 下一环节end */



          console.log(basicHandOverData+"1");
          console.log(approvalData+"2");
          console.log(approvalDataNext+"3");
          console.log(leave_hand_id+"4");
          //提交审批信息
          
          return new Promise((resolve) => {
            dispatch({
              type:'staff_leave_index_model/leaveHandSubmit',
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
          message.error("您填写的接收人姓名与HR编号不符");
          return ;
        }
      }
      if(resolve === 'false')
      {
        console.log("------------------------------");
        message.error("请核对您输入的接收人信息：HR编号否正确，HR编号与接收人姓名是否一致，请修正后重新提交！");
      }
    }).catch(() => {
      this.setState({
        isSubmitClickable: true
      });
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'
      }));
    });

  } 

   //返回按钮
  goBack = () =>{
    history.back();
  }

  /**工作交接信息保存 
   * TODO 缺少校验
  */
  // savehandApply =() =>{
  //   this.setState({
  //     isSaveClickable: false
  //   });
    
  //   const{dispatch} = this.props;
  //   let formData = this.props.form.getFieldsValue();
  //   //add by jintingzhai
  //   const roleFlag = this.props.roleFlag;
  //   let if_fun = '0';
  //   if(roleFlag === '3' || roleFlag === '2'){
  //     if_fun = '1';
  //   }else{
  //     if_fun = '0';
  //   }
    
  //   //封装基本信息
  //   let basicHandOverData = {};
  //   let leave_hand_id = formData.leave_hand_id;
  //   basicHandOverData["arg_leave_hand_id"]= formData.leave_hand_id;
  //   basicHandOverData["arg_create_person"]= formData.create_person;
  //   basicHandOverData["arg_create_name"]=formData.create_name;
  //   basicHandOverData["arg_create_dept"]=formData.create_dept;
  //   basicHandOverData["arg_create_proj"]=formData.create_proj;
  //   basicHandOverData["arg_create_time"]='';
  //   basicHandOverData["arg_hand_person"]=formData.hand_person;
  //   basicHandOverData["arg_hand_name"] =formData.hand_name;
  //   basicHandOverData["arg_hand_dept"] = formData.hand_dept;
  //   basicHandOverData["arg_hand_proj"] = formData.hand_proj;
  //   basicHandOverData["arg_work_detail"]=formData.work_detail;
  //   basicHandOverData["arg_hand_detail"]=formData.hand_detail;
  //   basicHandOverData["arg_other_question"]=formData.other_question;
  //   basicHandOverData["arg_status"] = '0';
  //   //overwrite by jintingzhai
  //   basicHandOverData["arg_if_func"] = if_fun;

  //   console.log("保存信息"+basicHandOverData);

  //   /**保存信息 */
  //   //提交基本信息
  //   return new Promise((resolve) => {
  //     dispatch({
  //       type:'createLeaveModels/leaveHandSave',
  //       basicHandOverData,
  //       leave_hand_id,
  //       resolve
  //     });
  //   }).then((resolve) => {
  //     if(resolve === 'success')
  //     {
  //       this.setState({
  //         isSaveClickable: true,
  //         visible: false,
  //       });
  //       setTimeout(() => {
  //         dispatch(routerRedux.push({
  //           pathname:'/humanApp/labor/staffLeave_index'
  //         }));
  //         },500);
  //     }
  //     if(resolve === 'false')
  //     {
  //       this.setState({
  //         isSaveClickable: true,
  //         visible: false,
  //       });
  //       setTimeout(() => {
  //         dispatch(routerRedux.push({
  //           pathname:'/humanApp/labor/staffLeave_index'
  //         }));
  //         },500);
  //     }
  //   }).catch(() => {
  //     this.setState({
  //       isSaveClickable: true,
  //       visible: false,
  //     });
  //     dispatch(routerRedux.push({
  //       pathname:'/humanApp/labor/staffLeave_index'
  //     }));
  //   });

  // }

  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('handworkPrint').innerHTML;
    window.print();
    window.location.reload();
  }


  render() {

    const {leaveHandInfo} = this.props;

    const {approvalInfoDone} = this.props;
    const {  form } = this.props;
    const { getFieldDecorator } = form;

    /**已办的查看页面，只需要显示已经审批的意见，没有的不用显示*/
    /**提交功能的（页面） TODO 直接用金亭那边的*/




    if(Cookie.get('userid')===leaveHandInfo.create_person){
      //如果是本人
      this.state.send_Flag = false;
      console.log("本人");
    }else{
      //如果是审核人
      this.state.send_Flag = true;
      console.log("审核人");
    }

    console.log("leaveHandInfo"+leaveHandInfo);
    

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

      /**封装审批完成的意见(页面) */
      let approvalInfoDoneHtml = approvalInfoDone.map(item=>
        <div>
        <Row gutter={12}>
          <Col>
            <div>
              <Col span="14" offset="4">
                  <label>{item.task_name}： </label>
                  <label>{item.task_detail}</label>
                </Col>
              </div>
          </Col>
        </Row>
        {leaveHandInfo.status==='0'?
        null
        :
        <br></br>
        }   
      </div>
      );

    


    

    

   
    





    return (
      <div>
      
        
        <Form>
        <div >
        <Row span={2} style={{ textAlign: 'center' }}><h1>工作交接清单</h1></Row>
        <br/><br/>
        {/**隐藏域----------------------开始 */}
          <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout3} style={{display:"none"}}>
              {getFieldDecorator('leave_hand_id',{
                initialValue:leaveHandInfo.leave_hand_id
              })(<Input style={{color:'#000'}} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row>

        <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout3} style={{display:"none"}}>
              {getFieldDecorator('create_person',{
                initialValue:leaveHandInfo.create_person
              })(<Input style={{color:'#000'}} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row>

        {/* <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout3} style={{display:"none"}}>
              {getFieldDecorator('hand_person',{
                initialValue:leaveHandInfo.hand_person
              })(<Input placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row> */}

        {/* <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout3} style={{display:"none"}}>
              {getFieldDecorator('if_func',{
                initialValue:leaveHandInfo.if_func
              })(<Input style={{color:'#000'}} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row> */}
        {/**隐藏域-----------------  结束 */}

        <Row  gutter={12} >
            {/*姓名*/}
            <Col span={12} style={{ display : 'block' }}>
              
              <FormItem label={'姓名'} {...formItemLayout2}>
                {getFieldDecorator('create_name',{
                  initialValue:leaveHandInfo.create_name
                })(<Input style={{color:'#000'}} placeholder = '' disabled={true}/>)}
              </FormItem>
              
              
            </Col>
            {/*部门*/}
            <Col span={12} style={{ display : 'block' }}>
              
              <FormItem label={'部门'} {...formItemLayout3}>
                {getFieldDecorator('create_dept',{
                  initialValue: leaveHandInfo.create_dept
                })(<Input style={{color:'#000'}} placeholder = '' disabled={true}/>)}
              </FormItem>
              
              
            </Col>
          </Row>
          {leaveHandInfo.status==='0'?
          null
          :
          <br></br>
          }
          <Row >
            <Col style={{ display : leaveHandInfo.create_proj===null||leaveHandInfo.create_proj===undefined||leaveHandInfo.create_proj===''? "none":"block" }}>
              {/*项目组*/}
              
              <FormItem label={'项目组'} {...formItemLayout}>
              {getFieldDecorator('create_proj',{
                initialValue:leaveHandInfo.create_proj,
              })(<Input style={{color:'#000'}} placeholder ='' disabled={true} />)}
              </FormItem>
              
            </Col>
          </Row>
          <br/>

          {leaveHandInfo.status==='0'?
          <Row span={2} style={{ textAlign: 'center' }}>
            <h3>-----------------------------------------------------------------------------------------------------------------------------------</h3>
          </Row>
          :
          null
          }

          <Row >
            <Col >
              {/*工作描述*/}
              <FormItem label="工作内容描述" {...formItemLayout} >
                {getFieldDecorator('work_detail',{
                  initialValue:leaveHandInfo.work_detail,
                  rules: [
                    {
                      required: true,
                      message: '请描述主要工作内容(200字以内)'
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="主要工作内容(200字以内)"
                    rows={4}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          {leaveHandInfo.status==='0'?
          null
        :
          <br></br>
        }

          <Row >
            <Col>
              {/*交接清单*/}
              <FormItem label="交接清单" {...formItemLayout} >
                {getFieldDecorator('hand_detail',{
                  initialValue:leaveHandInfo.hand_detail,
                  rules: [
                    {
                      required: true,
                      message: '描述交接清单(200字以内)！'
                    },
                  ],
                })(
                  <TextArea
                    style={{ minHeight: 32 }}
                    placeholder="交接清单(200字以内)"
                    rows={4}
                  />
                )}
              </FormItem>
            </Col>
          </Row>

          {leaveHandInfo.status==='0'?
          null
        :
          <br></br>
        }

          <Row >
          <Col >
            {/*其他问题*/}
            
            <FormItem label="其他问题" {...formItemLayout} >
              {getFieldDecorator('other_question',{
                initialValue:leaveHandInfo.other_question,
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
        
        {leaveHandInfo.status==='0'?
          null
        :
          <br></br>
        }

         {/** TODO----------------------- 以下循环显示已经审批完的意见,除了状态为未提交的，其他情况都显示审批意见-------------*/}
          {
            leaveHandInfo.status==='0'?
              <br></br>
            :
              approvalInfoDoneHtml
          }
          </div>

          {/** 1.没提交的工作交接，不用显示审批意见，只显示保存、返回和提交
              2.其余的情况，（1审批中，2审批完成，3驳回）只显示返回和打印
          */}
          {
            leaveHandInfo.status ==='0'?  //没提交的工作交接，不用显示审批意见，只显示保存、返回和提交
              <div>
                <Row>
                <Col span={24} style={{ textAlign: 'center' }}>
                  <Button onClick={this.goBack}>返回</Button>
                  {/* &nbsp;&nbsp;&nbsp;&nbsp;
                  <Button onClick={this.savehandApply} disabled={!this.state.isSaveClickable}>{this.state.isSaveClickable ? '保存' : '正在处理中...'}</Button> */}
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
                          <Input style={{color:'#000'}} value = "交接人审批" disabled={true}/>
                        </FormItem>
                        <FormItem label={'接收人姓名'} {...formItemLayout}>
                          {getFieldDecorator('hand_name',{
                            initialValue: leaveHandInfo.hand_name,
                            rules: [
                              {
                                required: false,
                                pattern: /^[\u4e00-\u9fa5]{2,9}$/,
                                message: "接收人姓名输入不合法！",
                              },
                            ],
                          })(
                            <Input placeholder = "接收人姓名" disabled={false}/>
                          )}
                        </FormItem>
                        <FormItem label={'接收人HR编号'} {...formItemLayout}>
                          {getFieldDecorator('hand_person',{
                            initialValue: leaveHandInfo.hand_person,
                            rules: [
                              {
                                required: false,
                                pattern: /^\d{7}$/,
                                message: "HR编号输入不合法！",
                              },
                            ],
                          })(
                            <Input placeholder = "接收人HR编号（与HR编号一致）" disabled={false}/>
                          )}
                        </FormItem>
                        <FormItem label={'接收人部门'} {...formItemLayout} >
                          {getFieldDecorator('hand_dept',{
                            initialValue:this.state.dept_name
                          })(<Input style={{color:'#000'}} placeholder ='' disabled={true}/>)}
                        </FormItem>
                        <FormItem label={'接收人项目组'} {...formItemLayout} style={{ display : "none" }}>
                        {/* <FormItem label={'接收人项目组'} {...formItemLayout} style={{ display : leaveHandInfo.create_proj===null||leaveHandInfo.create_proj===undefined||leaveHandInfo.create_proj===''? "none":"none" }}> */}
                          {getFieldDecorator('hand_proj',{
                            initialValue:leaveHandInfo.hand_proj
                          })(<Input placeholder ='' />)}
                        </FormItem>
                      </Form>
                    </div>
                  </Modal>
                </Col>
              </Row>
              </div>
            
            :
            <Row>
              <Col span={24} style={{ textAlign: 'center' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.goBack}>返回</Button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.print.bind(this)}>打印</Button>
              </Col>
            </Row>
          }
          
         
          <br/><br/>
        </Form>
      </div>
      
    );
  }
}


function mapStateToProps(state) {

  return {
    loading: state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model
  };
}
CheckworkHandover = Form.create()(CheckworkHandover);
export default connect(mapStateToProps)(CheckworkHandover)
