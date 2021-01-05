/**
 * 文件说明：查看未提交的离职申请
 * 作者：师庆培
 * 邮箱：shiqp3@chinaunicom.cn
 * 创建日期：2019-06-27
 */
import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Select, Modal, Checkbox,Table} from 'antd';
import Cookie from "js-cookie";
import { connect } from 'dva';
import {OU_XIAN_NAME_CN,OU_HQ_NAME_CN} from "../../../utils/config";
import styles from './index.less';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {routerRedux} from "dva/router";
moment.locale('zh-cn');

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;


class CheckLeave extends Component {
  constructor (props) {
    super(props);
    let user_name = Cookie.get('username');
    let user_id = Cookie.get('userid');
    let dept_id = Cookie.get('dept_id');
    let dept_name = Cookie.get('dept_name');
    let auth_ouname = Cookie.get('OU');
    this.state = {
      visible:false,
      ouflag:auth_ouname,
      staff_name:user_name,
      dept_name:dept_name,
      user_id:user_id,
      dept_id:dept_id,
      isSubmitClickable:true,
      isSaveClickable:true,
      leave_apply_id_save:'',
      itemInfoFlag:false
    }
  }

  //当前时间
  getCurrentDate(){
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return `${year}年${month<10?`0${month}`:`${month}`}月${date<10?`0${date}`:`${date}`}日`
  }
  //比较日期
  diffDate(date1,date2){
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    if(oDate1.getTime() > oDate2.getTime()){
      return true;
    } else {
      return false;
    }
  }

  //点击提交按钮弹框显示选择下一处理人
  selectNext = () => {
    let formData = this.props.form.getFieldsValue();
    this.props.form.validateFields((err)=> {
      if (err) {
        message.error("请填写必填项");
        this.setState({
          isSubmitClickable: true
        });
      } else {
        console.log(formData.start_time+'9999');
        let startTime = formData.start_time.format("YYYY-MM-DD");
        let endTime = formData.leave_time.format("YYYY-MM-DD");
/*        //离职日期不能大于当前日期
        if(this.diffDate(endTime,currentDate)){
          message.error('离职日期不能大于当前日期');
          this.setState({ isSubmitClickable: true });
          return;
        }*/
        //离职日期不能小于入职日期
        if(this.diffDate(startTime,endTime)){
          message.error('离职日期不能小于入职日期');
          this.setState({ isSubmitClickable: true });
          return;
        }else {
          this.setState({
            visible: true,
          });
        }
      }
    })

  }

  //返回按钮
  goBack = () =>{
    history.back();
  }

  //提交离职申请信息
  handleOk = () => {
    this.setState({
      visible: false,
      isSubmitClickable: false
    });
    const{dispatch} = this.props;
    //必填数据都已填写
    let formData = this.props.form.getFieldsValue();
    let nextStepPersonId = formData.nextStepPerson;

    console.log(formData.length);
    console.log(nextStepPersonId);
    console.log(formData.dept_name);
    console.log("formData.company_reason"+formData.company_reason);
    console.log("formData"+formData);
    //格式化离职原因（公司、个人）
    let company_reason_temp = '';
    for(let i=0; i<formData.company_reason.length; i++){
      company_reason_temp += formData.company_reason[i]+',';
    }
    let self_reason_temp = '';
    for(let i=0; i<formData.self_reason.length; i++){
      self_reason_temp += formData.self_reason[i]+',';
    }

    company_reason_temp = company_reason_temp.substring(0,company_reason_temp.length-1);
    self_reason_temp = self_reason_temp.substring(0,self_reason_temp.length-1);

    //格式化入职、离职日期格式
    if(formData.leave_time){
      formData.leave_time = formData.leave_time.format("YYYY-MM-DD");
    }
    if(formData.start_time){
      formData.start_time = formData.start_time.format("YYYY-MM-DD");
    }

    /*封装基本信息，即leave_apply表数据 begin */
    let basicLeaveData = {};
    //离职申请ID
    let leave_apply_id = formData.leave_apply_id;



    //封装离职信息传给后台
    basicLeaveData["arg_leave_apply_id"] = leave_apply_id;
    basicLeaveData["arg_dept_id"] = formData.dept_id;
    basicLeaveData["arg_dept_name"] = formData.dept_name;
    basicLeaveData["arg_create_person_id"] = formData.create_person_id;
    basicLeaveData["arg_create_person_name"] = formData.create_person_name;
    basicLeaveData["arg_create_time"] = this.getCurrentDate();
    basicLeaveData["arg_status"] = '1';
    /*入职时间改成字符串类型*/
    basicLeaveData["arg_start_time"] = formData.start_time;
    /*离职时间改成字符串类型*/
    basicLeaveData["arg_leave_time"] = formData.leave_time;
    basicLeaveData["arg_contact"] = formData.contact;
    basicLeaveData["arg_leave_type"] = formData.leave_type;
    basicLeaveData["arg_company_reason"] = company_reason_temp;
    basicLeaveData["arg_self_reason"] = self_reason_temp;
    basicLeaveData["arg_other_reason"] = formData.other_reason;
    basicLeaveData["arg_leave_gone"] = formData.leave_gone;
    basicLeaveData["arg_dept_advice"] = formData.dept_advice;
    basicLeaveData["arg_company_advice"] = formData.company_advice;
    basicLeaveData["arg_self_advice"] = formData.self_advice;
    basicLeaveData["arg_position_title"] = formData.position_title;
    basicLeaveData["arg_position_level"] = formData.position_level;
    /*封装基本信息，即leave_apply表数据 end */

    /*封装审批信息，即leave_approval表数据,申请人创建环节自动完成 begin */
    let approvalData = {};
    approvalData["arg_leave_apply_id"] = leave_apply_id;
    /*封装审批意见，创建人：自动填充审批意见为空，审批人*/
    approvalData["arg_user_id"] = formData.create_person_id;
    approvalData["arg_user_name"] = formData.create_person_name;
    approvalData["arg_post_id"] = '9ca4d30fb3b311e6b01d02429ca3c6ff';
    approvalData["arg_comment_detail"] = '';
    approvalData["arg_comment_time"] = this.getCurrentDate();
    approvalData["arg_state"] = '1';
    /*封装审批信息，即leave_approval表数据 end */

    /*封装下一环节审批信息，即leave_approval表数据,下一环节 begin */
    let approvalDataNext = {};
    approvalDataNext["arg_leave_apply_id"] = leave_apply_id;
    /*下一环节处理人为项目经理，直接在存储过程中写死*/
    approvalDataNext["arg_user_id"] = nextStepPersonId;
    approvalDataNext["arg_user_name"] = '';
    approvalDataNext["arg_post_id"] = '9cc97a9cb3b311e6a01d02429ca3c6ff';
    approvalDataNext["arg_comment_detail"] = '';
    approvalDataNext["arg_comment_time"] = '';
    approvalDataNext["arg_state"] = '2';
    /*封装审批信息，即leave_approval表数据， 下一环节end */


    console.log('fff'+formData.leave_type);
    console.log(basicLeaveData);
    console.log(approvalData);
    console.log(approvalDataNext);
    console.log(leave_apply_id);

    console.log("提交"+"---");
    /**TODO  把下面的代码放开 */   
    return new Promise((resolve) => {
      dispatch({
        type:'staff_leave_index_model/staffLeaveSubmit',
        basicLeaveData,
        approvalData,
        approvalDataNext,
        leave_apply_id,
        resolve
      });
    }).then((resolve) => {
      if(resolve === 'success')
      {
        this.setState({ leave_apply_id_save: leave_apply_id });
        this.setState({ isSubmitClickable: true });
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
      }
      if(resolve === 'false')
      {
        this.setState({ leave_apply_id_save: leave_apply_id });
        this.setState({ isSubmitClickable: true });
        
          dispatch(routerRedux.push({
            pathname:'/humanApp/labor/staffLeave_index'
          }));
      }
    }).catch(() => {
      console.log("异常");
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave_index'
      }));
    });
  }
  //选择下一环节处理人，取消
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      isSubmitClickable: true
    });
  }

  //保存信息
  saveLeaveInfo = () =>{
    console.log("保存");
    this.setState({
      isSaveClickable: false
    });
    const{dispatch} = this.props;
    this.props.form.validateFields((err)=>{
      if(err){
        message.error("请填写必填项");
        this.setState({ isSaveClickable: true });
      }
      else{
        let formData = this.props.form.getFieldsValue();

    //格式化离职原因（公司、个人）
    let company_reason_temp = '';
    for(let i=0; i<formData.company_reason.length; i++){
      company_reason_temp += formData.company_reason[i]+',';
    }
    let self_reason_temp = '';
    for(let i=0; i<formData.self_reason.length; i++){
      self_reason_temp +=  formData.self_reason[i] + ',';
    }

    //格式化入职、离职日期格式
    if(formData.leave_time){
      formData.leave_time = formData.leave_time.format("YYYY-MM-DD");
    }
    if(formData.start_time){
      formData.start_time = formData.start_time.format("YYYY-MM-DD");
    }

    /*封装基本信息，即leave_apply表数据 begin */
    let basicLeaveData = {};
    //离职申请ID
    let leave_apply_id = formData.leave_apply_id;
    

    //封装离职信息传给后台
    basicLeaveData["arg_leave_apply_id"] = leave_apply_id;
    basicLeaveData["arg_dept_id"] = formData.dept_id;
    basicLeaveData["arg_dept_name"] = formData.dept_name;
    basicLeaveData["arg_create_person_id"] = formData.create_person_id;
    basicLeaveData["arg_create_person_name"] = formData.create_person_name;
    basicLeaveData["arg_create_time"] = this.getCurrentDate();
    basicLeaveData["arg_status"] = '0';
    /*入职时间改成字符串类型*/
    basicLeaveData["arg_start_time"] = formData.start_time;
    /*离职时间改成字符串类型*/
    basicLeaveData["arg_leave_time"] = formData.leave_time;
    basicLeaveData["arg_contact"] = formData.contact;
    basicLeaveData["arg_leave_type"] = formData.leave_type;
    basicLeaveData["arg_company_reason"] = company_reason_temp;
    basicLeaveData["arg_self_reason"] = self_reason_temp;
    basicLeaveData["arg_other_reason"] = formData.other_reason;
    basicLeaveData["arg_leave_gone"] = formData.leave_gone;
    basicLeaveData["arg_dept_advice"] = formData.dept_advice;
    basicLeaveData["arg_company_advice"] = formData.company_advice;
    basicLeaveData["arg_self_advice"] = formData.self_advice;
    basicLeaveData["arg_position_title"] = formData.position_title;
    basicLeaveData["arg_position_level"] = formData.position_level;
    /*封装基本信息，即leave_apply表数据 end */
    console.log("保存，，，，");
    
    return new Promise((resolve) => {
      dispatch({
        type:'createLeaveModels/leaveApprovalSave',
        basicLeaveData,
        leave_apply_id,
        resolve
      });
      console.log("jinlai");
    }).then((resolve) => {
      console.log("hahaahah");
      if(resolve === 'success')
      {
        this.setState({ isSaveClickable: true });
      }
      if(resolve === 'false')
      {
        this.setState({ isSaveClickable: true });
      }
    }).catch(() => {
      dispatch(routerRedux.push({
        pathname:'/humanApp/labor/staffLeave/staffLeave_index'}));
    });
      }
    })
  };


  //打印
  print = () => {
    window.document.body.innerHTML = window.document.getElementById('leavePrint').innerHTML;
    window.print();
    window.location.reload();
  }

  render() {
    const inputstyle = {color:'#000'};
    const {leaveApplyInfo} = this.props;

    let start_time = '';
    let leave_time = '';
    if(leaveApplyInfo !== null && leaveApplyInfo !== '' && leaveApplyInfo !== undefined)
    {
      if(leaveApplyInfo.start_time !== null && leaveApplyInfo.start_time !== '' && leaveApplyInfo.start_time !== undefined)
      {
        start_time = leaveApplyInfo.start_time.split(' ')[0];
        leave_time = leaveApplyInfo.leave_time.split(' ')[0];
      }
    }
  

    const {approvalInfoDone} = this.props;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {} = this.props;
    /**approvalInfo是这条申请单的所有审批记录 */
    
    /**对approvalInfo进行循环遍历 */
    
    

        
  
    
    /**已办的查看页面，只需要显示已经审批的意见，没有的不用显示*/
    /**提交功能的（页面） TODO 直接用金亭那边的*/
    if(leaveApplyInfo !== null && leaveApplyInfo !== '' && leaveApplyInfo !== undefined)
    {
      if(Cookie.get('userid')===leaveApplyInfo.create_person_id){
        //如果是本人
        if(leaveApplyInfo.status!=='0'){
          this.state.itemInfoFlag = true;
          console.log("");
        }else{
          this.state.itemInfoFlag = false;
          console.log("本人");
        }
      }else{
        //如果是审核人
        this.state.itemInfoFlag = true;
        console.log("审核人");
      }
    }

    
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

    /**封装审批完成的意见（页面） */
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
      {leaveApplyInfo.status==='0'?
      null
      :
      <br></br>
      }   
      </div>
    );

    //选择一下处理人信息
    let nextDataList = this.props.nextDataList;
    //下一环节名称
    let nextPostName = '';
    //下一环节处理人
    let initperson = '';
    let nextdataList = null;
    if(nextDataList !== undefined)
    {
      if (nextDataList.length>0){
        initperson = nextDataList[0].submit_user_id;
        nextPostName = nextDataList[0].submit_post_name;
      }
      nextdataList = nextDataList.map(item =>
        <Option value={item.submit_user_id}>{item.submit_user_name}</Option>
      );
    }
    

    
    

    return (
      <div>
      <Form> 
      <div>
      <Row span={2} style={{ textAlign: 'center' }}><h1>员工离职申请表</h1></Row>
        <br/><br/>
        {/**隐藏域 --------------开始*/}
        <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout2} style={{display:"none"}}>
              {getFieldDecorator('leave_apply_id',{
                initialValue:leaveApplyInfo.leave_apply_id
              })(<Input style={inputstyle} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row>

        <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout2} style={{display:"none"}}>
              {getFieldDecorator('create_person_id',{
                initialValue:leaveApplyInfo.create_person_id
              })(<Input style={inputstyle} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row>
        <Row style={{display: "none"}}>
          <Col span={12} >
            <FormItem  {...formItemLayout2} style={{display:"none"}}>
              {getFieldDecorator('dept_id',{
                initialValue:leaveApplyInfo.dept_id
              })(<Input style={inputstyle} placeholder = "" style={{display:"none"}}/>)}
             </FormItem>
          </Col>
        </Row>
        {/**隐藏域----------------结束 */}
        <Row  gutter={12} >
          {/*姓名*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'姓名'} {...formItemLayout2}>
              {getFieldDecorator('create_person_name',{
                initialValue:leaveApplyInfo.create_person_name
              })(<Input style={inputstyle} placeholder = "" disabled={true}/>)}
             </FormItem>
          </Col>
          
            {/*部门*/}
          <Col span={12} style={{ display : 'block' }}>
            <FormItem label={'部门'} {...formItemLayout3}>
             {getFieldDecorator('dept_name',{
               initialValue: leaveApplyInfo.dept_name
             })(<Input style={inputstyle} placeholder = "" disabled={true}/>)}
            </FormItem>
          </Col>
        </Row>
        
        {leaveApplyInfo.status==='0'?
          null
        :
          <br></br>
        }
        <Row  gutter={12}>
          {/*岗位名称*/}
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label={'岗位名称'} {...formItemLayout2}>
              {getFieldDecorator('position_title',{
                initialValue:leaveApplyInfo.position_title,
                rules: [
                  {
                    required: true,
                    message: '请填写您的岗位名称'
                  },
                ],
              })(<Input style={inputstyle} placeholder = "例：软件研发岗位" disabled={this.state.itemInfoFlag}/>)}
            </FormItem>
            
            
          </Col>
          {/*岗位级别*/}
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label={'岗位级别'} {...formItemLayout3}>
            {getFieldDecorator('position_level',{
              initialValue:leaveApplyInfo.position_level,
              rules: [
                {
                  required: true,
                  message: '请填写您的岗位级别'
                },
              ],
            })(<Input style={inputstyle} placeholder = "例：08A/T1.1" disabled={this.state.itemInfoFlag}/>)}
          </FormItem>
            
          </Col>
        </Row>
        
        {leaveApplyInfo.status==='0'?
        null
        :
        <br></br>
        }

        <Row  gutter={12}>
          {/*入职时间*/}
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label={'入职日期'} {...formItemLayout2}>
              {getFieldDecorator('start_time',{
                  initialValue:moment(start_time,'YYYY-MM-DD'),
                  rules: [
                    {
                      required: true,
                      message: '请选择入职日期'
                    },
                  ],
                })(
                  <DatePicker
                    placeholder="入职日期"
                    style={{ width: '100%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                    disabled={false}
                  />
                )}
              {/* <Input style={inputstyle} value = {start_time} disabled={this.state.itemInfoFlag}/> */}
            </FormItem>
            
          </Col>
          {/*离职时间*/}
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label={'离职日期'} {...formItemLayout3}>
              {getFieldDecorator('leave_time',{
                  initialValue:moment(leave_time,'YYYY-MM-DD'),
                  rules: [
                    {
                      required: true,
                      message: '请选择离职日期'
                    },
                  ],
                })(
                  <DatePicker
                    placeholder="离职日期"
                    style={{ width: '100%' }}
                    disabled={false}
                    format="YYYY-MM-DD"
                  />
                )}
              
              
              
              {/* <Input style={inputstyle} value = {leave_time} disabled={this.state.itemInfoFlag}/> */}
            </FormItem>
            
          </Col>
        </Row>

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        {/**电话和离职种类 */}
        <Row  gutter={12}>
          
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label="联系方式" hasFeedback {...formItemLayout2}>
            {getFieldDecorator('contact', {
              initialValue:leaveApplyInfo.contact,
              rules: [
                {
                  required: true,
                  pattern: /^1[34578]\d{9}$/,
                  message: "输入手机号不合法！",
                },
              ],
            })(<Input style={inputstyle} value = "您的常用手机号" disabled={this.state.itemInfoFlag}/>)}
            </FormItem>
            
          </Col>
          
          <Col span={12} style={{ display : 'block' }}>
            
            <FormItem label="离职种类" {...formItemLayout3} >
            {getFieldDecorator('leave_type',{
              initialValue:leaveApplyInfo.leave_type,
              rules: [
                {
                  required: true,
                  message: '请选择离职种类'
                },
              ],
            })(
              <Select style={inputstyle} placeholder="请选择离职种类" disabled={this.state.itemInfoFlag}>
                <Option value="辞职">辞职</Option>
                <Option value="辞退">辞退</Option>
                <Option value="合同到期">合同到期</Option>
              </Select>
            )}
          </FormItem>
            
          </Col>
        </Row>
        

        

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        <Row gutter={12}>
          <Col >
            
            
            <FormItem label="离职-公司原因" {...formItemLayout} >
              {getFieldDecorator('company_reason',{
                initialValue:(leaveApplyInfo.company_reason||" ").split(","),
                rules: [
                  {
                    required: true,
                    message: '请选择离职的公司原因'
                  },
                ],
              })(
                <Checkbox.Group >
                  <Row style={{ textAlign: 'left' }}>
                    <Col span={8}><Checkbox value="薪资偏低">薪资偏低</Checkbox></Col>
                    <Col span={8}><Checkbox value="晋升机会">晋升机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作时间长">工作时间长</Checkbox></Col>
                    <Col span={8}><Checkbox value="人际关系">人际关系</Checkbox></Col>
                    <Col span={8}><Checkbox value="福利不佳">福利不佳</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作环境">工作环境</Checkbox></Col>
                    <Col span={8}><Checkbox value="无法适应工作内容">无法适应工作内容</Checkbox></Col>
                    <Col span={8}><Checkbox value="交通不便">交通不便</Checkbox></Col>
                    <Col span={8}><Checkbox value="不满公司的政策与措施">不满公司的政策与措施</Checkbox></Col>
                    <Col span={8}><Checkbox value="没有事业发展机会">没有事业发展机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="缺少培训机会">缺少培训机会</Checkbox></Col>
                    <Col span={8}><Checkbox value="工作量少、枯燥">工作量少、枯燥</Checkbox></Col>
                    <Col span={8}><Checkbox value="同事关系不融洽">同事关系不融洽</Checkbox></Col>
                    <Col span={8}><Checkbox value="与上司关系不融洽">与上司关系不融洽</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
                )}
            </FormItem>
            
          </Col>
        </Row>
        
        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }
        
        <Row gutter={12}>
          <Col >
            {/*姓名*/}
            
            <FormItem label="离职-个人原因" {...formItemLayout} >
              {getFieldDecorator('self_reason',{
                initialValue:(leaveApplyInfo.self_reason||" ").split(","),
                rules: [
                  {
                    required: true,
                    message: '请选择离职的个人原因'
                  },
                ],
              })(
                <Checkbox.Group>
                  <Row style={{ textAlign: 'left' }}>
                    <Col span={8}><Checkbox value="健康因素">健康因素</Checkbox></Col>
                    <Col span={8}><Checkbox value="家庭因素">家庭因素</Checkbox></Col>
                    <Col span={8}><Checkbox value="上学进修">上学进修</Checkbox></Col>
                    <Col span={8}><Checkbox value="找到更好的工作">找到更好的工作</Checkbox></Col>
                    <Col span={8}><Checkbox value="自己经营生意">自己经营生意</Checkbox></Col>
                    <Col span={8}><Checkbox value="转行换业">转行换业</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
              )}
            </FormItem>
            
          </Col>
        </Row>

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        <Row gutter={12}>
          <Col >
            {/*其他离职原因*/}
            
            <FormItem label="其他离职原因" {...formItemLayout} >
              {getFieldDecorator('other_reason',{
                initialValue:leaveApplyInfo.other_reason,
                rules: [
                  {
                    required: false,
                    message: '请描述离职的其他方面的原因'
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 ,color:'#000'}}
                  placeholder="您的其他离职原因"
                  rows={4}
                  disabled={this.state.itemInfoFlag}
                />
              )}
            </FormItem>
            
          </Col>
        </Row>

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        <Row gutter={12}>
          <Col>
            {/*离职去向*/}
            
            <FormItem label="离职去向" {...formItemLayout} >
              {getFieldDecorator('leave_gone',{
                initialValue:leaveApplyInfo.leave_gone,
                rules: [
                  {
                    required: true,
                    message: '请告知离职去向！'
                  },
                ],
                })(
                <TextArea
                style={{ minHeight: 32 ,color:'#000'}}
                placeholder="离职去向"
                rows={4}
                disabled={this.state.itemInfoFlag}
              />
              )}
            </FormItem>
            
          </Col>
        </Row>

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        <Row gutter={12}>
          <Col >
            {/*您对部门的建议*/}
            
            <FormItem label="您对部门的建议" {...formItemLayout} >
              {getFieldDecorator('dept_advice',{
                initialValue:leaveApplyInfo.dept_advice,
                rules: [
                  {
                    required: true,
                    message: '企业文化、工作环境、内部人际关系等方面'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 ,color:'#000'}}
                placeholder="您对部门的建议"
                rows={4}
                disabled={this.state.itemInfoFlag}
              />
              )}
            </FormItem>
            
          </Col>
        </Row>
        
        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }
        
        <Row gutter={12}>
          <Col>
            {/*您对公司的建议（企业文化、工作环境、内部人际关系等方面）*/}
            
            <FormItem label="您对公司的建议" {...formItemLayout} >
              {getFieldDecorator('company_advice',{
                initialValue:leaveApplyInfo.company_advice,
                rules: [
                  {
                    required: true,
                    message: '企业文化、工作环境、内部人际关系等方面'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 ,color:'#000'}}
                placeholder="您对公司的建议"
                rows={4}
                disabled={this.state.itemInfoFlag}
              />
              )}
            </FormItem>
            
          </Col>
        </Row>

        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        <Row gutter={12}>
          <Col>
            {/*申请人意见*/}
            
            <FormItem label="申请人意见" {...formItemLayout} >
              {getFieldDecorator('self_advice',{
                initialValue:leaveApplyInfo.self_advice,
                rules: [
                  {
                    required: true,
                    message: '您有什么意见'
                  },
                ],
              })(
                <TextArea
                style={{ minHeight: 32 ,color:'#000'}}
                placeholder="您的意见"
                rows={4}
                disabled={this.state.itemInfoFlag}
              />
              )}
            </FormItem>
            
          </Col>
        </Row>
        
        {leaveApplyInfo.status==='0'?
          null
          :
          <br></br>
        }

        {/**------------------------------------------循环显示审批意见，除了状态为未提交的，其他情况都显示审批意见------------------------------------- */}
        { leaveApplyInfo.status === '0'?
          <br></br>
          : //TODO  有多少审批意见就显示多少
          approvalInfoDoneHtml
        }
       
        </div>
        {
          leaveApplyInfo.status === '0'?  //未提交的申请。其他的情况（审批中1，审批完成2，驳回3）只显示返回和打印
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={this.goBack}>返回</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit" onClick={this.selectNext} disabled={!this.state.isSubmitClickable}>{this.state.isSubmitClickable? '提交' : '正在处理中...'}</Button>
            <Modal
              title="流程处理"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <div>
                <Form>
                  <FormItem label={'下一步环节'} {...formItemLayout}>
                        <Input style={inputstyle} value = {nextPostName} disabled={true}/>
                      </FormItem>
                      <FormItem label={'下一处理人'} {...formItemLayout}>
                        {getFieldDecorator('nextStepPerson',{
                          initialValue: initperson
                        })(
                          <Select size="large" width={"70%"} initialValue={initperson} placeholder="请选择下一环节处理人">
                            {nextdataList}
                          </Select>
                        )}
                      </FormItem>
                 </Form>
               </div>
            </Modal>
            </Col>
          </Row>
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


        

      </Form>
      </div>
    );
  }
}



function mapStateToProps(state) {

  return {
    loading: 
    state.loading.models.staff_leave_index_model,
    ...state.staff_leave_index_model,

  };
}
CheckLeave = Form.create()(CheckLeave);
export default connect(mapStateToProps)(CheckLeave)
